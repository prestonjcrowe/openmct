define([], function () {
    'use strict';

    function ExportAsJSONAction(exportService, openmct, context) {
        this.exportService = exportService;
        this.context = context;
        this.openmct = openmct;
    }

    ExportAsJSONAction.prototype.perform = function() {
        var context = this.context;
        var domainObject = this.context.domainObject;
        // this.exportService.exportJSON(domainObject.getModel(), 
        //     {filename:  Date.now() + '.json'});

        this.contructJSON(domainObject);
    }; 

    ExportAsJSONAction.prototype.appliesTo = function (context) {
        return context.domainObject !== undefined;
    };

    ExportAsJSONAction.prototype.contructJSON = function (rootObject) {
        var objJSON = {};
        objJSON["root"] = rootObject.getModel();
        //var tree = this.writeChildren(objJSON, rootObject);
        this.writeChildren(objJSON, rootObject, true)
            .then(function (result) {
                this.exportService.exportJSON(objJSON, 
                {filename:  Date.now() + '.json'});
            }.bind(this))
        
      
            //.then(function () {
            //    console.log(JSON.stringify(tree));
            //});
        
            /*.then(function (result) {
                // return objJSON here, OR exportJSON(objJSON) here
                this.exportService.exportJSON(objJSON, 
                    {filename:  Date.now() + '.json'});
                console.log(JSON.stringify(objJSON));
            }.bind(this)); */
        
    };

    // THIS SHOULD RETURN STRUCT
    ExportAsJSONAction.prototype.writeChildren = function (struct, domainObject, firstElem) {
        if (firstElem === undefined) {
            struct[domainObject.getId()] = domainObject.getModel();
        //     // dont add root, root already added
        }
        console.log('inside ' + JSON.stringify(struct));
        if (domainObject.hasCapability('composition')) {
            domainObject.useCapability('composition')
                .then(function (children) {
                    children.forEach(function (child) { 
                        struct[child.getId()] = child.getModel();
                        return this.writeChildren(struct, child);                        
                    }.bind(this));
            }.bind(this));
        }
        return Promise.resolve("leaf");
    };
    
    // ExportAsJSONAction.prototype.writeChildren = function (struct, domainObject) {
    //     if (domainObject.hasCapability('composition')) {
    //         return domainObject.useCapability('composition').then(function (children) {
    //             children.forEach(function (child) {
    //                 struct[child.getId()] = child.getModel();
    //                 console.log('child |' + child.getId() + '| ' + JSON.stringify(child.getModel()));
    //                 this.writeChildren(struct, child);
    //             }.bind(this))
    //         }.bind(this));
    //     } else {
    //             struct[domainObject.getId()] = domainObject.getModel();
    //         //return Promise.resolve();
    //     }
    // };

    return ExportAsJSONAction;
});