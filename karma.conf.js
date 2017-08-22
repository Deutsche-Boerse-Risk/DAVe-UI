module.exports = function (config) {

    var layout = require('./selectedLayout');

    var appBase = 'app/';       // transpiled app JS and map files

    // Testing helpers (optional) are conventionally in a folder called `testing`
    var testingBase = 'testing/'; // transpiled test JS and map files

    require('@dbg-riskit/dave-ui-devkit/tools/karma.base.config')(config, [appBase, testingBase], 'DAVe-UI');

    config.files = config.files.concat([
        {
            pattern: 'node_modules/@dbg-riskit/dave-ui-common/ie.intl.shim.js',
            included: true,
            watched: !config.singleRun
        },
        {
            pattern: 'node_modules/@dbg-riskit/dave-ui-common/intl.perf.patch.js',
            included: true,
            watched: !config.singleRun
        },

        {pattern: 'systemjs.config.js', included: false, watched: !config.singleRun},
        {pattern: 'karma-test-shim.js', included: true, watched: !config.singleRun},

        {pattern: 'node_modules/@dbg-riskit/' + layout + '/styles.css', included: true, watched: !config.singleRun},

        // @dbg-riskit/dave-ui-*
        {pattern: 'node_modules/@dbg-riskit/dave-ui-*/**/*.js', included: false, watched: !config.singleRun},
        {pattern: 'node_modules/@dbg-riskit/dave-ui-*/**/*.css', included: false, watched: !config.singleRun},

        // Asset (HTML & CSS) paths loaded via Angular's component compiler
        // (these paths need to be rewritten, see proxies section)
        {pattern: 'index.html', included: false, watched: !config.singleRun},
        {
            pattern: 'node_modules/@dbg-riskit/' + layout + '/resources/fonts/**/*.eot',
            included: false,
            watched: false
        },
        {
            pattern: 'node_modules/@dbg-riskit/' + layout + '/resources/fonts/**/*.woff',
            included: false,
            watched: false
        },
        {
            pattern: 'node_modules/@dbg-riskit/' + layout + '/resources/fonts/**/*.ttf',
            included: false,
            watched: false
        },
        {
            pattern: 'node_modules/@dbg-riskit/' + layout + '/resources/fonts/**/*.svg',
            included: false,
            watched: false
        },
        {
            pattern: 'node_modules/@dbg-riskit/' + layout + '/resources/img/**/*.svg',
            included: false,
            watched: false
        }
    ]);

    // Proxied base paths for loading assets
    // remap resources
    config.proxies['/resources/'] = '/base/node_modules/@dbg-riskit/' + layout + '/resources/';
};