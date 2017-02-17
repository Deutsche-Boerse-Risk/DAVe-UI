import {NavigationExtras} from "@angular/router";

export class RouterStub {
    public navigateByUrl(url: string) {
        return url;
    }

    public navigate(commands: any[], extras?: NavigationExtras) {
        return [commands, extras];
    }
}