import {NgModule} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';

import {TestBed, MetadataOverride} from '@angular/core/testing';

import {RouterStub} from './router.stub';
import {ActivatedRouteStub} from './activated.route.stub';
import {RouterLinkStubDirective} from './router.link.stub';

export function stubRouter(customOverrides?: MetadataOverride<NgModule>): typeof TestBed {
    let override: MetadataOverride<NgModule> = {
        set: {
            imports: [],
            declarations: [
                RouterLinkStubDirective
            ],
            providers: [
                {provide: Router, useClass: RouterStub},
                {provide: ActivatedRoute, useClass: ActivatedRouteStub},
            ],
            exports: [
                RouterLinkStubDirective
            ]
        }
    };
    if (customOverrides) {
        if (customOverrides.add) {
            override.add = customOverrides.add;
        }
        if (customOverrides.set) {
            Object.assign(override.set, customOverrides.set);
        }
        if (customOverrides.remove) {
            override.remove = customOverrides.remove;
        }
    }
    return TestBed.overrideModule(RouterModule, override);
}