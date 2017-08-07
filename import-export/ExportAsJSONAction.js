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
 
define([], function () {
    'use strict';

    function ExportAsJSONAction(exportService, policyService, 
        identifierService, context) {
         
        this.root;
        this.calls = 0; 
        this.context = context;
        this.externalIdentifiers = [];
        this.exportService = exportService;
        this.policyService = policyService;
        this.identifierService = identifierService;
    }

    ExportAsJSONAction.prototype.perform = function() {
        this.contructJSON(this.context.domainObject);
    }; 

    
    ExportAsJSONAction.prototype.contructJSON = function (rootObject) {
        var tree = {};
        tree[rootObject.getId()] = rootObject.getModel();
        this.root = rootObject;
        // Root be included in tree during building to check link status,
        // removed after tree is built and re-added with "root" wrapper

        this.write(tree, rootObject, function (result) {
            this.exportService.exportJSON(result, 
                {filename:  rootObject.getModel().name + '.json'});
        }.bind(this));
    };

    ExportAsJSONAction.prototype.write = function (tree, domainObject, callback) {

        this.calls++;
        if (domainObject.hasCapability('composition')) {
            domainObject.useCapability('composition')
                .then(function (children) {
                    children.forEach(function (child, index) { 
                        // Only export if object is creatable
                        if (this.isCreatable(child)) {
                            // If object is a link to something absent from 
                            // tree, generate new id and treat as new object      
                            // Can be cleaned up / rewritten as separate func
                            if (this.isExternal(child, domainObject, tree)) {
                                this.rewriteLinked(child, domainObject, tree);
                            } else {
                                tree[child.getId()] = child.getModel();
                            }
                            this.write(tree, child, callback);
                        }
                    }.bind(this));
                    this.calls--;
                    if (this.calls === 0) {
                        callback(this.wrap(tree, this.root));
                    }
                }.bind(this))
        } else {
            this.calls--;
            if (this.calls === 0) {
                callback(this.wrap(tree, this.root));
            }
        }
    };

    ExportAsJSONAction.prototype.rewriteLinked = function (child, parent, tree) {
        this.externalIdentifiers.push(child.getId());
        var parentModel = parent.getModel();
        var childModel = child.getModel();
        var index = parentModel.composition.indexOf(child.getId());
        var newModel = this.copyModel(childModel);
        var newId = this.identifierService.generate();

        newModel.location = parent.getId();
        tree[newId] = newModel;
        tree[parent.getId()] = this.copyModel(parentModel);
        tree[parent.getId()].composition[index] = newId;
    };

    ExportAsJSONAction.prototype.copyModel = function (model) {
        var jsonString = JSON.stringify(model);
        return JSON.parse(jsonString);
    };

    ExportAsJSONAction.prototype.isExternal = function (child, parent, tree) {
        if (child.getModel().location !== parent.getId() &&
            !Object.keys(tree).includes(child.getModel().location) ||
            this.externalIdentifiers.includes(child.getId())) {
            return true;
        }
        return false;
    };

    ExportAsJSONAction.prototype.wrap = function (tree, root) {
        // Wrap root object for identification on import
        // Important to use current "tree" state of root
        // obj because composition has changed
        var rootObject = {};
        rootObject[root.getId()] = tree[root.getId()];
        tree["root"] = rootObject;
        console.log("final: " + JSON.stringify(tree));
        delete tree[root.getId()];
        return {
            "openmct": tree
        };
	};

    ExportAsJSONAction.prototype.isCreatable = function (domainObject) {
        return this.policyService.allow(
            "creation", 
            domainObject.getCapability("type")
        );
    };

    return ExportAsJSONAction;
});
