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

define(["zepto"], function ($) {

    function FileInputService() {

    }

    FileInputService.prototype.getInput = function () {
        var input = this.newInput();
        var read = this.readFile;
        var fileInfo = {};
        var file;

        return new Promise(function (resolve, reject) {
            input.trigger("click");
            input.change(function (event) {
                file = this.files[0];
                if (file) {
                    read(file)
                        .then(function (contents) {
                            fileInfo.name = file.name;
                            fileInfo.body = contents;
                            input.remove();
                            resolve(fileInfo);
                        });
                } else {
                    input.remove();
                    reject("No file chosen");
                }
            });
        });
    };

    FileInputService.prototype.readFile = function (file) {
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

    FileInputService.prototype.newInput  = function () {
        var input = $(document.createElement('input'));
        input.attr("type", "file");
        input.attr("id", "file-input");
        input.css("display", "none");
        $('body').append(input);
        return input;
    };

    return FileInputService;
});
