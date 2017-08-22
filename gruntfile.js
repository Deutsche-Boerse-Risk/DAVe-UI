module.exports = function (grunt) {
    'use strict';

    var mergeConfig = require('@dbg-riskit/dave-ui-devkit/tools/grunt/merge.config');

    require('@dbg-riskit/dave-ui-devkit/tools/grunt/app.grunt.config')(grunt, 'dave.js', require('./selectedLayout'));

    mergeConfig(grunt, 'coveralls', {
        options: {
            force: true
        },
        report: {
            src: 'coverage/lcov.info'
        }
    });
    grunt.loadNpmTasks('grunt-coveralls');

    grunt.registerTask('printConfig', function () {
        grunt.log.writeln(JSON.stringify(grunt.config(), null, 2));
    });

    // CircleCI test tasks
    grunt.registerTask('testCircleCI', ['testBrowserStack', 'coveralls']);
    grunt.registerTask('testCircleCIMinimal', ['testBrowserStackMinimal', 'coveralls']);
    grunt.registerTask('testCircleCIChrome', ['testChrome', 'coveralls']);
};