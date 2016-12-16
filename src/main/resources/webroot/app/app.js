/**
 * Created by jakub on 15.12.14.
 */

(function() {
    'use strict';

    var dave = angular.module('dave', [
        'ngRoute',
        'ngStorage',
        'angular.morris',
        'googlechart',
        'angular-jwt'
    ]);

    dave.constant('hostConfig', {
        //restURL: 'https://ttsave.snapshot.dave.dbg-devops.com/api/v1.0' // 'http(s)://someUrl:port/path'
        restURL: '/api/v1.0' // 'http(s)://someUrl:port/path'
    });

    dave.run(function($http, $localStorage) {
        // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        }
    });
})();