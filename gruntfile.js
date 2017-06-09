module.exports = function (grunt) {
    'use strict';

    require('@dbg-riskit/DAVe-common/tools/grunt/app.grunt.config')(grunt, 'dave.js');

    // Build tasks
    grunt.registerTask('clean', ['cleanup:all']);
    grunt.registerTask('compile', ['sass', 'ts:compile']);
    grunt.registerTask('build', ['cleanup:all', 'sass', 'ts:compile']);
    grunt.registerTask('run', ['build', 'concurrent']);

    // Dist tasks
    grunt.registerTask('dist', ['cleanup:all', 'sass', 'cssmin', 'ngc', 'copy', 'rollup', 'cleanup:postDist']);
    grunt.registerTask('dist-run', ['dist', 'browserSync:dist']);
};