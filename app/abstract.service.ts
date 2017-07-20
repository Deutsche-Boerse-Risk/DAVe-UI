import {AuthProvider} from '@dbg-riskit/dave-ui-common';

export abstract class AbstractService {

    constructor(authService: AuthProvider) {
        setTimeout(() => this.setupPeriodicTimer());
        authService.loggedInChange.subscribe((auth: boolean) => {
            this.destroyPeriodicTimer();
            if (auth) {
                this.setupPeriodicTimer();
            }
        });
    }

    public abstract setupPeriodicTimer(): void;

    public abstract destroyPeriodicTimer(): void;
}