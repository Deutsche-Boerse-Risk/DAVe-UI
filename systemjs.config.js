/**
 * System configuration for Angular.
 */
function initApp() {
    'use strict';

    //noinspection ES6ModulesDependencies
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: 'app',
            // angular bundles
            '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
            '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

            // Material Design components
            '@angular/material': 'npm:@angular/material/bundles/material.umd.js',
            '@angular/flex-layout/index': 'npm:@angular/flex-layout/bundles/flex-layout.umd.js',

            // DAVe-Common
            '@dbg-riskit/DAVe-UI-auth': 'npm:@dbg-riskit/DAVe-UI-auth/bundles/DAVe-UI-auth.cjs.js',
            '@dbg-riskit/DAVe-UI-charts': 'npm:@dbg-riskit/DAVe-UI-charts/bundles/DAVe-UI-charts.cjs.js',
            '@dbg-riskit/DAVe-UI-common': 'npm:@dbg-riskit/DAVe-UI-common/bundles/DAVe-UI-common.cjs.js',
            '@dbg-riskit/DAVe-UI-datatable': 'npm:@dbg-riskit/DAVe-UI-datatable/bundles/DAVe-UI-datatable.cjs.js',
            '@dbg-riskit/DAVe-UI-dummy-layout': 'npm:@dbg-riskit/DAVe-UI-dummy-layout/bundles/DAVe-UI-dummy-layout.cjs.js',
            '@dbg-riskit/DAVe-UI-file': 'npm:@dbg-riskit/DAVe-UI-file/bundles/DAVe-UI-file.cjs.js',
            '@dbg-riskit/DAVe-UI-http': 'npm:@dbg-riskit/DAVe-UI-http/bundles/DAVe-UI-http.cjs.js',
            '@dbg-riskit/DAVe-UI-login': 'npm:@dbg-riskit/DAVe-UI-login/bundles/DAVe-UI-login.cjs.js',
            '@dbg-riskit/DAVe-UI-view': 'npm:@dbg-riskit/DAVe-UI-view/bundles/DAVe-UI-view.cjs.js',

            // other libraries
            'rxjs': 'npm:rxjs',

            'angular2-jwt': 'npm:angular2-jwt'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
            'angular2-jwt': {
                main: './angular2-jwt.js',
                defaultExtension: 'js'
            }
        }
    });
}
initApp();