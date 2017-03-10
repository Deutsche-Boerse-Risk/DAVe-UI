module.exports = function (config) {

    var debugTests = false;

    var appBase = 'app/';       // transpiled app JS and map files

    // Testing helpers (optional) are conventionally in a folder called `testing`
    var testingBase = 'testing/'; // transpiled test JS and map files

    config.set({
        basePath: '',
        frameworks: ['jasmine'],

        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-ie-launcher'),
            require('karma-firefox-launcher'),
            require('karma-browserstack-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-junit-reporter'),
            require('karma-coverage')
        ],

        client: {
            builtPaths: [appBase, testingBase], // add more spec base paths as needed
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },

        customLaunchers: {
            bs_chrome_windows_10: {
                base: 'BrowserStack',
                browser: 'Chrome',
                browser_version: '56.0',
                os: 'Windows',
                os_version: '10'
            },
            bs_firefox_windows_10: {
                base: 'BrowserStack',
                browser: 'Firefox',
                browser_version: '51.0',
                os: 'Windows',
                os_version: '10'
            },
            bs_ie_windows_10: {
                base: 'BrowserStack',
                browser: 'IE',
                browser_version: '11.0',
                os: 'Windows',
                os_version: '10'
            },
            bs_chrome_windows_7: {
                base: 'BrowserStack',
                browser: 'Chrome',
                browser_version: '56.0',
                os: 'Windows',
                os_version: '7'
            },
            bs_firefox_windows_7: {
                base: 'BrowserStack',
                browser: 'Firefox',
                browser_version: '51.0',
                os: 'Windows',
                os_version: '7'
            },
            bs_ie_windows_7: {
                base: 'BrowserStack',
                browser: 'IE',
                browser_version: '11.0',
                os: 'Windows',
                os_version: '7'
            },
            bs_chrome_mac_sierra: {
                base: 'BrowserStack',
                browser: 'Chrome',
                browser_version: '56.0',
                os: 'OS X',
                os_version: 'Sierra'
            },
            bs_firefox_mac_sierra: {
                base: 'BrowserStack',
                browser: 'Firefox',
                browser_version: '51.0',
                os: 'OS X',
                os_version: 'Sierra'
            },
            bs_safari_mac_sierra: {
                base: 'BrowserStack',
                browser: 'Safari',
                browser_version: '10.0',
                os: 'OS X',
                os_version: 'Sierra'
            }
        },

        files: [
            // System.js for module loading
            'node_modules/systemjs/dist/system.src.js',
            'node_modules/systemjs/dist/system-polyfills.js',

            // Polyfills
            'node_modules/core-js/client/shim.js',
            'node_modules/web-animations-js/web-animations.min.js',

            // zone.js
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',

            // JWT
            {pattern: 'node_modules/angular2-jwt/**/*.js', included: false, watched: false},
            {pattern: 'node_modules/angular2-jwt/**/*.js.map', included: false, watched: false},

            // RxJs
            {pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false},
            {pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false},

            // Paths loaded via module imports:
            // Angular itself
            {pattern: 'node_modules/@angular/**/*.js', included: false, watched: false},
            {pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false},

            // Load google charts
            'https://www.gstatic.com/charts/loader.js',

            {pattern: 'systemjs.config.js', included: false, watched: false},
            'karma-test-shim.js', // optionally extend SystemJS mapping e.g., with barrels

            // transpiled application & spec code paths loaded via module imports
            {pattern: appBase + '**/*.js', included: false, watched: true},
            {pattern: testingBase + '**/*.js', included: false, watched: true},


            // Asset (HTML & CSS) paths loaded via Angular's component compiler
            // (these paths need to be rewritten, see proxies section)
            {pattern: 'index.html', included: false, watched: true},
            {pattern: appBase + '**/*.html', included: false, watched: true},
            {pattern: appBase + '**/*.css', included: false, watched: true},

            // Paths for debugging with source maps in dev tools
            {pattern: appBase + '**/*.ts', included: false, watched: false},
            {pattern: appBase + '**/*.js.map', included: false, watched: false},
            {pattern: testingBase + '**/*.ts', included: false, watched: false},
            {pattern: testingBase + '**/*.js.map', included: false, watched: false}
        ],

        // Proxied base paths for loading assets
        proxies: {
            // required for modules fetched by SystemJS
            '/base/src/node_modules/': '/base/node_modules/'
        },

        exclude: [],
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'app/**/!(*.spec|*.types|*.module|main).js': debugTests ? [] : ['coverage']
        },

        coverageReporter: {
            includeAllSources: true,
            type: 'json',
            dir: 'coverage/'
        },

        junitReporter: {
            outputDir: 'reports'
        },
        // global config of your BrowserStack account
        browserStack: {
            binaryBasePath: 'browserStackBin/'
        },

        port: 9876,
        colors: true,
        crossOriginAttribute: false,
        singleRun: !debugTests,
        logLevel: config.LOG_INFO,
        captureTimeout: 60000,
        browserDisconnectTimeout: 10000,
        browserDisconnectTolerance: 1,
        browserNoActivityTimeout: 120000
    })
};