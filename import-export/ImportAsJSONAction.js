define([], function () {
	'use strict';

	 //var exampleJSON = {"de64b6fc-5a3b-40cc-a2ea-48a4082f636a":{"composition":["0334d039-532f-46b9-8f77-bd476c6b6095"],"name":"a","type":"folder","modified":1500335947588,"location":"mine","persisted":1500335947588},"0334d039-532f-46b9-8f77-bd476c6b6095":{"composition":["c9d25f68-15d7-4c10-ae41-ccc97bbfecc9"],"name":"b","type":"folder","modified":1500335952327,"location":"de64b6fc-5a3b-40cc-a2ea-48a4082f636a","persisted":1500335952327},"c9d25f68-15d7-4c10-ae41-ccc97bbfecc9":{"composition":["45b66ad9-9a40-47fe-9801-2f874f0199a6"],"name":"c","type":"folder","modified":1500335958970,"location":"0334d039-532f-46b9-8f77-bd476c6b6095","persisted":1500335958970},"45b66ad9-9a40-47fe-9801-2f874f0199a6":{"composition":[],"name":"d","type":"folder","modified":1500335958963,"location":"c9d25f68-15d7-4c10-ae41-ccc97bbfecc9","persisted":1500335958963}};
	 var exampleJSON = {"root":{"composition":["da4eed91-e742-44ad-b322-e45eb2b76130","0f9e08e3-f444-4d55-822f-1ed447f9201b"],"name":"somethingcrazy","type":"folder","modified":1500354308815,"location":"mine","persisted":1500354308815},"da4eed91-e742-44ad-b322-e45eb2b76130":{"telemetry":{"values":[{"name":"Time","key":"utc","format":"utc","hints":{"domain":1}},{"name":"Image","key":"url","format":"image","hints":{"image":1}}]},"name":"nutfd","type":"example.imagery","modified":1500354298184,"location":"36aa6517-178a-4fe7-acc9-f81cc1bfbd95","persisted":1500354298184},"0f9e08e3-f444-4d55-822f-1ed447f9201b":{"composition":["20f7a101-fc24-4458-baff-1b28fa64422b"],"name":"secrets","type":"folder","modified":1500354322538,"location":"36aa6517-178a-4fe7-acc9-f81cc1bfbd95","persisted":1500354322538},"20f7a101-fc24-4458-baff-1b28fa64422b":{"telemetry":{"period":10,"amplitude":1,"offset":0,"dataRateInHz":1,"values":[{"key":"utc","name":"Time","format":"utc","hints":{"domain":1}},{"key":"yesterday","name":"Yesterday","format":"utc","hints":{"domain":2}},{"key":"sin","name":"Sine","hints":{"range":1}},{"key":"cos","name":"Cosine","hints":{"range":2}}]},"name":";)","type":"generator","modified":1500354322538,"location":"0f9e08e3-f444-4d55-822f-1ed447f9201b","persisted":1500354322538}};
    
    function ImportAsJSONAction(exportService, openmct, identifierService, context) {
        this.exportService = exportService;
        this.openmct = openmct;
        this.identifierService = identifierService;
        this.context = context;
    };

    ImportAsJSONAction.prototype.perform = function() {
    	var parent = this.context.domainObject;

        var objectTree = this.generateNewTree(exampleJSON[Object.keys(exampleJSON)[0]], exampleJSON);
        var objectToImport = parent.useCapability("instantiation", objectTree[Object.keys(objectTree)[0]]);

        objectToImport.getCapability("location").setPrimaryLocation(parent.getId());
        this.deepInstantiate(objectToImport, objectTree);
        parent.getCapability("composition").add(objectToImport);
    };

    // Traverses object tree, instantiates all domain object w/ new IDs and 
    // adds to parent's composition
    ImportAsJSONAction.prototype.deepInstantiate = function (parent, tree) {
    	var instantiate = this.openmct.$injector.get('instantiate');

    	if (parent.hasCapability("composition")) {
    		var parentModel = parent.getModel();
    		parentModel.composition.forEach(function (childId, index) {
    			var newObject = instantiate(tree[childId], childId);
    			parent.getCapability("composition").add(newObject);
    			// if meant to be a link, dont set primary location (?)
    			newObject.getCapability("location").setPrimaryLocation(parent.getId());
    			this.deepInstantiate(newObject, tree);  			
    		}, this)
    	}
    };

    ImportAsJSONAction.prototype.generateNewTree = function(child, struct) {
    	// for each domain object in the file, generate new ID, replace in JSON
    	Object.keys(struct).forEach(function (domainObjectId) {
                var newId = this.identifierService.generate();
                struct = this.rewriteId(domainObjectId, newId, struct);    
        }, this);
        return struct;
    };

    // can stringify once, then preform all replaces, then parse
    // Generates new random id, replaces new id in tree then returns tree
    ImportAsJSONAction.prototype.rewriteId = function (oldID, newID, struct) {
        struct = JSON.stringify(struct).replace(new RegExp(oldID, 'g'), newID);
        return JSON.parse(struct);
    };
    
    ImportAsJSONAction.appliesTo = function (context) {
        return context.domainObject !== undefined;
    };

    return ImportAsJSONAction;
});
