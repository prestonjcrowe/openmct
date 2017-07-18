define([], function () {
	'use strict';

	var file = {
		"9a62586f-4c79-4e6f-a78c-036dcf23feb1": {
			"composition": ["dd3cf02c-eca8-43a5-9c47-c0ee307d5a10"],
			"name": "a",
			"type": "folder",
			"modified": 1500404299825,
			"location": "mine",
			"persisted": 1500404299825
		},
		"dd3cf02c-eca8-43a5-9c47-c0ee307d5a10": {
			"composition": ["185493a8-d534-4b5c-bdbd-f23bbcb6999f"],
			"name": "b",
			"type": "folder",
			"modified": 1500404306093,
			"location": "9a62586f-4c79-4e6f-a78c-036dcf23feb1",
			"persisted": 1500404306093
		},
		"185493a8-d534-4b5c-bdbd-f23bbcb6999f": {
			"composition": ["1a6026e7-b054-4031-9e18-ac69a0128747"],
			"name": "c",
			"type": "folder",
			"modified": 1500404312482,
			"location": "dd3cf02c-eca8-43a5-9c47-c0ee307d5a10",
			"persisted": 1500404312482
		},
		"1a6026e7-b054-4031-9e18-ac69a0128747": {
			"composition": [],
			"name": "d",
			"type": "folder",
			"modified": 1500404312476,
			"location": "185493a8-d534-4b5c-bdbd-f23bbcb6999f",
			"persisted": 1500404312476
		}
	};

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
