import {Component} from '@angular/core';

@Component({
    moduleId: module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent {

    private _activeTab: string = 'overview';

    public get activeTab(): string {
        return this._activeTab;
    }

    public setActiveTab(tab: string): void {
        this._activeTab = tab;
    }
}