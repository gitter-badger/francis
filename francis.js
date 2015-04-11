// @echo banner
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

    var experiments;

    return {
        registerExperiments: function(value) {
            experiments = value;
        },

        getVariation: function(experimentName, uniqueId) {
            var experiment = experiments[experimentName],
                hash = md5(experimentName.toString() + uniqueId.toString()),
                ticketNumber = 100 * parseInt(hash.substr(0, 2), 16),
                weightCounter = 0,
                selectedVariation;

            selectedVariation = _.filter(experiment, function(variation) {
                var oldWeightCounter = weightCounter;
                weightCounter += variation.weight * 256;

                return ticketNumber >= oldWeightCounter && ticketNumber < weightCounter; 
            });

            return selectedVariation[0].name;
        }
    };
});
