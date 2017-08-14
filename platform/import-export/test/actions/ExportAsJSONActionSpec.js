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
    [
        "../../src/actions/ExportAsJSONAction",
        "../DomainObjectFactory"
    ],
    function (ExportAsJSONAction, domainObjectFactory) {

        describe("The export JSON action", function () {

            var context,
                action,
                exportService,
                identifierService,
                policyService,
                mockType;

            beforeEach(function () {
                exportService = jasmine.createSpyObj('exportService',
                ['exportJSON']);
                identifierService = jasmine.createSpyObj('identifierService',
                            ['generate']);
                policyService = jasmine.createSpyObj('policyService',
                    ['allow']);
                mockType =
                    jasmine.createSpyObj('type', ['hasFeature']);
                context = {};
                context.domainObject = domainObjectFactory(
                    {
                        name: 'test',
                        id: 'someID',
                        capabilities: {type: mockType}
                    });

                action = new ExportAsJSONAction(exportService, policyService,
                        identifierService, context);
            });

            it("initializes happily", function () {
                expect(action).toBeDefined();
            });

            it("only applies to creatable objects", function () {
                //expect(action.appliesTo(context)).toBe(true);
                //mockType.hasFeature.andReturn(false);
                //expect(action.appliesTo(context)).toBe(false);
            });

            it("doesn't export non-editable objects in tree", function () {

            });

            it("can export self-containing objects", function () {

            });

            it("exports links to external objects as new objects", function () {

            });


        });
    }
);
