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

    function ExportAsJSONAction(exportService, policyService, context) {
        this.exportService = exportService;
        this.policyService = policyService;
        this.context = context;
        this.calls = 0;
    }

    ExportAsJSONAction.prototype.perform = function() {
        this.contructJSON(this.context.domainObject);
    }; 

    
    ExportAsJSONAction.prototype.contructJSON = function (rootObject) {
        var tree = {};
        tree[rootObject.getId()] = rootObject.getModel();

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
                        if (this.isCreatable(child)) {
                            tree[child.getId()] = child.getModel();
                            this.write(tree, child, callback);
                        }
                    }.bind(this));
                    this.calls--;
                    if (this.calls === 0) {
                        callback(this.wrap(tree));
                    }
                }.bind(this))
        } else {
            this.calls--;
            if (this.calls === 0) {
                callback(this.wrap(tree));
            }
        }
    };

    ExportAsJSONAction.prototype.isExternal = function (childId, parent, tree) {
        if (tree[childId].location !== parent.getId() &&
            !Object.keys(tree).includes(tree[childId].location)) {
            //console.log(tree[childId].name + ' is a link to a non-exisiting obj');
            return true;
        }
        return false;
    };

    ExportAsJSONAction.prototype.wrap = function (tree) {
		    return {'openmct': tree};
	  };

    ExportAsJSONAction.prototype.isCreatable = function (domainObject) {
        return this.policyService.allow(
            "creation", 
            domainObject.getCapability("type")
        );

    };

    return ExportAsJSONAction;
});
