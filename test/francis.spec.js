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

        it ('should not throw any errors with valid experiment', function() {
            var experiments = {
                'experiment_a': generateExperiment(20, 20, 20, 20, 20),
                'experiment_b': generateExperiment(25, 75),
                'experiment_c': generateExperiment(50, 50),
                'experiment_d': generateExperiment(10, 20, 30, 40)
            };

            expect(registerExperiments(experiments)).to.not.throw();
        });
    });

    describe('#registerLogger', function() {

        function registerLogger(logger) {
            return Francis.registerLogger.bind(Francis, logger);
        }

        it ('should throw an error if not passed a function', function() {

            var logger = "certainly not a function";
            expect(registerLogger(logger)).to.throw('logger must be a function');
        });

        it ('should not throw any errors if passed a function', function() {

            var logger = function() {};
            expect(registerLogger(logger)).to.not.throw();
        });
    });

    describe('#runExperiment', function() {
        function runExperiment(experimentName, testSubjectId, handler) {
            return Francis.runExperiment.bind(Francis, experimentName, testSubjectId, handler);
        }

        beforeEach(function() {
            this.sinon = sinon.sandbox.create();

            Francis.registerExperiments({
                'experiment': generateExperiment(50, 50)
            });
        });

        afterEach(function() {
            this.sinon.restore();
        });

        it('should throw an error when given an experiment that does not exist', function() {
            expect(runExperiment('fake_experiment', Francis.util.guid(), function() {})).to.throw('Unkown experiment: "fake_experiment"');
        });

        it('should throw an error when not given a handler function', function() {
            expect(runExperiment('experiment', Francis.util.guid(), "not a function")).to.throw('Must provide a handler function');
        });


        it('should not call the logger if the handler function throws an error', function() {
            var logger = this.sinon.spy(),
                handler = function() {
                    throw new Error('I did something bad.');
                };

            Francis.registerLogger(logger);

            expect(runExperiment('experiment', Francis.util.guid(), handler)).to.throw('I did something bad.');
            expect(logger).to.not.have.been.called;
        });
    });

    describe('util', function() {
        describe('#guid()', function() {
            expect(Francis.util.guid()).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-(8|9|a|b)[0-9a-f]{3}-[0-9a-f]{12}$/);
        });
    });
});