import {DecimalPipe} from '@angular/common';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'percent'
})
export class PercentPipe implements PipeTransform {

    constructor(private number: DecimalPipe) {
    }

    transform(value: any, digits?: string): any {
        let transformedNumber = this.number.transform(value, digits);
        if (transformedNumber) {
            return transformedNumber + '%';
        }
    }
}