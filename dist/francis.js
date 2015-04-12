// francis.js v0.0.0
;(function (root, factory) {
    // https://github.com/umdjs/umd/blob/master/returnExports.js
    if (typeof exports === 'object') {
        // Node
        module.exports = factory(require('underscore'), require('blueimp-md5').md5);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'blueimp-md5'], factory);
    } else {
        // Browser globals (root is window)
        root.Francis = factory(root._, root.md5);
    }
})(this, function (_, md5) {
    'use strict';

    var experiments,
        logger;

    return {
        registerExperiments: function(value) {
            experiments = value;
        },

        registerLogger: function(value) {
            logger = value;
        },

        runExperiment: function(experimentName, testSubjectId, handler) {
            var experiment = experiments[experimentName],
                hash = md5(experimentName.toString() + testSubjectId.toString()),
                ticketNumber = 100 * parseInt(hash.substr(0, 2), 16),
                weightCounter = 0,
                selectedVariation;

            if (!experiment) {
                throw new Error('Unkown experiment: "' + experimentName + '"');
            }

            selectedVariation = _.filter(experiment, function(variation) {
                var oldWeightCounter = weightCounter;
                weightCounter += variation.weight * 256;

                return ticketNumber >= oldWeightCounter && ticketNumber < weightCounter; 
            })[0].name;

            handler(selectedVariation);
            logger && logger(experimentName, testSubjectId, selectedVariation);
        },

        util: {
            guid: function() {
                // http://stackoverflow.com/a/2117523/597530
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            }
        }
    };
});
