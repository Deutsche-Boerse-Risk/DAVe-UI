import {Component} from '@angular/core';

@Component({
    moduleId: module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls: ['../common.component.css']
})
export class DashboardComponent {

    private _activeTab: string = 'overview';

    //noinspection JSUnusedGlobalSymbols
    public get activeTab(): string {
        return this._activeTab;
    }

    //noinspection JSUnusedGlobalSymbols
    public setActiveTab(tab: string): void {
        this._activeTab = tab;
    }
}