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
        this.exportService.exportJSON(domainObject.getModel(), 
            {filename:  Date.now() + '.json'});

        domainObject.useCapability('composition').then(function (children) {
            children.forEach(function (child) {
                console.log('child: ' + JSON.stringify(child.getModel()));
            })
        })
    }; 

    ExportAsJSONAction.appliesTo = function (context) {
        return context.domainObject !== undefined;
    };

    return ExportAsJSONAction;
});