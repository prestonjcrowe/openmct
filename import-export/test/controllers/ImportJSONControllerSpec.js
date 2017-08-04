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
    ["../../src/controllers/ImportJSONController"],
    function (ImportJSONController) {

        describe("The import JSON button controller", function () {
            var mockScope,
                controller;

            beforeEach(function () {
                mockScope = jasmine.createSpyObj("$scope", ["$watch"]);
                controller = new ImportJSONController(mockScope);
            });

            it("validates JSON input", function () {
                // how to test this without testing internal methods?
                var malformed = "This isn't JSON at all...";
                var noWrapper = JSON.stringify({
                    "12345678-1234-1234-1234-123456789123": {
                        "name": "test",
                        "type": "folder",
                        "modified": 1501518245817,
                        "location": "mine",
                        "persisted": 1501518245817
                    }
                });

                var invalidId = JSON.stringify({
                    "openmct": {
                        "12345678-1234-1234-1234-123456789123XXX": {
                            "name": "test",
                            "type": "folder",
                            "modified": 1501518245817,
                            "location": "mine",
                            "persisted": 1501518245817
                        }
                    }
                });

                var validInput = JSON.stringify({
                    "openmct": {
                        "12345678-1234-1234-1234-123456789123": {
                            "name": "test",
                            "type": "folder",
                            "modified": 1501518245817,
                            "location": "mine",
                            "persisted": 1501518245817
                        }
                    }
                });


                expect(controller.validateJSON(malformed)).toBe(false);
                expect(controller.validateJSON(noWrapper)).toBe(false);
                expect(controller.validateJSON(invalidId)).toBe(false);
                expect(controller.validateJSON(validInput)).toBe(true);
            });

        });
    }
);

