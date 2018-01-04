module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            {"pattern": "src/**/*.ts"},
            {"pattern": "typings/**/*.ts"}
        ],
        preprocessors: {
            "**/*.ts": "karma-typescript"
        },
        reporters: ["spec", "coverage", "coveralls"],
        browsers: ["PhantomJS"],
        coverageReporter: {
            type: 'lcov', 
            dir: 'coverage/'
        },
        singleRun: true,
        autoWatch: false
    });
};