/**
 * Created by jakub on 20/10/2016.
 */

(function() {
    'use strict';

    angular.module('dave').controller('LoginController', LoginController);

    function LoginController($scope, $http, $interval, $rootScope, $location, $localStorage, jwtHelper, hostConfig) {
        $rootScope.authStatus = false;
        $rootScope.authUsername = "";

        var vm = this;
        vm.username = null;
        vm.password = null;
        vm.errorMessage = null;
        vm.login = login;
        vm.logout = logout;

        var url = {
            "status": hostConfig.restURL + '/user/loginStatus',
            "login": hostConfig.restURL + '/user/login',
            "refresh": hostConfig.restURL + '/user/refreshToken'
        };

        checkAuth();
        var refresh = $interval(checkAuth, 60000);

        // if the current token is about to expire in less then 10 minutes -> ask for a new one
        function refreshTokenIfExpires() {
            if ($localStorage.currentUser) {
                var expirationThreshold = new Date();
                expirationThreshold.setMinutes(expirationThreshold.getMinutes() + 10);
                var tokenExpires = jwtHelper.getTokenExpirationDate($localStorage.currentUser.token) < expirationThreshold;
                if (tokenExpires) {
                  $http.get(url.refresh).success(function (response) {
                      $localStorage.currentUser.token = response.token;
                      $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
                  });
                }
            }
        }

        function checkAuth() {
            refreshTokenIfExpires();
            $http.get(url.status).success(function (data) {
                if (data.username != null) {
                    $rootScope.authStatus = true;
                    $rootScope.authUsername = data.username;

                    if ($rootScope.authRequestedPath) {
                        var path = $rootScope.authRequestedPath;
                        $rootScope.authRequestedPath = null;
                        $location.path(path);
                    }
                }
                else {
                    $rootScope.authStatus = false;
                    $rootScope.authUsername = "";

                    if ($location.path() != "/login") {
                        $location.path("/login");
                    }
                }
            })
                .error(function (data) {
                    $rootScope.authStatus = false;
                    $rootScope.authUsername = "";

                    if ($location.path() != "/login") {
                        $location.path("/login");
                    }
                });
        }

        function login(username, password) {
            vm.errorMessage = null;
            var loginData = { "username": username, "password": password };

            $http.post(url.login, loginData).success(function(response) {
                if (response.token) {
                    $rootScope.authStatus = true;
                    $rootScope.authUsername = username;
                    // store username and token in local storage to keep user logged in between page refreshes
                    $localStorage.currentUser = { username: username, token: response.token };
                    // add jwt token to auth header for all requests made by the $http service
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
                    if ($rootScope.authRequestedPath) {
                        var path = $rootScope.authRequestedPath;
                        $rootScope.authRequestedPath = null;
                        $location.path(path);
                    }
                    else {
                        var path = "/dashboard";
                        $location.path(path);
                    }
                } else {
                    vm.errorMessage = "Authentication failed. Server didn't generate a token.";
                }
            }).error(function(data) {
                vm.errorMessage = "Authentication failed. Is the username and password correct?";
            });
        }

        function logout() {
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $http.defaults.headers.common.Authorization = '';
        }

        $scope.$on("$destroy", function() {
            if ($scope.refresh !== null) {
                $interval.cancel(refresh);
            }
        });
    };
})();