describe('Francis', function() {
    beforeEach(function() {});

    afterEach(function() {});

    it('should do stuff', function() {
        Francis.registerExperiments({
            'my_great_experiment': [{
                name: 'variation1',
                weight: 50
            }, {
                name: 'variation2',
                weight: 50
            }]
        });

        var variation = Francis.getVariation('my_great_experiment', 'adam@betterment.com');
        console.log(variation);
    });
});