import {By} from '@angular/platform-browser';

import {DebugElement} from '@angular/core';
import {MdCard} from '@angular/material';

export class MessageComponentDef {

    constructor(public debugElement: DebugElement) {
        if (debugElement == null) {
            return null;
        }
    }

    public get text(): string {
        return this.debugElement.query(By.directive(MdCard)).nativeElement.textContent.replace(/\n\s*/g, ' ')
            .replace(/\r\s*/g, ' ').trim();
    }
}
