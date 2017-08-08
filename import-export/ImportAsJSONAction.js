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

    function ImportAsJSONAction(exportService, identifierService, 
        dialogService, openmct, context) {
        
        this.openmct = openmct;
        this.context = context;
        this.exportService = exportService;
        this.dialogService = dialogService;
        this.identifierService = identifierService;
        this.instantiate = openmct.$injector.get("instantiate");
    };

    ImportAsJSONAction.prototype.perform = function() {
        var input;
        this.dialogService.getUserInput(IMPORT_FORM, {})
            .then(function (result) {
                input = document.getElementById("file-input");
                this.readFile(input.files[0])
                    .then(function (result) {
                        this.beginImport(result['openmct']);
                        input.remove();
                    }.bind(this), function (err) {
                        this.displayError();
                    }.bind(this))
            }.bind(this));
        this.resetButton(IMPORT_FORM);
    };

    ImportAsJSONAction.prototype.beginImport = function (file) {
        var parent = this.context.domainObject;
        
        // Generate tree with newly created ids
        var tree = this.generateNewTree(file);
        
        // Instantiate root object w/ its new id
        var rootId = Object.keys(tree["root"])[0];
        var rootObj = this.instantiate(tree["root"][rootId], rootId);
        rootObj.getCapability("location").setPrimaryLocation(parent.getId());

        // Remove wrapper from root after getting a handle on the root object
        // and generating new ids
        tree = this.flattenTree(tree, rootId);

        // Instantiate all objects in tree with their newly genereated ids,
        // adding each to its rightful parent's composition
        this.deepInstantiate(rootObj, tree, []);
        
        // Add root object to the composition of the parent
        parent.getCapability("composition").add(rootObj);
    };

    // Traverses object tree, instantiates all domain object w/ new IDs and 
    //adds to parent's composition
    ImportAsJSONAction.prototype.deepInstantiate = function (parent, tree, seen) {
        if (parent.hasCapability("composition")) {
		    var parentModel = parent.getModel();
		    var newObj;
            seen.push(parent.getId());
            parentModel.composition.forEach(function (childId, index) {
                if (!tree[childId] || seen.includes(childId)) { return; }
            
                newObj = this.instantiate(tree[childId], childId);
                parent.getCapability("composition").add(newObj);
             
                newObj.getCapability("location")
                    .setPrimaryLocation(tree[childId].location);
                this.deepInstantiate(newObj, tree, seen);                 			
		    }, this)
    	}
    };

	// For each domain object in the file, generate new ID, replace in JSON
    ImportAsJSONAction.prototype.generateNewTree = function(tree) {
    	Object.keys(tree).forEach(function (domainObjectId) {
            if (domainObjectId === "root") {
                domainObjectId = Object.keys(tree["root"])[0];
            }
            var newId = this.identifierService.generate();
            tree = this.rewriteId(domainObjectId, newId, tree);    
        }, this);
        return tree;
    };

    ImportAsJSONAction.prototype.flattenTree = function(tree, rootId) {
        var rootModel = tree['root'][rootId];
        tree[rootId] = rootModel;
        delete tree['root'];
        return tree;
    }

    ImportAsJSONAction.prototype.rewriteId = function (oldID, newID, tree) {
        tree = JSON.stringify(tree).replace(new RegExp(oldID, 'g'), newID);
        return JSON.parse(tree);
    };

    ImportAsJSONAction.prototype.resetButton = function (dialogModel) {
        dialogModel['sections'][0]['rows'][0].text = "Select File";
    };   

    ImportAsJSONAction.prototype.readFile = function (file) {
        var contents = '';
        var fileReader = new FileReader();
        var validateJSON = this.validateJSON;

        return new Promise(function (resolve, reject) {
            fileReader.onload = function (event) {
                if(validateJSON(event.target.result)) {
                    contents = JSON.parse(event.target.result);
                    resolve(contents);
                } else {
                    return reject(contents);
                }
            };

            fileReader.onerror = function () {
                return reject(contents);
            };
            fileReader.readAsText(file);
        })
    };

    ImportAsJSONAction.prototype.validateJSON = function (jsonString) {
        var json;
        try {
            json = JSON.parse(jsonString);
        } catch (e) {
            return false;
        }
        if (json.openmct && Object.keys(json).length === 1) {
            return true;
        } else {
            return false;
        }
    };

    ImportAsJSONAction.prototype.displayError = function () {
        var dialog,
        model = {
            title: "Invalid File Choice",
            actionText: "File was either malformed or not exported by " +
                "Open MCT. Please try another JSON file.",
            severity: "error",
            options: [
                {
                    label: "Ok",
                    callback: function () {
                        dialog.dismiss();
                    }
                }
            ]
        };
        dialog = this.dialogService.showBlockingMessage(model);
        $(document.getElementById('file-input').remove());
    };

    ImportAsJSONAction.appliesTo = function (context) {
        return context.domainObject !== undefined && 
            context.domainObject.hasCapability("composition");
    };

    return ImportAsJSONAction;
});
