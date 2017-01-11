import {Pipe, PipeTransform} from '@angular/core';

import {NUMBER_PIPE} from './common.module';

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