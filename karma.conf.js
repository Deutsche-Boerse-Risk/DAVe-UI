module.exports = function (config) {

    var appBase = 'app/';       // transpiled app JS and map files

    // Testing helpers (optional) are conventionally in a folder called `testing`
    var testingBase = 'testing/'; // transpiled test JS and map files

    require('@dbg-riskit/DAVe-UI-common/tools/karma.base.config')(config, [appBase, testingBase], 'DAVe-UI');

    config.files = config.files.concat([
        'node_modules/@dbg-riskit/DAVe-UI-common/ie.intl.shim.js',

        {pattern: 'systemjs.config.js', included: false, watched: false},
        'karma-test-shim.js', // optionally extend SystemJS mapping e.g., with barrels

        'node_modules/@dbg-riskit/DAVe-UI-dummy-layout/styles.css',

        // @dbg-riskit/DAVe-UI-*
        {pattern: 'node_modules/@dbg-riskit/DAVe-UI-*/**/*.js', included: false, watched: false},
        {pattern: 'node_modules/@dbg-riskit/DAVe-UI-*/**/*.css', included: false, watched: false},

        // Asset (HTML & CSS) paths loaded via Angular's component compiler
        // (these paths need to be rewritten, see proxies section)
        {pattern: 'index.html', included: false, watched: true},
        // {
        //     pattern: 'node_modules/@dbg-riskit/DAVe-UI-common/resources/fonts/**/*.eot',
        //     included: false,
        //     watched: false
        // },
        // {
        //     pattern: 'node_modules/@dbg-riskit/DAVe-UI-common/resources/fonts/**/*.woff',
        //     included: false,
        //     watched: false
        // },
        // {
        //     pattern: 'node_modules/@dbg-riskit/DAVe-UI-common/resources/fonts/**/*.ttf',
        //     included: false,
        //     watched: false
        // },
        // {
        //     pattern: 'node_modules/@dbg-riskit/DAVe-UI-common/resources/fonts/**/*.svg',
        //     included: false,
        //     watched: false
        // },
        {
            pattern: 'node_modules/@dbg-riskit/DAVe-UI-dummy-layout/resources/img/**/*.svg',
            included: false,
            watched: false
        }
    ]);

    // Proxied base paths for loading assets

    // remap resources
    // config.proxies['/resources/fonts/'] = '/base/node_modules/@dbg-riskit/DAVe-UI-common/resources/fonts/';
    config.proxies['/resources/img/'] = '/base/node_modules/@dbg-riskit/DAVe-UI-dummy-layout/resources/img/';
};