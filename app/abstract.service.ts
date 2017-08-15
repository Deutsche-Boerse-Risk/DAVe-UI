import {AuthProvider} from '@dbg-riskit/dave-ui-common';

export abstract class AbstractService {

    public setup(authProvider: AuthProvider) {
        this.setupPeriodicTimer();
        authProvider.loggedInStream.subscribe((auth: boolean) => {
            this.destroyPeriodicTimer();
            if (auth) {
                this.setupPeriodicTimer();
            }
        });
    }

    public abstract setupPeriodicTimer(): void;

    public abstract destroyPeriodicTimer(): void;
}