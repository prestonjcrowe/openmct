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
define(
    [],
    function () {

        /**
         * Controller for the `dialog-button` control type. Provides
         * structure for a button (embedded via the template) which
         * will show a dialog for editing a single property when clicked.
         * @memberof platform/forms
         * @constructor
         * @param $scope the control's Angular scope
         * @param {DialogService} dialogService service to use to prompt
         *        for user input
         */
        function ImportJSONController($scope, dialogService) {
            this.$scope = $scope;
            this.structure = $scope.structure;
            // pass by ref here?
            console.log('json controller init');
        }

        ImportJSONController.prototype.selectFile= function() {
            var fileInput;
            var fileBody;

            if (!document.getElementById('file-input')) {
                fileInput = $(document.createElement('input'));
                fileInput.attr("type", "file");
                fileInput.attr("id", "file-input");
                $("html").append(fileInput);
            } 

            var read = function (file) {
                return this.readFile(file);
            }.bind(this);

            // could prove unnecsary if i can put input in html template
            // make sure to check IDs, file size probs
            fileInput = $(document.getElementById('file-input'));
            var setText = function(text) {
                this.structure.text = text;
            }.bind(this);
            fileInput.change(function() {
                console.log("onchange");  
                fileBody = read(this.files[0])                  
                    .then(function (result) {
                        try {
                            JSON.parse(result);
                        } catch (e) {
                            this.value = '';
                            this.remove();
                            alert("Not a valid JSON file\n" + this.files.length);
                            return false;
                        }
                        // validateMCTJSON here (check ids etc)
                        setText(this.files[0]['name']); 
                        return true;
                        
                    }.bind(this));

            });
            fileInput.trigger('click');
            fileInput.off('click');
        };

        ImportJSONController.prototype.readFile = function (file) {
            var contents = '';
            var fileReader = new FileReader();

            return new Promise(function (resolve, reject) {
                fileReader.onload = function (event) {
                    resolve(event.target.result);
                };

                fileReader.onerror = function () {
                    return reject(contents);
                };
                fileReader.readAsText(file);
            })

        };

        ImportJSONController.prototype.isJSON  = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        //ImportJSONController.prototype.validateJSON = function(jsonString) {
  
        //};

        return ImportJSONController;
    }
);
