define([], function () {
    'use strict';

    function ExportAsJSONAction(exportService, context) {
        this.exportService = exportService;
        this.context = context;
        this.calls = 0;
    }

    ExportAsJSONAction.prototype.perform = function() {
        this.contructJSON(this.context.domainObject);
    }; 

    ExportAsJSONAction.prototype.appliesTo = function (context) {
        return context.domainObject !== undefined &&
            context.domainObject.hasCapability("creation");
    };

    ExportAsJSONAction.prototype.contructJSON = function (rootObject) {
        var tree = {};
        tree[rootObject.getId()] = rootObject.getModel();

        this.write(tree, rootObject, function (result) {
            this.exportService.exportJSON(result, 
                {filename:  rootObject.getModel().name + '.json'});
        }.bind(this));
    };

    ExportAsJSONAction.prototype.write = function (tree, domainObject, callback) {
        this.calls++;
        if (domainObject.hasCapability('composition')) {
            domainObject.useCapability('composition')
                .then(function (children) {
                    children.forEach(function (child) { 
                        tree[child.getId()] = child.getModel();
                        this.write(tree, child, callback);
                    }.bind(this));
                    this.calls--;
                    if (this.calls === 0) {
                        callback(this.wrap(tree));
                    }
                }.bind(this))
        } else {
            this.calls--;
            if (this.calls === 0) {
                callback(this.wrap(tree));
            }
        }
    };

	ExportAsJSONAction.prototype.wrap = function (tree) {
		return {'openmct': tree};
	};

    return ExportAsJSONAction;
});
