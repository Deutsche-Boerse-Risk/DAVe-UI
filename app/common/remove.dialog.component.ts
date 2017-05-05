import {Component} from '@angular/core';

import {MdDialogRef} from '@angular/material';

@Component({
    moduleId   : module.id,
    templateUrl: './remove.dialog.component.html',
    styleUrls  : [
        '../component.css',
        'remove.dialog.component.css'
    ]
})
export class RemoveDialogComponent {

    public message: string;
    public note: string;

    constructor(public dialogRef: MdDialogRef<RemoveDialogComponent>) {
    }
}