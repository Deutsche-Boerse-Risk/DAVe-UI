module.exports = function (grunt) {
    var exec = require('./exec');
    grunt.registerMultiTask('ngc', 'Run Angular 2 compiler', exec(grunt, 'npm', ['run', 'ngc']));
};