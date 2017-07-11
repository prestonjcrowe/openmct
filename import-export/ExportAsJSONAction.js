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
        this.openmct.objects.get(domainObject.getId())
            .then(function (object) {
                this.exportService.exportJSON(object);
                console.log('object: ' + object)
            }.bind(this));
            console.log('domain object: ' + JSON.stringify(domainObject));

        //this.exportService.exportJSON(domainObject);
    }; 

    ExportAsJSONAction.appliesTo = function (context) {
        return context.domainObject !== undefined;
    };

    return ExportAsJSONAction;
});