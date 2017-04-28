module.exports = function (grunt) {
    'use strict';

    var proxy_parts = (process.env.http_proxy || '')
            .match(/^((https?)\:\/\/)?(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/) || [];

    var browsers = require('./browser-providers.conf');

    //<editor-fold desc="Function definitions" defaultstate="collapsed">
    function providedJS(file) {
        return [file, file + '.map'];
    }

    function addAppFolders(pattern) {
        var i, paths = [];
        grunt.appFolders.forEach(function (item) {
            paths.push(item + '/' + pattern);
        });
        if (arguments.length > 1) {
            for (i = 1; i < arguments.length; i += 1) {
                paths.push(arguments[i]);
            }
        }
        return paths;
    }

    //</editor-fold>

    var // BrowserSync plugins to make logs better and to fallback to index.html
        fallback = require('connect-history-api-fallback'),
        log = require('connect-logger'),

        // Rollup plugins - used to create single bundle from all SystemJS
        nodeResolve = require('rollup-plugin-node-resolve'),
        commonjs = require('rollup-plugin-commonjs'),
        uglify = require('rollup-plugin-uglify'),

        // Project paths
        destination = 'dist/', // Destination folder for AoT version
        sassPattern, cssPattern, // SASS and compiled CSS
        htmlPattern, // HTML templates
        tsPattern, jsPattern, jsToCleanPattern; // TypeScript, JavaScript and mapping files

    grunt.appFolders = ['app', 'testing'];

    // Populate paths
    sassPattern = addAppFolders('**/*.scss', 'styles.scss');
    cssPattern = addAppFolders('**/*.css', 'styles.css');
    htmlPattern = addAppFolders('**/*.html', 'index.html');
    jsPattern = addAppFolders('**/*.js', 'systemjs.config.js');
    jsToCleanPattern = addAppFolders('**/*.js').concat(addAppFolders('**/*.js.map'));
    tsPattern = addAppFolders('**/*.ts');

    grunt.initConfig({
        cleanup: {
            all: {
                src: [destination, 'ngFactories/', 'coverage/', 'reports/', '.tscache/'].concat(cssPattern).concat(jsToCleanPattern)
            },
            postDist: {
                src: [destination + 'app/', destination + 'ngFactories/', 'ngFactories/']
            }
        },
        ts: {
            compile: {
                options: {
                    fast: 'never'
                },
                tsconfig: true
            },
            watchTS: {
                options: {
                    fast: 'always'
                },
                tsconfig: './tsconfig.watch.json'
            }
        },
        ngc: {
            default: {}
        },
        browserstack_cleanup: {
            default: {}
        },
        browserstack_status: {
            short: {
                options: {
                    runningSessions: true,
                    numberOfBuildsRunning: 'short'
                }
            },
            full: {
                options: {
                    numberOfBuildsRunning: 'long'
                }
            }
        },
        rollup: {
            options: {
                sourceMap: false,
                format: 'iife',
                plugins: function () {
                    return [
                        nodeResolve({jsnext: true, module: true}),
                        commonjs({
                            include: [
                                'node_modules/rxjs/**',
                                'node_modules/angular2-jwt/angular2-jwt.js'
                            ]
                        }),
                        uglify()
                    ];
                }
            },
            default: {
                files: {
                    'dist/dave.js': [destination + 'app/main.aot.js'] // Only one source file is permitted
                }
            }
        },
        copy: {
            shim: {
                src: providedJS('node_modules/core-js/client/shim.min.js'),
                dest: destination
            },
            fileSave: {
                src: providedJS('node_modules/file-saver/FileSaver.min.js'),
                dest: destination
            },
            'intl.js': {
                src: providedJS('node_modules/intl/dist/Intl.min.js')
                    .concat(providedJS('node_modules/intl/locale-data/jsonp/en-US.js')),
                dest: destination
            },
            'ie.intl.shim.js': {
                src: providedJS('ie.intl.shim.js'),
                dest: destination
            },
            'web-animations-js': {
                src: providedJS('node_modules/web-animations-js/web-animations.min.js'),
                dest: destination
            },
            ZoneJS: {
                src: 'node_modules/zone.js/dist/zone.min.js',
                dest: destination
            },
            RestURL: {
                src: 'restUrl.js',
                dest: destination
            },
            html: {
                src: 'index.aot.html',
                dest: destination + 'index.html'
            },
            css: {
                src: 'styles.css',
                dest: destination
            },
            favicon: {
                src: 'favicon.ico',
                dest: destination
            },
            img: {
                src: 'img/**/*',
                dest: destination
            }
        },
        sass: {
            compile: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    ext: '.css',
                    extDot: 'last',
                    src: sassPattern,
                    dest: '.'
                }]
            }
        },
        cssmin: {
            minify: {
                files: [{
                    expand: true,
                    src: cssPattern,
                    dest: '.'
                }]
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js',
                reporters: ['spec', 'kjhtml', 'junit', 'coverage']
            },
            dev: {
                browsers: browsers.Local.ALL
            },
            devChrome: {
                browsers: browsers.Local.CHROME
            },
            devFirefox: {
                browsers: browsers.Local.FIREFOX
            },
            devIE: {
                browsers: browsers.Local.IE
            },
            devSafari: {
                browsers: browsers.Local.SAFARI
            },
            devBrowserStack: {
                browsers: browsers.BrowserStack.ALL
            },
            devBrowserStackMinimal: {
                browsers: browsers.BrowserStack.MINIMAL
            },
            devBrowserStackChrome: {
                browsers: browsers.BrowserStack.CHROME
            },
            devBrowserStackFirefox: {
                browsers: browsers.BrowserStack.FIREFOX
            },
            devBrowserStackEdge: {
                browsers: browsers.BrowserStack.EDGE
            },
            devBrowserStackIE: {
                browsers: browsers.BrowserStack.IE
            },
            devBrowserStackIOS: {
                browsers: browsers.BrowserStack.IOS
            },
            devBrowserStackSafari: {
                browsers: browsers.BrowserStack.SA
            },
            devBrowserStackProxy: {
                browsers: browsers.BrowserStack.ALL,
                browserStack: {
                    proxyHost: proxy_parts[4],
                    proxyPort: proxy_parts[5] || 8080,
                    proxyProtocol: proxy_parts[2] || 'http'
                }
            },
            devBrowserStackProxyChrome: {
                browsers: browsers.BrowserStack.CHROME,
                browserStack: {
                    proxyHost: proxy_parts[4],
                    proxyPort: proxy_parts[5] || 8080,
                    proxyProtocol: proxy_parts[2] || 'http'
                }
            },
            devBrowserStackProxyFirefox: {
                browsers: browsers.BrowserStack.FIREFOX,
                browserStack: {
                    proxyHost: proxy_parts[4],
                    proxyPort: proxy_parts[5] || 8080,
                    proxyProtocol: proxy_parts[2] || 'http'
                }
            },
            devBrowserStackProxyEdge: {
                browsers: browsers.BrowserStack.EDGE,
                browserStack: {
                    proxyHost: proxy_parts[4],
                    proxyPort: proxy_parts[5] || 8080,
                    proxyProtocol: proxy_parts[2] || 'http'
                }
            },
            devBrowserStackProxyIE: {
                browsers: browsers.BrowserStack.IE,
                browserStack: {
                    proxyHost: proxy_parts[4],
                    proxyPort: proxy_parts[5] || 8080,
                    proxyProtocol: proxy_parts[2] || 'http'
                }
            },
            devBrowserStackProxyIOS: {
                browsers: browsers.BrowserStack.IOS,
                browserStack: {
                    proxyHost: proxy_parts[4],
                    proxyPort: proxy_parts[5] || 8080,
                    proxyProtocol: proxy_parts[2] || 'http'
                }
            },
            devBrowserStackProxySafari: {
                browsers: browsers.BrowserStack.SAFARI,
                browserStack: {
                    proxyHost: proxy_parts[4],
                    proxyPort: proxy_parts[5] || 8080,
                    proxyProtocol: proxy_parts[2] || 'http'
                }
            }
        },
        remapIstanbul: {
            build: {
                src: 'coverage/**/coverage-final.json',
                options: {
                    reports: {
                        'html': 'coverage/html-report/',
                        'lcovonly': 'coverage/lcov.info'
                    }
                }
            }
        },
        coveralls: {
            options: {
                force: true
            },
            report: {
                src: 'coverage/lcov.info'
            }
        },
        watch: {
            options: {
                interrupt: true,
                spawn: false
            },
            devSass: {
                files: sassPattern,
                tasks: ['sass']
            },
            devTs: {
                files: tsPattern,
                tasks: ['ts:watchTS']
            },
            dist: {
                files: sassPattern.concat(tsPattern),
                tasks: ['dist'],
                options: {
                    interrupt: false
                }
            }
        },
        browserSync: {
            options: {
                watchOptions: {
                    awaitWriteFinish: true,
                    usePolling: true,
                    interval: 5000
                },
                injectChanges: false, // workaround for Angular 2 styleUrls loading
                ui: false,
                server: {
                    baseDir: './',
                    middleware: [
                        log({format: '%date %status %method %url'}),
                        fallback({
                            index: '/index.html',
                            htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'] // systemjs workaround
                        })
                    ]
                },
                browser: browsers.BrowserSync
            },
            dev: {
                bsFiles: {
                    src: cssPattern.concat(htmlPattern).concat(jsPattern)
                }
            },
            dist: {
                bsFiles: {
                    src: destination + '**/*'
                },
                options: {
                    server: {
                        baseDir: './' + destination,
                        middleware: [
                            log({format: '%date %status %method %url'}),
                            fallback({
                                index: '/index.html',
                                htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'] // systemjs workaround
                            })
                        ]
                    }
                }
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dev: {
                tasks: ['browserSync:dev', 'watch:devSass', 'watch:devTs']
            },
            dist: {
                tasks: ['browserSync:dist', 'watch:dist']
            }
        }
    });

    // Build tools
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.renameTask('clean', 'cleanup'); // Renamed so we do not have name clash with our clean.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-rollup');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('remap-istanbul');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-karma');

    // Our local tasks
    grunt.loadTasks('./tools/grunt_tasks');

    // Build tasks
    grunt.registerTask('clean', ['cleanup:all']);
    grunt.registerTask('compile', ['sass', 'ts:compile']);
    grunt.registerTask('build', ['cleanup:all', 'sass', 'ts:compile']);
    grunt.registerTask('run', ['build', 'concurrent:dev']);

    // Dist tasks
    grunt.registerTask('dist', ['cleanup:all', 'sass', 'cssmin', 'ngc', 'copy', 'rollup', 'cleanup:postDist']);
    grunt.registerTask('dist-run', ['dist', 'concurrent:dist']);

    // Local test tasks
    grunt.registerTask('test', karmaConfig('dev'));
    grunt.registerTask('testChrome', karmaConfig('devChrome'));
    grunt.registerTask('testFirefox', karmaConfig('devFirefox'));
    grunt.registerTask('testIE', karmaConfig('devIE'));
    grunt.registerTask('testSafari', karmaConfig('devSafari'));

    // BrowserStack test tasks
    grunt.registerTask('testBrowserStack', karmaConfig('devBrowserStack'));
    grunt.registerTask('testBrowserStackChrome', karmaConfig('devBrowserStackChrome'));
    grunt.registerTask('testBrowserStackFirefox', karmaConfig('devBrowserStackFirefox'));
    grunt.registerTask('testBrowserStackEdge', karmaConfig('devBrowserStackEdge'));
    grunt.registerTask('testBrowserStackIE', karmaConfig('devBrowserStackIE'));
    grunt.registerTask('testBrowserStackIOS', karmaConfig('devBrowserStackIOS'));
    grunt.registerTask('testBrowserStackSafari', karmaConfig('devBrowserStackSafari'));

    // BrowserStack (behind proxy) test tasks
    grunt.registerTask('testBrowserStackProxy', karmaConfig('devBrowserStackProxy'));
    grunt.registerTask('testBrowserStackProxyChrome', karmaConfig('devBrowserStackProxyChrome'));
    grunt.registerTask('testBrowserStackProxyFirefox', karmaConfig('devBrowserStackProxyFirefox'));
    grunt.registerTask('testBrowserStackProxyEdge', karmaConfig('devBrowserStackProxyEdge'));
    grunt.registerTask('testBrowserStackProxyIE', karmaConfig('devBrowserStackProxyIE'));
    grunt.registerTask('testBrowserStackProxyIOS', karmaConfig('devBrowserStackProxyIOS'));
    grunt.registerTask('testBrowserStackProxySafari', karmaConfig('devBrowserStackProxySafari'));

    // CircleCI test tasks
    grunt.registerTask('testCircleCI', karmaConfig('devBrowserStack', 'coveralls'));
    grunt.registerTask('testCircleCIMinimal', karmaConfig('devBrowserStackMinimal', 'coveralls'));
    grunt.registerTask('testCircleCIChrome', karmaConfig('devChrome', 'coveralls'));

    function karmaConfig(confName) {
        var config = ['build', 'karma:' + confName, 'remapIstanbul'];
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                config.push(arguments[i]);
            }
        }
        return config;
    }
};