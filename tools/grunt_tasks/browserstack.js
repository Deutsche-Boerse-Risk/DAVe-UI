module.exports = function (grunt) {
    var BrowserStack = require('browserstack');

    var browserStackCredentials = {
        username: process.env.BROWSER_STACK_USERNAME,
        password: process.env.BROWSER_STACK_ACCESS_KEY,
        proxy: process.env.HTTPS_PROXY || null
    };

    function getApiV4Status() {
        return new Promise(function (resolve, reject) {
            var client = BrowserStack.createClient(browserStackCredentials);
            client.getApiStatus(function (error, status) {
                if (error) {
                    grunt.log.writeln(error.red);
                    reject(error);
                }

                if (!status) {
                    grunt.log.writeln(('No BrowserSync status available!').blue);
                    resolve([]);
                    return;
                }
                resolve(status);
            });
        });
    }

    function logApiV4Status(status) {
        grunt.log.writeln(('    Running sessions: ' + status.running_sessions + '').cyan);
        grunt.log.writeln(('      Sessions limit: ' + status.sessions_limit).cyan);
        grunt.log.writeln(('           Used time: ' + status.used_time + ' min').cyan);
        grunt.log.writeln(('Total available time: ' + status.total_available_time + ' min').cyan);
    }

    function getWorkers() {
        return new Promise(function (resolve, reject) {
            var client = BrowserStack.createClient(browserStackCredentials);
            client.getWorkers(function (error, workers) {
                if (error) {
                    grunt.log.writeln(error.red);
                    reject(error);
                }

                if (!workers || !workers.length) {
                    grunt.log.writeln(('No running workers!').blue);
                    resolve([]);
                    return;
                }
                grunt.log.writeln((workers.length + ' workers are running...').green);
                resolve(workers);
            });
        });
    }

    function terminateWorker(worker) {
        if (Array.isArray(worker)) {
            return Promise.all(worker.map(function (worker) {
                return terminateWorker(worker);
            }))
        }
        return new Promise(function (resolve, reject) {
            var client = BrowserStack.createClient(browserStackCredentials);
            client.terminateWorker(worker.id, function (error, data) {
                if (error) {
                    grunt.log.writeln(error.red);
                    reject(error);
                }

                grunt.log.writeln(('Terminating worker ' + worker.id + '. Worker uptime:' + data.time).green);
                resolve();
            });
        });
    }

    function get5LastBuilds() {
        return getBuilds({
            limit: 5
        });
    }

    function getRunningBuilds() {
        return getBuilds({
            limit: 5,
            status: 'running'
        });
    }

    function getBuilds(options) {
        return new Promise(function (resolve, reject) {
            var automateClient = BrowserStack.createAutomateClient(browserStackCredentials);
            automateClient.getBuilds(options,
                function (error, builds) {
                    if (error) {
                        grunt.log.writeln(error.red);
                        reject(error);
                    }

                    if (!builds || !builds.length) {
                        grunt.log.writeln(('No running builds!').blue);
                        resolve([]);
                        return;
                    }

                    grunt.log.writeln(('Processing ' + builds.length + ' builds...').green);
                    resolve(builds);
                });
        });
    }

    function getRunningSessions(build) {
        if (Array.isArray(build)) {
            return Promise.all(build.map(function (build) {
                return getRunningSessions(build);
            }))
        }
        return new Promise(function (resolve, reject) {
            var automateClient = BrowserStack.createAutomateClient(browserStackCredentials);
            automateClient.getSessions(build.hashed_id, {
                    limit: 100,
                    status: 'running'
                },
                function (error, sessions) {
                    if (error) {
                        grunt.log.writeln(error.red);
                        reject(error);
                    }

                    if (!sessions || !sessions.length) {
                        grunt.log.writeln(('No running sessions!').blue);
                        resolve([]);
                        return;
                    }

                    grunt.log.writeln((sessions.length + ' sessions are running for build ' + build.name + '...').green);
                    resolve(sessions);
                });
        });
    }

    function markSessionFailed(session) {
        if (Array.isArray(session)) {
            return Promise.all(session.map(function (session) {
                return markSessionFailed(session);
            }))
        }
        return new Promise(function (resolve, reject) {
            var automateClient = BrowserStack.createAutomateClient(browserStackCredentials);
            grunt.log.writeln(('-> ' + 'Marking session as failed:' + session.build_name + ', '
            + session.name + ', ' + session.browser + ' ' + session.browser_version
            + ' on ' + session.os + ' ' + session.os_version).green);
            automateClient.updateSession(session.hashed_id, {
                status: 'error'
            }, function (error) {
                if (error) {
                    grunt.log.writeln(error.red);
                    reject(error);
                }
                resolve();
            });
        });
    }

    grunt.registerMultiTask('browserstack_cleanup', 'Removes all BS sessions left', function () {
        var done = this.async();

        getApiV4Status()
            .then(logApiV4Status)
            // Mark all sessions failed
            .then(get5LastBuilds)
            .then(getRunningSessions)
            .then(markSessionFailed)
            // Terminate workers
            .then(getWorkers)
            .then(terminateWorker)
            // Get status after
            .then(getApiV4Status)
            .then(logApiV4Status)
            .then(function () {
                done()
            }).catch(function () {
            done(false)
        });
    });

    grunt.registerMultiTask('browserstack_status', 'Returns BS status', function () {
        var done = this.async();
        var options = this.data.options || {};

        var promise = getApiV4Status();
        if (options.runningSessions || options.sessionsLimit || options.usedTime || options.totalAvailableTime) {
            if (options.runningSessions) {
                promise = promise.then(function (status) {
                    grunt.log.writeln((status.running_sessions + '').cyan);
                })
            }
            if (options.sessionsLimit) {
                promise = promise.then(function (status) {
                    grunt.log.writeln((status.sessions_limit + '').cyan);
                })
            }
            if (options.usedTime) {
                promise = promise.then(function (status) {
                    grunt.log.writeln((status.used_time + '').cyan);
                })
            }
            if (options.totalAvailableTime) {
                promise = promise.then(function (status) {
                    grunt.log.writeln((status.total_available_time + '').cyan);
                })
            }
        } else {
            promise = promise.then(logApiV4Status);
        }
        if (options.numberOfBuildsRunning && options.numberOfBuildsRunning !== 'none') {
            promise = promise
                .then(getRunningBuilds);
            if (options.numberOfBuildsRunning === 'long') {
                promise = promise.then(function (builds) {
                    grunt.log.writeln((builds.length + ' builds running').cyan);
                });
            } else {
                promise = promise.then(function (builds) {
                    grunt.log.writeln((builds.length + '').cyan);
                });
            }
        }
        promise.then(function () {
            done()
        }).catch(function () {
            done(false)
        });
    });
};