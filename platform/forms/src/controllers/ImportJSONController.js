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
    ['zepto'],
    function ($) {

        /**
         * Controller for the `importJSONbutton` control type. Provides
         * structure for a button (embedded via the template) which
         * opens a filepicker and validates that the chosen file is legal
         * JSON and was exported by Open MCT.
         * @memberof platform/forms
         * @constructor
         * @param $scope the control's Angular scope
         */
        function ImportJSONController($scope) {
            this.$scope = $scope;
            this.$scope.validInput = false;
            this.structure = $scope.structure;
        }

        // fired on 'Select File' button click
        ImportJSONController.prototype.selectFile = function () {
            var fileInput;
            var fileBody;

            // create input element if not already present
            if (!document.getElementById('file-input')) {
                fileInput = this.newInput();
            }

            // could user _.bindAll() here?
            var read = function (file) {
                return this.readFile(file);
            }.bind(this);

            var setText = function (text) {
                this.structure.text = text;
            }.bind(this);

            var validate = function (jsonString) {
                return this.validateJSON(jsonString);
            }.bind(this);

            var setValid = function (state) {
                this.$scope.validInput = state;
            }.bind(this);

            // make sure to check IDs, file size
            fileInput = $(document.getElementById('file-input'));
            fileInput.value = '';

            fileInput.change(function () {
                fileInput.off('change');
                if (this.files[0]) {
                    fileBody = read(this.files[0])
                        .then(function (result) {
                            if (validate(result) === 'Valid JSON') {
                                setValid(true);
                                setText(this.files[0].name);
                            } else {
                                //alert(validate(result));
                                this.remove();
                                setValid(false);
                                setText('Select File');
                            }
                        }.bind(this));
                } else {
                    setValid(false);
                    setText('Select File');
                }
            });

            fileInput.trigger('click');
        };

        ImportJSONController.prototype.readFile = function (file) {
            var fileReader = new FileReader();

            return new Promise(function (resolve, reject) {
                fileReader.onload = function (event) {
                    resolve(event.target.result);
                };

                fileReader.onerror = function () {
                    return reject(event.target.result);
                };
                fileReader.readAsText(file);
            });

        };

        ImportJSONController.prototype.validateJSON = function (jsonString) {
            var json;
            try {
                json = JSON.parse(jsonString);
            } catch (e) {
                return 'Malformed JSON file\n:c';
            }
            if (json.openmct && Object.keys(json).length === 1 &&
                this.validKeys(json.openmct)) {

                return 'Valid JSON';
            } else {
                return 'JSON configuration not recognized\n:c';
            }
        };

        ImportJSONController.prototype.validKeys = function (tree) {
            var valid = true;
            var regEx =
                /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;

            Object.keys(tree).forEach(function (key) {
                if (!(key.length === 36 && key.match(regEx) || key === 'mine')) {
                    valid = false;
                }
            });
            return valid;
        };

        ImportJSONController.prototype.newInput  = function () {
            var input = $(document.createElement('input'));
            input.attr("type", "file");
            input.attr("id", "file-input");
            input.css("display", "none");
            $('body').append(input);
            return input;
        };

        return ImportJSONController;
    }
);
