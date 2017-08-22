module.exports = function (config) {

    var appBase = 'app/';       // transpiled app JS and map files

    // Testing helpers (optional) are conventionally in a folder called `testing`
    var testingBase = 'testing/'; // transpiled test JS and map files

    require('@dbg-riskit/dave-ui-devkit/tools/karma.app.config')(
        config,
        [appBase, testingBase],
        'DAVe-UI',
        require('./selectedLayout'));
};