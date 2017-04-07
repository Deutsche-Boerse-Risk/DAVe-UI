module.exports = function (grunt) {
    var exec = require('./exec');
    grunt.registerMultiTask('ts', 'Run TypeScript compiler', exec(grunt, 'tsc', ['-p', './tsconfig.json']));
};