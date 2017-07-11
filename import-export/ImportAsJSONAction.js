define([], function () {
    'use strict';

    var SAMPLE = '{"telemetry":{"values":[{"name":"Time","key":"utc","format":"utc","hints":{"domain":1,"priority":0},"source":"utc"},{"name":"Image","key":"url","format":"image","hints":{"image":1,"priority":1},"source":"url"}]},"name":"slayer","type":"example.imagery","modified":1498776755151,"location":"mine","persisted":1498776755151,"identifier":{"namespace":"","key":"80512ae7-1007-419a-93bb-0373067e9087"}}';

    function ImportAsJSONAction(exportService, openmct, context) {
        this.exportService = exportService;
        this.context = context;
        this.openmct = openmct;
    }

    ImportAsJSONAction.prototype.perform = function() {
        var context = this.context;
        var domainObject;

        var objectToImport = JSON.parse(SAMPLE);

        this.openmct.objects.get(this.context.domainObject.getId())
            .then(function (object) {
                domainObject = object;  // context
                console.log(domainObject);
                objectToImport.location = domainObject.identifier.key;
                domainObject.composition.push(objectToImport.identifier);

                this.context.domainObject.getCapability("composition")
                    .add(this.context.domainObject)
                    .then(function (importedObject) {
                        console.log(importedObject)
                        this.context.domainObject.getCapability("persistence").persist();
                    }.bind(this));
            }.bind(this));

        
        //domainObject.getModel().location = context.getId();

        
    }; 

    ImportAsJSONAction.appliesTo = function (context) {
        return context.domainObject !== undefined;
    };

    return ImportAsJSONAction;
});