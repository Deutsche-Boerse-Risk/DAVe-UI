module.exports = function (grunt) {
    'use strict';

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
        tsPattern, jsPattern, jsToCleanPattern, // TypeScript, JavaScript and mapping files
        appFolders = ['app'];

    // Populate paths
    sassPattern = addAppFolders('**/*.scss', 'styles.scss');
    cssPattern = addAppFolders('**/*.css', 'styles.css');
    htmlPattern = addAppFolders('**/*.html', 'index.html');
    jsPattern = addAppFolders('**/*.js', 'systemjs.config.js');
    jsToCleanPattern = addAppFolders('**/*.js').concat(addAppFolders('**/*.js.map'));
    tsPattern = addAppFolders('**/*.ts');

    //<editor-fold desc="Task and function definition" defaultstate="collapsed">
    function runProcess(command, args) {
        return function () {
            var done = this.async(), start = Date.now(), src = command + ' ' + args.join(' ');

            grunt.log.writeln('-> '.cyan + 'executing ' + src.cyan);


            //use spawn so we don't have to depend on process.exit();
            function tsc(callback) {

                var child = grunt.util.spawn(
                    {
                        cmd: command,
                        args: args
                    },
                    function (error, result, code) {
                        if (error) {
                            grunt.fail.warn('-> '.cyan + 'error '.red + ('' + code).red + ' ' + src.cyan + ' (' + (Date.now() - start) + 'ms)');
                            callback(error);
                        } else if (code !== 0) {
                            grunt.fail.warn('-> '.cyan + 'exitcode '.red + ('' + code).red + ' ' + src.cyan + ' (' + (Date.now() - start) + 'ms)');
                            callback(new Error('bad exit code ' + code), code);
                        } else {
                            grunt.log.writeln('-> '.cyan + 'completed ' + src.cyan + ' (' + (Date.now() - start) + 'ms)');
                            callback();
                        }
                    }
                );

                child.stdout.on('data', function (data) {
                    grunt.log.write(data);
                });
                child.stderr.on('data', function (data) {
                    grunt.log.write(('' + data).red);
                });

            }

            grunt.util.async.series([
                    tsc
                ],
                function (err) {
                    grunt.log.writeln('');
                    if (err) {
                        grunt.log.writeln(err);
                        done(false);
                    }
                    else {
                        done();
                    }
                });
        };
    }

    grunt.registerMultiTask('ts', 'Run TypeScript compiler', runProcess('tsc', ['-p', './tsconfig.json']));
    grunt.registerMultiTask('ngc', 'Run Angular 2 compiler', runProcess('npm', ['run', 'ngc']));

    function providedJS(file) {
        return [file, file + ".map"];
    }

    function addAppFolders(pattern) {
        var i, paths = [];
        appFolders.forEach(function (item) {
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

    grunt.initConfig({
        cleanup: {
            all: {
                src: [destination, 'ngFactories/'].concat(cssPattern).concat(jsToCleanPattern)
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
            "web-animations-js": {
                src: providedJS('node_modules/web-animations-js/web-animations.min.js'),
                dest: destination
            },
            ZoneJS: {
                src: 'node_modules/zone.js/dist/zone.min.js',
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
    grunt.renameTask('clean', 'cleanup');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-rollup');
    grunt.loadNpmTasks('grunt-sass');

    // Dev run tools
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');

    // register at least this one task
    grunt.registerTask('clean', ['cleanup:all']);
    grunt.registerTask('build', ['cleanup:all', 'sass', 'ts']);
    grunt.registerTask('run', ['build', 'concurrent:dev']);
    grunt.registerTask('dist', ['cleanup:all', 'sass', 'cssmin', 'ngc', 'copy', 'rollup', 'cleanup:postDist']);
    grunt.registerTask('dist-run', ['dist', 'concurrent:dist']);
};