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

    grunt.registerTask('printConfig', function () {
        grunt.log.writeln(JSON.stringify(grunt.config(), null, 2));
    });


    grunt.loadNpmTasks('grunt-coveralls');

    // Build tasks
    grunt.registerTask('clean', ['cleanup:all']);
    grunt.registerTask('compile', ['sass', 'ts:compile']);
    grunt.registerTask('build', ['cleanup:all', 'sass', 'ts:compile']);
    grunt.registerTask('run', ['build', 'concurrent']);

    // Dist tasks
    grunt.registerTask('dist', ['cleanup:all', 'sass', 'cssmin', 'ngc', 'copy', 'build-optimizer', 'rollup',
        'cleanup:postDist', 'cleanup:sass_post']);
    grunt.registerTask('dist-run', ['dist', 'browserSync:dist']);


    // CircleCI test tasks
    grunt.registerTask('testCircleCI', ['testBrowserStack', 'coveralls']);
    grunt.registerTask('testCircleCIMinimal', ['testBrowserStackMinimal', 'coveralls']);
    grunt.registerTask('testCircleCIChrome', ['testChrome', 'coveralls']);
};