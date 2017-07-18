define([], function () {
	'use strict';

    var file = {"69efc2ee-a057-49a8-b7d3-71fadec00455":{"composition":["c195b041-5125-427e-81f6-da0e5a326151","ff1f653f-d7b7-415f-b043-e268c0234db9"],"name":"diect","type":"folder","modified":1500401096359,"location":"mine","persisted":1500401096359},"c195b041-5125-427e-81f6-da0e5a326151":{"composition":["6fc3799b-0b86-420b-a423-35562edeef2d"],"name":"str8 to the dome","type":"folder","modified":1500401072344,"location":"69efc2ee-a057-49a8-b7d3-71fadec00455","persisted":1500401072344},"ff1f653f-d7b7-415f-b043-e268c0234db9":{"composition":["a7f52a97-ad9d-47a7-8186-a31b9bde7d5a","857352cb-78c3-46ef-b541-7f05f677e280"],"name":"a","type":"folder","modified":1500396022440,"location":"mine","persisted":1500396022440},"6fc3799b-0b86-420b-a423-35562edeef2d":{"composition":["6fd118c8-d683-48da-b389-f63544b88608","6295c7a0-148d-40ed-8625-94b4373cdec2","a1b1aafc-1a93-41b5-a9d0-12912377a0ba"],"name":"2erweqrw23","type":"folder","modified":1500401083139,"location":"c195b041-5125-427e-81f6-da0e5a326151","persisted":1500401083139},"a7f52a97-ad9d-47a7-8186-a31b9bde7d5a":{"composition":["c3e4d73a-ff48-44cb-8de3-e7b71ac69004"],"name":"b","type":"folder","modified":1500355561576,"location":"ff1f653f-d7b7-415f-b043-e268c0234db9","persisted":1500355561576},"857352cb-78c3-46ef-b541-7f05f677e280":{"composition":["6ba9cbbf-6c96-4161-9ee8-bda96db8047c"],"name":"a","type":"folder","modified":1500396022439,"location":"ff1f653f-d7b7-415f-b043-e268c0234db9","persisted":1500396022439},"6fd118c8-d683-48da-b389-f63544b88608":{"telemetry":{"values":[{"name":"Time","key":"utc","format":"utc","hints":{"domain":1}},{"name":"Image","key":"url","format":"image","hints":{"image":1}}]},"name":"Space Stuff","type":"example.imagery","modified":1499979186024,"location":"mine","persisted":1499979186024},"6295c7a0-148d-40ed-8625-94b4373cdec2":{"name":"Docs","type":"example.page","notes":"\"I'm being productive!\"","url":"https://nasa.github.io/openmct/docs/tutorials/#introduction","modified":1499979200171,"location":"mine","persisted":1499979200171},"a1b1aafc-1a93-41b5-a9d0-12912377a0ba":{"composition":["be8d3b88-2a27-4696-90ee-2c0cd8bc66e2","5fdd43db-9efa-4bcc-8b2c-c74926e3684c"],"name":"somethingcrazy","type":"folder","modified":1500354372521,"location":"mine","persisted":1500354372521},"c3e4d73a-ff48-44cb-8de3-e7b71ac69004":{"composition":["b9374122-264f-40bb-bd54-fc0c4ba34b45"],"name":"c","type":"folder","modified":1500355561577,"location":"a7f52a97-ad9d-47a7-8186-a31b9bde7d5a","persisted":1500355561577},"6ba9cbbf-6c96-4161-9ee8-bda96db8047c":{"composition":["3d57e9dc-0475-4867-9043-9fc9e1ad77ca"],"name":"b","type":"folder","modified":1500396022439,"location":"857352cb-78c3-46ef-b541-7f05f677e280","persisted":1500396022439},"be8d3b88-2a27-4696-90ee-2c0cd8bc66e2":{"telemetry":{"values":[{"name":"Time","key":"utc","format":"utc","hints":{"domain":1}},{"name":"Image","key":"url","format":"image","hints":{"image":1}}]},"name":"nutfd","type":"example.imagery","modified":1500354372520,"location":"a1b1aafc-1a93-41b5-a9d0-12912377a0ba","persisted":1500354372520},"5fdd43db-9efa-4bcc-8b2c-c74926e3684c":{"composition":["1eec9995-5553-48ce-bfd5-65cbbf9af1e8"],"name":"secrets","type":"folder","modified":1500354372523,"location":"a1b1aafc-1a93-41b5-a9d0-12912377a0ba","persisted":1500354372523},"b9374122-264f-40bb-bd54-fc0c4ba34b45":{"composition":[],"name":"d","type":"folder","modified":1500355561577,"location":"c3e4d73a-ff48-44cb-8de3-e7b71ac69004","persisted":1500355561577},"3d57e9dc-0475-4867-9043-9fc9e1ad77ca":{"composition":["b79e5ebc-54e0-4517-af54-897561f4110b"],"name":"c","type":"folder","modified":1500396022440,"location":"6ba9cbbf-6c96-4161-9ee8-bda96db8047c","persisted":1500396022440},"1eec9995-5553-48ce-bfd5-65cbbf9af1e8":{"telemetry":{"period":10,"amplitude":1,"offset":0,"dataRateInHz":1,"values":[{"key":"utc","name":"Time","format":"utc","hints":{"domain":1}},{"key":"yesterday","name":"Yesterday","format":"utc","hints":{"domain":2}},{"key":"sin","name":"Sine","hints":{"range":1}},{"key":"cos","name":"Cosine","hints":{"range":2}}]},"name":";)","type":"generator","modified":1500354372523,"location":"5fdd43db-9efa-4bcc-8b2c-c74926e3684c","persisted":1500354372523},"b79e5ebc-54e0-4517-af54-897561f4110b":{"composition":[],"name":"d","type":"folder","modified":1500396022440,"location":"3d57e9dc-0475-4867-9043-9fc9e1ad77ca","persisted":1500396022440}};
    
    function ImportAsJSONAction(exportService, openmct, identifierService, context) {
        this.exportService = exportService;
        this.openmct = openmct;
        this.identifierService = identifierService;
        this.context = context;
    };

    ImportAsJSONAction.prototype.perform = function() {
    	var parent = this.context.domainObject;

    	// Generate tree with newly created ids
        var tree = this.generateNewTree(file);

        // Instantiate root object w/ its new id
        var objectToImport = parent.useCapability("instantiation", 
        	tree[Object.keys(tree)[0]]);
        objectToImport.getCapability("location").setPrimaryLocation(parent.getId());

        // Instantiate all objects in tree with their newly genereated ids,
        // adding each to its rightful parent's composition
        this.deepInstantiate(objectToImport, tree);

        // Add root object to the composition of the parent
        parent.getCapability("composition").add(objectToImport);
    };

    // Traverses object tree, instantiates all domain object w/ new IDs and 
    //adds to parent's composition
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

	// For each domain object in the file, generate new ID, replace in JSON
    ImportAsJSONAction.prototype.generateNewTree = function(tree) {
    	Object.keys(tree).forEach(function (domainObjectId) {
                var newId = this.identifierService.generate();
                tree = this.rewriteId(domainObjectId, newId, tree);    
        }, this);
        return tree;
    };

    // can stringify once, then preform all replaces, then parse
    // Generates new random id, replacs new id in tree then returns tree
    ImportAsJSONAction.prototype.rewriteId = function (oldID, newID, tree) {
        tree = JSON.stringify(tree).replace(new RegExp(oldID, 'g'), newID);
        return JSON.parse(tree);
    };
    
    ImportAsJSONAction.appliesTo = function (context) {
        return context.domainObject !== undefined;
    };

    return ImportAsJSONAction;
});
