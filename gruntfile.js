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
                src: [destination, 'ngFactories/', 'coverage/', 'reports/'].concat(cssPattern).concat(jsToCleanPattern)
            },
            postDist: {
                src: [destination + 'app/', destination + 'ngFactories/', 'ngFactories/']
            }
        },
        ts: {
            default: {}
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
            jQuery: {
                src: providedJS('node_modules/jquery/dist/jquery.min.js'),
                dest: destination
            },
            Bootstrap: {
                src: providedJS('node_modules/bootstrap/dist/css/bootstrap.min.css')
                    .concat(providedJS('node_modules/bootstrap/dist/js/bootstrap.min.js'))
                    .concat(['node_modules/bootstrap/dist/fonts/**/*']),
                dest: destination
            },
            MetisMenu: {
                src: 'node_modules/metismenu/dist/metisMenu.min.css',
                dest: destination
            },
            'sb-admin-2': {
                src: 'node_modules/sb-admin-2/dist/css/sb-admin-2.css',
                dest: destination
            },
            'font-awesome': {
                src: [
                    'node_modules/font-awesome/css/font-awesome.min.css',
                    'node_modules/font-awesome/fonts/**/*'
                ],
                dest: destination
            },
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
                tasks: ['ts']
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
                browser: [
                    'chrome',
                    'google chrome'
                ]
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
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('remap-istanbul');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-karma');

    // Our local tasks
    grunt.loadTasks('./tools/grunt_tasks');

    // Build tasks
    grunt.registerTask('clean', ['cleanup:all']);
    grunt.registerTask('build', ['cleanup:all', 'sass', 'ts']);
    grunt.registerTask('run', ['build', 'concurrent:dev']);

    // Dist tasks
    grunt.registerTask('dist', ['cleanup:all', 'sass', 'cssmin', 'ngc', 'copy', 'rollup', 'cleanup:postDist']);
    grunt.registerTask('dist-run', ['dist', 'concurrent:dist']);

    // Local test tasks
    grunt.registerTask('test', ['build', 'karma:dev', 'remapIstanbul']);
    grunt.registerTask('testChrome', ['build', 'karma:devChrome', 'remapIstanbul']);
    grunt.registerTask('testFirefox', ['build', 'karma:devFirefox', 'remapIstanbul']);
    grunt.registerTask('testIE', ['build', 'karma:devIE', 'remapIstanbul']);

    // BrowserStack test tasks
    grunt.registerTask('testBrowserStack', ['build', 'karma:devBrowserStack', 'remapIstanbul']);
    grunt.registerTask('testBrowserStackChrome', ['build', 'karma:devBrowserStackChrome', 'remapIstanbul']);
    grunt.registerTask('testBrowserStackFirefox', ['build', 'karma:devBrowserStackFirefox', 'remapIstanbul']);
    grunt.registerTask('testBrowserStackEdge', ['build', 'karma:devBrowserStackEdge', 'remapIstanbul']);
    grunt.registerTask('testBrowserStackIE', ['build', 'karma:devBrowserStackIE', 'remapIstanbul']);
    grunt.registerTask('testBrowserStackIOS', ['build', 'karma:devBrowserStackIOS', 'remapIstanbul']);
    grunt.registerTask('testBrowserStackSafari', ['build', 'karma:devBrowserStackSafari', 'remapIstanbul']);

    // BrowserStack (behind proxy) test tasks
    grunt.registerTask('testBrowserStackProxy', ['build', 'karma:devBrowserStackProxy', 'remapIstanbul']);
    grunt.registerTask('testBrowserStackProxyChrome', ['build', 'karma:devBrowserStackProxyChrome', 'remapIstanbul']);
    grunt.registerTask('testBrowserStackProxyFirefox', ['build', 'karma:devBrowserStackProxyFirefox', 'remapIstanbul']);
    grunt.registerTask('testBrowserStackProxyEdge', ['build', 'karma:devBrowserStackProxyEdge', 'remapIstanbul']);
    grunt.registerTask('testBrowserStackProxyIE', ['build', 'karma:devBrowserStackProxyIE', 'remapIstanbul']);
    grunt.registerTask('testBrowserStackProxyIOS', ['build', 'karma:devBrowserStackProxyIOS', 'remapIstanbul']);
    grunt.registerTask('testBrowserStackProxySafari', ['build', 'karma:devBrowserStackProxySafari', 'remapIstanbul']);

    // CircleCI test tasks
    grunt.registerTask('testCircleCI', ['testBrowserStack', 'coveralls']);
    grunt.registerTask('testCircleCIChrome', ['testChrome', 'coveralls']);
};