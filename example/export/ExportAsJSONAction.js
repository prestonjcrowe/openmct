define([], function () {
    'use strict';

    function ExportAsJSONAction(exportService, context, openmct) {
        this.exportService = exportService;
        this.context = context;
        this.openmct = openmct;
        console.log(openmct);
    }

    ExportAsJSONAction.prototype.perform = function() {
        var context = this.context;
        var domainObject = this.context.domainObject;
        this.openmct.objects.get(domainObject)
            .then(function (object) {
                console.log(object);
            });
        this.exportService.exportJSON(domainObject);
        return true;
    }; 

    ExportAsJSONAction.appliesTo = function (context) {
        return context.domainObject !== undefined;
    };

    return ExportAsJSONAction;
});