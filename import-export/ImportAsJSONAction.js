// need to validate new location with policy service

define([], function () {
    'use strict';

    var sampleModel = {
        "composition":["6fd118c8-d683-48da-b389-f63544b88608","6295c7a0-148d-40ed-8625-94b4373cdec2"],
        "name":"foldy",
        "type":"folder",
        "modified":1499963825849,
        "location":"mine",
        "persisted":1499963825849
    };

    function ImportAsJSONAction(exportService, openmct, context) {
        this.exportService = exportService;
        this.context = context;
        this.openmct = openmct;
    }

    ImportAsJSONAction.prototype.perform = function() {
        var parent = this.context.domainObject;
        var objectToImport = sampleModel;
        var clone;
      
        clone = parent.useCapability("instantiation", objectToImport);
        parent.getCapability("composition")
            .add(clone)
            .then(function (importedObject) {
                clone.getCapability("persistence").persist();
                parent.getCapability("persistence").persist();
            }.bind(this));
    }; 

    ImportAsJSONAction.appliesTo = function (context) {
        return context.domainObject !== undefined;
    };

    return ImportAsJSONAction;
});