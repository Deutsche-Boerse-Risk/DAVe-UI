import {EventEmitter, Injectable} from "@angular/core";
import {NavigationExtras, NavigationEnd, UrlTree, UrlSegmentGroup, UrlSegment} from "@angular/router";

@Injectable()
export class RouterStub {

    private id: number = 0;

    public navigated: boolean = true;

    private currentUrlTree: UrlTree = this.createUrlTree(['/dashboard']);

    public events: EventEmitter<NavigationEnd> = new EventEmitter<NavigationEnd>();

    public navigateByUrl(url: string | UrlTree) {
        let urlString;
        if (url instanceof Object) {
            urlString = this.serializeUrl(<UrlTree>url);
        } else {
            urlString = url;
            url = this.createUrlTree((url as string).split('/'));
        }
        this.currentUrlTree = <UrlTree>url;
        this.events.emit(new NavigationEnd(this.id, urlString, urlString));
        this.id++;
        return url;
    }

    public navigate(commands: any[], extras?: NavigationExtras) {
        this.id++;
        this.currentUrlTree = this.createUrlTree(commands, extras);
        this.events.emit(new NavigationEnd(this.id, commands.join('/'), commands.join('/')));
        return [commands, extras];
    }

    public isActive(url: UrlTree, exact: boolean): boolean {
        return this.serializeUrl(this.currentUrlTree).indexOf(this.serializeUrl(url)) !== -1;
    }

    public createUrlTree(commands: any[], extras?: NavigationExtras): UrlTree {
        let _b = extras === void 0 ? {} : extras, queryParams = _b.queryParams, fragment = _b.fragment;
        return {
            root: new UrlSegmentGroup(commands.map((command: any) => {
                return new UrlSegment(command, {});
            }), {}),
            queryParams: queryParams,
            fragment: fragment
        };
    }

    public serializeUrl(url: UrlTree): string {
        return url.root.segments.map((segment: UrlSegment) => segment.path).join('/');
    }
}

export class LocationStrategyStub {

    public prepareExternalUrl(internal: string): string {
        return internal;
    }
}