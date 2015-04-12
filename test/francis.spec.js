describe('Francis', function() {
    beforeEach(function() {});

    afterEach(function() {});

    function generateExperiment() {
        return _.map(arguments, function(weight, i) {
            return { name: 'variation' + (i+1), weight: weight };
        });
    }

    describe('#registerExperiments()', function() {

        function registerExperiments(experiments) {
            return Francis.registerExperiments.bind(Francis, experiments);
        }

        it('should throw an error if variation weights of an experiment do not sum to 100', function() {

            var experiments = {
                'good_experiment': generateExperiment(50, 50),
                'another_good_experiment': generateExperiment(25, 75),
                'bad_experiment': generateExperiment(50, 51)
            };

            expect(registerExperiments(experiments)).to.throw('variation weights for experiment "bad_experiment" must sum to 100');
        });

        it('should throw an error if any variation weight is not an integer', function() {
            var experiments = {
                'decimal_experiment': generateExperiment(12.5, 12.5, 75)
            };

            expect(registerExperiments(experiments)).to.throw('variation weights for experiment "decimal_experiment" must all be integers');
        });
    });
});