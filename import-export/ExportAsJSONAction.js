define([], function () {
    'use strict';

    function ExportAsJSONAction(exportService, openmct, context) {
        this.exportService = exportService;
        this.context = context;
        this.openmct = openmct;
    }

    ExportAsJSONAction.prototype.perform = function() {
        var context = this.context;
        var domainObject = this.context.domainObject;
        // this.exportService.exportJSON(domainObject.getModel(), 
        //     {filename:  Date.now() + '.json'});

        this.contructJSON(domainObject);
    }; 

    ExportAsJSONAction.prototype.appliesTo = function (context) {
        return context.domainObject !== undefined;
    };

    ExportAsJSONAction.prototype.contructJSON = function (rootObject) {
        var objJSON = {};
        objJSON["root"] = rootObject.getModel();
        this.writeChildren(objJSON, rootObject)
            .then(function (result) {
                // return objJSON here, OR exportJSON(objJSON) here
                this.exportService.exportJSON(objJSON, 
                    {filename:  Date.now() + '.json'});
                console.log(JSON.stringify(objJSON));
            }.bind(this));
        
    };

    // broken! only goes 1 layer deep
    ExportAsJSONAction.prototype.writeChildren = function (struct, domainObject) {
        if (domainObject.hasCapability('composition')) {
            return domainObject.useCapability('composition').then(function (children) {
                children.forEach(function (child) {
                    struct[child.getId()] = child.getModel();
                    console.log('child |' + child.getId() + '| ' + JSON.stringify(child.getModel()));
                    this.writeChildren(struct, child);
                }.bind(this))
            }.bind(this));
        } else {

            return Promise.resolve();
        }
    };

    return ExportAsJSONAction;
});