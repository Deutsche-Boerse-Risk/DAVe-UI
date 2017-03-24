import {EventEmitter, Injectable} from '@angular/core';
import {NavigationExtras, NavigationEnd, UrlTree, UrlSegmentGroup, UrlSegment} from '@angular/router';

@Injectable()
export class RouterStub {

    private id: number = 0;

    public navigated: boolean = true;

    private currentUrlTree: UrlTree = this.createUrlTree(['/dashboard']);

    public events: EventEmitter<NavigationEnd> = new EventEmitter<NavigationEnd>();

    public getURLTree(url: string | UrlTree | any[]): UrlTree {
        if (Array.isArray(url)) {
            return this.createUrlTree(url as any[]);
        }

        if (url instanceof Object) {
            return url as UrlTree;
        }

        return this.createUrlTree((url as string).split('/'));
    }

    public navigateByUrl(url: string | UrlTree) {
        this.currentUrlTree = this.getURLTree(url);
        this.emitNavigate();
        return url;
    }

    public navigate(commands: any[], extras?: NavigationExtras) {
        this.currentUrlTree = this.getURLTree(commands);
        this.emitNavigate();
        return [commands, extras];
    }

    private emitNavigate(): void {
        this.id++;
        let urlString = RouterStub.serializeUrl(this.currentUrlTree);
        this.events.emit(new NavigationEnd(this.id, urlString, urlString));
    }

    public isActive(url: UrlTree): boolean {
        return RouterStub.serializeUrl(this.currentUrlTree).indexOf(RouterStub.serializeUrl(url)) !== -1;
    }

    public createUrlTree(commands: any[], extras?: NavigationExtras): UrlTree {
        let _b = extras === void 0 ? {} : extras, queryParams = _b.queryParams, fragment = _b.fragment;
        return {
            root: new UrlSegmentGroup(commands.map((command: any) => {
                return new UrlSegment(command, {});
            }), {}),
            queryParams: queryParams,
            fragment: fragment,
            queryParamMap: null
        };
    }

    public static serializeUrl(url: UrlTree): string {
        return url.root.segments.map((segment: UrlSegment) => segment.path).join('/');
    }
}