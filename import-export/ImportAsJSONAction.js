/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2017, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/
 
define(['zepto'], function ($) {
	'use strict';
    
    var IMPORT_FORM = {
        name: "Import as JSON",
        sections: [{
            name: "Import A File",
            rows: [{
                name: 'Select File',
                key: 'select-file',
                control: 'import-json',
                required: true,
                text: 'Select File'
            }]
    	}]
    };

    function ImportAsJSONAction(exportService, identifierService, dialogService,
         openmct, context) {

        this.exportService = exportService;
        this.openmct = openmct;
        this.identifierService = identifierService;
        this.dialogService = dialogService;
        this.context = context;
        this.instantiate = openmct.$injector.get('instantiate');
    };

    ImportAsJSONAction.prototype.perform = function() {
        var input;
        this.dialogService.getUserInput(IMPORT_FORM, {})
            .then(function (result) {
                input = document.getElementById('file-input');
                this.readFile(input.files[0])
                    .then(function (result) {
                        this.beginImport(result['openmct']);
                    }.bind(this))
            }.bind(this));

        this.resetButton(IMPORT_FORM);
        if (input) {
            input.remove();
        }
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
        var rootObj = parent.useCapability("instantiation", 
            tree[Object.keys(tree)[0]]);
        rootObj.getCapability("location").setPrimaryLocation(parent.getId());

        // Instantiate all objects in tree with their newly genereated ids,
        // adding each to its rightful parent's composition
        this.deepInstantiate(rootObj, tree);

        // Add root object to the composition of the parent
        parent.getCapability("composition").add(rootObj);
    };

    // Traverses object tree, instantiates all domain object w/ new IDs and 
    //adds to parent's composition
    ImportAsJSONAction.prototype.deepInstantiate = function (parent, tree) {

        if (parent.hasCapability("composition")) {
    		    var parentModel = parent.getModel();
    		    parentModel.composition.forEach(function (childId, index) {
    	          var newObj = this.instantiate(tree[childId], childId);
    			      parent.getCapability("composition").add(newObj);
    			      // if meant to be a link, dont set primary location (?)
                if (Object.keys(tree).includes(tree[childId].location)) {				
	                  newObj.getCapability("location").setPrimaryLocation(parent.getId());
		            } else {
                    newObj.getCapability("location").setPrimaryLocation(tree[childId].location);
                }
				        this.deepInstantiate(newObj, tree);  			
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

    ImportAsJSONAction.prototype.resetButton = function (dialogModel) {
        dialogModel['sections'][0]['rows'][0].text = "Select File";
    };    

    ImportAsJSONAction.appliesTo = function (context) {
        return context.domainObject !== undefined && 
            context.domainObject.hasCapability("composition");
    };

    return ImportAsJSONAction;
});
