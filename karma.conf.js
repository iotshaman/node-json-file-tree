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
        reporters: ["spec", "coverage"],
        browsers: ["PhantomJS"],
        singleRun: false,
        autoWatch: true
    });
};