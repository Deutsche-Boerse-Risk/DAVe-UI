module.exports = function runProcess(grunt, command, args) {
    return function () {
        var done = this.async(), start = Date.now(), src = command + ' ' + args.join(' ');

        grunt.log.writeln('-> '.cyan + 'executing ' + src.cyan);


        //use spawn so we don't have to depend on process.exit();
        function exec(callback) {

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
                exec
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
};