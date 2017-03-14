import {DecimalPipe} from '@angular/common';
import {Pipe, PipeTransform} from '@angular/core';

declare let testLanguage: string;

export const NUMBER_PIPE = new DecimalPipe(testLanguage || navigator.language.split('-')[0]);

@Pipe({
    name: 'percent'
})
export class PercentPipe implements PipeTransform {

    transform(value: any, digits?: string): any {
        let transformedNumber = NUMBER_PIPE.transform(value, digits);
        if (transformedNumber) {
            return transformedNumber + '%';
        }
    }
}