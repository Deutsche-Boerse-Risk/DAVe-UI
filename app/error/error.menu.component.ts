import {animate, AnimationEvent, keyframes, state, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import {AuthService} from '@dbg-riskit/dave-ui-auth';
import {ErrorMessage, ErrorType} from '@dbg-riskit/dave-ui-common';

import {ErrorCollectorService} from './error.collector';

import {Subscription} from 'rxjs/Subscription';

export const JIGGLE_ANIMATION = animate('1s ease-in', keyframes([
    style({
        transform: 'scale(0.8) translateX(-1px) rotate(0)',
        offset   : 0.1
    }),
    style({
        transform: 'scale(1) translateX(2px) rotate(4deg)',
        offset   : 0.2
    }),
    style({
        transform: 'scale(1.2) translateX(-4px) rotate(0)',
        offset   : 0.3
    }),
    style({
        transform: 'scale(1.5) translateX(4px) rotate(0)',
        offset   : 0.4
    }),
    style({
        transform: 'scale(1.5) translateX(-4px) rotate(-8deg)',
        offset   : 0.5
    }),
    style({
        transform: 'scale(1.5) translateX(4px) rotate(0)',
        offset   : 0.6
    }),
    style({
        transform: 'scale(1.2) translateX(-4px) rotate(0)',
        offset   : 0.7
    }),
    style({
        transform: 'scale(1) translateX(2px) rotate(4deg)',
        offset   : 0.8
    }),
    style({
        transform: 'scale(1) translateX(-1px) rotate(0)',
        offset   : 0.9
    })
]));

export class ErrorMessagePanel {
    private _error: ErrorMessage;
    private _date: Date = new Date();
    private _read: boolean = false;

    constructor(error: ErrorMessage) {
        this._error = error;
    }

    public get message(): string {
        return this._error.message;
    }

    public get type(): ErrorType {
        return this._error.errorType;
    }

    public get statusCode(): number {
        return this._error.status;
    }

    public get date(): Date {
        return this._date;
    }

    public get read(): boolean {
        return this._read;
    }

    public markRead(): void {
        this._read = true;
    }
}

@Component({
    moduleId       : module.id,
    selector       : 'error-menu-component',
    templateUrl    : 'error.menu.component.html',
    animations     : [
        trigger('buttonState', [
            state('inactive', style({transform: 'translateX(0) scale(0)'})),
            state('active', style({transform: 'translateX(0) scale(1)'})),
            state('newError', style({transform: 'translateX(0) scale(1)'})),
            transition('void => active', [
                style({transform: 'scale(0) translateX(0) rotate(0)'}),
                JIGGLE_ANIMATION
            ]),
            transition('void => newError', [
                style({transform: 'scale(0) translateX(0) rotate(0)'}),
                JIGGLE_ANIMATION
            ]),
            transition('active => newError', [
                style({transform: 'scale(1) translateX(0) rotate(0)'}),
                JIGGLE_ANIMATION
            ])
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent implements OnInit, OnDestroy {

    public state: 'active' | 'newError' | null = null;

    private errorSubscription: Subscription;
    private authSubscription: Subscription;

    private _errors: ErrorMessagePanel[] = [];
    private stateTransitionTimeout: NodeJS.Timer;

    constructor(private errorCollector: ErrorCollectorService, private authService: AuthService,
        private changeDetectorRef: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this.subscribeForErrors();
        this.authSubscription = this.authService.loggedInChange.subscribe((auth: boolean) => {
            this.clearErrorWarningAnimationTimeout();
            this.unsubscribeFormErrorStream();
            if (auth) {
                this.subscribeForErrors();
            }
        });
    }

    public ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
        this.clearErrorWarningAnimationTimeout();
        this.unsubscribeFormErrorStream();
    }

    public get color(): 'warn' | null {
        if (this.errors.some((error: ErrorMessagePanel) => !error.read)) {
            return 'warn';
        }
        return null;
    }

    public markErrorsRead(): void {
        this.clearErrorWarningAnimationTimeout();
        this.errors.forEach((error: ErrorMessagePanel) => error.markRead());
        this.changeDetectorRef.markForCheck();
    }

    public get errors(): ErrorMessagePanel[] {
        return this._errors;
    }

    private subscribeForErrors() {
        this.errorSubscription = this.errorCollector.errorStream.subscribe((error: ErrorMessage) => {
            this.clearErrorWarningAnimationTimeout();

            switch (this.state) {
                case null:
                    this.state = 'active';
                    break;
                case 'active':
                    this.state = 'newError';
                    break;
            }

            this._errors.unshift(new ErrorMessagePanel(error));
            if (this._errors.length > 10) {
                this._errors.pop();
            }
            this.changeDetectorRef.markForCheck();

            this.repeatErrorWarningAnimation();
        });
    }

    private unsubscribeFormErrorStream() {
        this._errors = [];
        if (this.errorSubscription) {
            this.errorSubscription.unsubscribe();
            this.errorSubscription = null;
            this.state = null;
        }
        this.changeDetectorRef.markForCheck();
    }

    //<editor-fold desc="Animation control" defaultstate="collapsed">
    public animationDone(event: AnimationEvent) {
        if (event.toState === 'newError') {
            this.state = 'active';
            this.changeDetectorRef.markForCheck();

            this.clearErrorWarningAnimationTimeout();
            this.repeatErrorWarningAnimation();
        }
    }

    private clearErrorWarningAnimationTimeout() {
        if (this.stateTransitionTimeout) {
            clearTimeout(this.stateTransitionTimeout);
            this.stateTransitionTimeout = null;
        }
    }

    private repeatErrorWarningAnimation() {
        if (this.errors.some((error: ErrorMessagePanel) => !error.read)) {
            this.stateTransitionTimeout = setTimeout(() => {
                this.state = 'newError';
                this.changeDetectorRef.markForCheck();
            }, 2000);
        }
    }

    //</editor-fold>
}