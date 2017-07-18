define([], function () {
    'use strict';

    function ExportAsJSONAction(exportService, context) {
        this.exportService = exportService;
        this.context = context;
        this.count = 0;
    }

    ExportAsJSONAction.prototype.perform = function() {
        this.contructJSON(this.context.domainObject);
    }; 

    ExportAsJSONAction.prototype.appliesTo = function (context) {
        return context.domainObject !== undefined;
    };

    ExportAsJSONAction.prototype.contructJSON = function (rootObject) {
        var objJSON = {};
        objJSON[rootObject.getId()] = rootObject.getModel();

        this.write(objJSON, rootObject, function (result) {
            this.exportService.exportJSON(result, 
                {filename:  Date.now() + '.json'});
        }.bind(this));
    };

    ExportAsJSONAction.prototype.write = function (struct, domainObject, callback) {
        this.count++;
        if (domainObject.hasCapability('composition')) {
            domainObject.useCapability('composition')
                .then(function (children) {
                    children.forEach(function (child) { 
                        struct[child.getId()] = child.getModel();
                        this.write(struct, child, callback);            
                    }.bind(this));
                    this.count--;
                    if (this.count === 0) {
                        callback(struct);
                    }
                }.bind(this))
        } else {
            this.count--;
            if (this.count === 0) {
                callback(struct);
            }
        }
    };

    return ExportAsJSONAction;
});