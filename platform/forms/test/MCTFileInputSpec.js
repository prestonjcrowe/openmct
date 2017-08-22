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
    ["../src/MCTFileInput"],
    function (MCTFileInput) {

        describe("The mct-file-input directive", function () {

            var mockScope,
                mockFileInputService,
                mctFileInput,
                element;

            beforeEach(function () {
                mockFileInputService = jasmine.createSpyObj('fileInputService',
                    ['getInput']
                );
                mockScope = jasmine.createSpyObj(
                        '$scope',
                        ['$watch']
                );

                mctFileInput = new MCTFileInput(mockFileInputService);
                var attrs = [];
                var control = jasmine.createSpyObj('control', ['$setValidity']);
                element = jasmine.createSpyObj('element', ['on', 'trigger']);
                mctFileInput.link(mockScope, element, attrs, control);
            });

            it("is restricted to attributes", function () {
                expect(mctFileInput.restrict).toEqual("A");
            });

            it("changes button text to match file name", function () {
                expect(element.on).toHaveBeenCalledWith(
                    'click',
                    jasmine.any(Function)
                );
                mockFileInputService.getInput.andReturn({name: "file-name", body: "file-body"});

                // trigger getInput.andReturn({name: something, body: somethingElse})
                // check that button text = something
            });

            it("watches for file input and validates form", function () {
                expect(mockScope.$watch).toHaveBeenCalledWith(
                    "validInput",
                    jasmine.any(Function)
                );
                // expect form to be dirty
                // control.$setValidity(true) or whatevs
                // expect form to be valid
            });
        });
    }
);
