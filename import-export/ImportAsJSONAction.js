define(['zepto'], function ($) {
	'use strict';
    
    var IMPORT_FORM = {
        name: "Import as JSON",
        sections: [{
            name: "Import A File",
            rows: [{
                name: 'Select File',
                key: 'select-file',
                control: 'button',
                required: true,
                text: 'Select file',
                click: function () {
                    var input = $(document.getElementById('file-input'));
                    var setText = function(text) {
                        this.text = text;
                    }.bind(this);
                    input.change(function() { 
                        setText(this.files[0]['name']);                        
                    });
                    input.trigger('click');
                }
            }]
        }]
    };

    function ImportAsJSONAction(exportService, identifierService, dialogService, openmct, context) {

        this.exportService = exportService;
        this.openmct = openmct;
        this.identifierService = identifierService;
        this.dialogService = dialogService;
        this.context = context;
        this.instantiate = openmct.$injector.get('instantiate');

        if (!document.getElementById('file-input')) {
            this.fileInput = $(document.createElement('input'));
            this.fileInput.attr("type", "file");
            this.fileInput.attr("id", "file-input");
            $("html").append(this.fileInput);
        }
        
    };

    ImportAsJSONAction.prototype.perform = function() {
        this.dialogService.getUserInput(IMPORT_FORM, {})
            .then(function (result){
                var input = document.getElementById('file-input');
                this.readFile(input.files[0])
                    .then(function (result) {
                        input.value = '';
                        input.remove();
                        this.resetButtonText(IMPORT_FORM);
                        this.beginImport(result);
                    }.bind(this))
            }.bind(this));
    };

    ImportAsJSONAction.prototype.readFile = function (file) {
        var contents = '';
        var fileReader = new FileReader();

        return new Promise(function (resolve, reject) {
            fileReader.onload = function (event) {
                contents = JSON.parse(event.target.result);
                resolve(contents);
            };

            fileReader.onerror = function () {
                return reject(contents);
            };
            fileReader.readAsText(file);
        })

    }

    ImportAsJSONAction.prototype.beginImport = function (file) {
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

    	if (parent.hasCapability("composition")) {
    		var parentModel = parent.getModel();
    		parentModel.composition.forEach(function (childId, index) {
    			var newObject = this.instantiate(tree[childId], childId);
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

    ImportAsJSONAction.prototype.resetButtonText = function (dialogModel) {
        dialogModel['sections'][0]['rows'][0].text = "Select file";
    };    
    ImportAsJSONAction.appliesTo = function (context) {
        return context.domainObject !== undefined && 
            context.domainObject.hasCapability("composition");
    };

    return ImportAsJSONAction;
});
