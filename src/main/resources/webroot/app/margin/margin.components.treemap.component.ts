import {Component} from '@angular/core';
import {ChartData, TreeMapOptions} from '../common/chart.types';
@Component({
    moduleId: module.id,
    selector: 'margin-components-treemap',
    templateUrl: 'margin.components.treemap.component.html',
    styleUrls: ['../common.component.css']
})
export class MarginComponentsTreemapComponent {

    public initialLoad: boolean = true;

    public errorMessage: string;

    public chartOptions: TreeMapOptions = {
        explorer: {
            actions: ['dragToZoom', 'rightClickToReset']
        },
        legend: {
            position: 'right'
        },
        hAxis: {
            title: 'Series-Maturity',
            ticks: [],
            slantedText: true
        },
        vAxis: {
            title: 'Underlying',
            ticks: []
        },
        chartArea: {
            height: '50%'
        },
        backgroundColor: {
            fill: 'transparent'
        },

        titlePosition: 'none',
        titleTextStyle: {
            display: 'none'
        },
        title: 'no'
    };

    public chartData: ChartData;
}