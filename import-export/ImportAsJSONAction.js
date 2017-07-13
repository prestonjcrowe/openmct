// need to validate new location with policy service

define([], function () {
    'use strict';

    var sampleModel = {
        "composition":["6fd118c8-d683-48da-b389-f63544b88608","6295c7a0-148d-40ed-8625-94b4373cdec2"],
        "name":"foldy",
        "type":"folder",
        "modified":1499963825849,
        "location":"mine",
        "persisted":1499963825849
    };

    var exampleJSON = {  
       "root":{  
          "composition":[  
             "efafe9c0-f8a3-4efc-8e46-922efe8df678"
          ],
          "name":"foldy",
          "type":"folder",
          "modified":1499988633529,
          "location":"mine",
          "persisted":1499988633529
       },
       "efafe9c0-f8a3-4efc-8e46-922efe8df678":{  
          "composition":[  
             "efdf3323-c4d8-4d72-82bf-f6f0aa286dc2"
          ],
          "name":"nested foldy",
          "type":"folder",
          "modified":1499988658146,
          "location":"affbdb4d-82cf-4faf-98c5-574f05af102a",
          "persisted":1499988658146
       },
       "efdf3323-c4d8-4d72-82bf-f6f0aa286dc2":{  
          "telemetry":{  
             "values":[  
                {  
                   "name":"Time",
                   "key":"utc",
                   "format":"utc",
                   "hints":{  
                      "domain":1,
                      "priority":0
                   },
                   "source":"utc"
                },
                {  
                   "name":"Image",
                   "key":"url",
                   "format":"image",
                   "hints":{  
                      "image":1,
                      "priority":1
                   },
                   "source":"url"
                }
             ]
          },
          "name":"slayer",
          "type":"example.imagery",
          "modified":1499988658143,
          "location":"efafe9c0-f8a3-4efc-8e46-922efe8df678",
          "persisted":1499988658143
       }
    };

    function ImportAsJSONAction(exportService, openmct, context) {
        this.exportService = exportService;
        this.context = context;
        this.openmct = openmct;
        // parent should be defined here... lazy will do later
    }

    ImportAsJSONAction.prototype.perform = function() {
        var parent = this.context.domainObject;
        var objectToImport = sampleModel;
        var clone;
      
        clone = parent.useCapability("instantiation", objectToImport);
        parent.getCapability("composition")
            .add(clone)
            .then(function (importedObject) {
                clone.getCapability("persistence").persist();
                parent.getCapability("persistence").persist();
            }.bind(this));

        this.buildTree(exampleJSON);
    }; 

    ImportAsJSONAction.appliesTo = function (context) {
        return context.domainObject !== undefined;
    };

    ImportAsJSONAction.prototype.buildTree = function (struct) {
        var parent = this.context.domainObject;
        var objectToImport = parent.useCapability("instantiation", struct['root']);
        // creates NEW domain object for the root object, type: example.getId()
        parent.getCapability("composition")
            .add(objectToImport) // this should happen last? not sure... lets      
            .then(function (importedObject) {
                //clone.getCapability("persistence").persist();
                //parent.getCapability("persistence").persist();
                
                //this.appendChildren(importedObject, struct)
                this.traverse(importedObject, struct);
            }.bind(this));

        // this.appendChildren(objectToImport, struct);
        // last step here, persist 1st object

        parent.getCapability("persistence").persist();
        objectToImport.getCapability("persistence").persist();
    };

    ImportAsJSONAction.prototype.traverse = function (parent, struct) {
        if (parent.hasCapability("composition")) {
            parent.useCapability('composition').then(function (children) {
                children.forEach(function (child, index) {
                    console.log('reached: ' + JSON.stringify(child.getModel()));
                });
            });
        }
    };

    ImportAsJSONAction.prototype.appendChildren = function (parent, struct) {
        var newChild;
        console.log(JSON.stringify(parent.getModel()));
        if (parent.hasCapability("composition")) {
            parent.useCapability('composition').then(function (children) {
                children.forEach(function (child, index) {
                    console.log('?: ' + child.getId());
                    // here i need to get the NEW id and change parent.composition[index]
                    // to the NEW id
                    newChild = parent.useCapability("instantiation", struct[child.getId()]);
                    children[index] = newChild.getId();
                    
                    parent.getCapability("composition")
                        .add(newChild)
                        .then(function (importedObject) {
                            newChild.getCapability("persistence").persist();
                        })
                    //newChild.getCapability("persistence").persist();
                    
                });
            });
        }
        // if (parent.hasCapability("composition")) {
        //     parent.useCapability('composition').then(function (children) {
        //         children.forEach(function (child) {
        //             console.log('child!: ' + JSON.stringify(child.getModel()));
        //         });
        //     });
        // }
    };

    return ImportAsJSONAction;
});