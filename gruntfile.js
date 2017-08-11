module.exports = function (grunt) {
    'use strict';

    require('@dbg-riskit/dave-ui-common/tools/grunt/app.grunt.config')(grunt, 'dave.js', require('./selectedLayout'));

    grunt.config('coveralls', {
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
    grunt.registerTask('dist', ['cleanup:all', 'sass', 'cssmin', 'ngc', 'copy', 'rollup', 'cleanup:postDist']);
    grunt.registerTask('dist-run', ['dist', 'browserSync:dist']);


    // CircleCI test tasks
    grunt.registerTask('testCircleCI', ['testBrowserStack', 'coveralls']);
    grunt.registerTask('testCircleCIMinimal', ['testBrowserStackMinimal', 'coveralls']);
    grunt.registerTask('testCircleCIChrome', ['testChrome', 'coveralls']);
};