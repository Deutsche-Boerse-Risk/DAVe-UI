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
            '@angular/cdk/a11y': 'npm:@angular/cdk/bundles/cdk-a11y.umd.js',
            '@angular/cdk/bidi': 'npm:@angular/cdk/bundles/cdk-bidi.umd.js',
            '@angular/cdk/coercion': 'npm:@angular/cdk/bundles/cdk-coercion.umd.js',
            '@angular/cdk/collections': 'npm:@angular/cdk/bundles/cdk-collections.umd.js',
            '@angular/cdk/keycodes': 'npm:@angular/cdk/bundles/cdk-keycodes.umd.js',
            '@angular/cdk/observers': 'npm:@angular/cdk/bundles/cdk-observers.umd.js',
            '@angular/cdk/overlay': 'npm:@angular/cdk/bundles/cdk-overlay.umd.js',
            '@angular/cdk/platform': 'npm:@angular/cdk/bundles/cdk-platform.umd.js',
            '@angular/cdk/portal': 'npm:@angular/cdk/bundles/cdk-portal.umd.js',
            '@angular/cdk/rxjs': 'npm:@angular/cdk/bundles/cdk-rxjs.umd.js',
            '@angular/cdk/scrolling': 'npm:@angular/cdk/bundles/cdk-scrolling.umd.js',
            '@angular/cdk/table': 'npm:@angular/cdk/bundles/cdk-table.umd.js',
            '@angular/material': 'npm:@angular/material/bundles/material.umd.js',

            // DAVe-Common
            '@dbg-riskit/dave-ui-auth': 'npm:@dbg-riskit/dave-ui-auth/bundles/dave-ui-auth.cjs.js',
            '@dbg-riskit/dave-ui-charts': 'npm:@dbg-riskit/dave-ui-charts/bundles/dave-ui-charts.cjs.js',
            '@dbg-riskit/dave-ui-common': 'npm:@dbg-riskit/dave-ui-common/bundles/dave-ui-common.cjs.js',
            '@dbg-riskit/dave-ui-datatable': 'npm:@dbg-riskit/dave-ui-datatable/bundles/dave-ui-datatable.cjs.js',
            '@dbg-riskit/dave-ui-dbg-layout': 'npm:@dbg-riskit/dave-ui-dbg-layout/bundles/dave-ui-dbg-layout.cjs.js',
            '@dbg-riskit/dave-ui-dummy-layout': 'npm:@dbg-riskit/dave-ui-dummy-layout/bundles/dave-ui-dummy-layout.cjs.js',
            '@dbg-riskit/dave-ui-devkit': 'npm:@dbg-riskit/dave-ui-devkit/bundles/dave-ui-devkit.cjs.js',
            '@dbg-riskit/dave-ui-error': 'npm:@dbg-riskit/dave-ui-error/bundles/dave-ui-error.cjs.js',
            '@dbg-riskit/dave-ui-file': 'npm:@dbg-riskit/dave-ui-file/bundles/dave-ui-file.cjs.js',
            '@dbg-riskit/dave-ui-http': 'npm:@dbg-riskit/dave-ui-http/bundles/dave-ui-http.cjs.js',
            '@dbg-riskit/dave-ui-login': 'npm:@dbg-riskit/dave-ui-login/bundles/dave-ui-login.cjs.js',
            '@dbg-riskit/dave-ui-view': 'npm:@dbg-riskit/dave-ui-view/bundles/dave-ui-view.cjs.js',

            // other libraries
            'rxjs': 'npm:rxjs'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            }
        }
    });
}
initApp();