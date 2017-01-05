import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'nullvalue'})
export class NullPipe implements PipeTransform {

    public transform(value: any, replace: any): any {
        return value || replace;
    }
}