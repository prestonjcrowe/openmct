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
         * JSON exported by Open MCT.
         * @memberof platform/forms
         * @constructor
         * @param $scope the control's Angular scope
         */
        function ImportJSONController($scope, fileInputService) {
            this.$scope = $scope;
            this.$scope.validInput = false;
            this.structure = $scope.structure;
            this.fileInputService = fileInputService;
        }
        // fired on 'Select File' button click
        ImportJSONController.prototype.chooseFile = function () {
            var setText = function (text) {
                this.structure.text = text.length > 20 ?
                    text.substr(0, 20) + "..." :
                    text;
            }.bind(this);

            var setValid = function (state) {
                this.$scope.validInput = state;
            }.bind(this);

            this.fileInputService.getInput().then(function (result) {
                setText(result.name);
                setValid(true);
            }, function () {
                setText('Select File');
                setValid(false);
            });
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
