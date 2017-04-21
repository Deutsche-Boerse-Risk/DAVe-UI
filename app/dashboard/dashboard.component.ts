import {Component} from '@angular/core';

@Component({
    moduleId   : module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls  : ['dashboard.component.css']
})
export class DashboardComponent {

    public selectedIndex: number;
}