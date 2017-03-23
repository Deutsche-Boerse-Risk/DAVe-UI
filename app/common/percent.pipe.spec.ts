import {PercentPipe} from './percent.pipe';
import {TestBed, inject} from '@angular/core/testing';
import {DecimalPipe} from '@angular/common';

describe('Percent pipe with', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DecimalPipe,
                PercentPipe
            ]
        });
    });

    it('no digit information', inject([PercentPipe], (pipe: PercentPipe) => {
        expect(pipe.transform(22)).toEqual('22%');
        expect(pipe.transform(22.2)).toEqual('22.2%');
        expect(pipe.transform(22.20)).toEqual('22.2%');
        expect(pipe.transform(22.254)).toEqual('22.254%');
    }));

    it('zero to 2 decimal places', inject([PercentPipe], (pipe: PercentPipe) => {
        expect(pipe.transform(22, '.0-2')).toEqual('22%');
        expect(pipe.transform(22.2, '.0-2')).toEqual('22.2%');
        expect(pipe.transform(22.20, '.0-2')).toEqual('22.2%');
        expect(pipe.transform(22.254, '.0-2')).toEqual('22.25%');
    }));

    it('2 to 2 decimal places', inject([PercentPipe], (pipe: PercentPipe) => {
        expect(pipe.transform(22, '.2-2')).toEqual('22.00%');
        expect(pipe.transform(22.2, '.2-2')).toEqual('22.20%');
        expect(pipe.transform(22.20, '.2-2')).toEqual('22.20%');
        expect(pipe.transform(22.254, '.2-2')).toEqual('22.25%');
    }));

    it('2 or more decimal places', inject([PercentPipe], (pipe: PercentPipe) => {
        expect(pipe.transform(22, '.2')).toEqual('22.00%');
        expect(pipe.transform(22.2, '.2')).toEqual('22.20%');
        expect(pipe.transform(22.20, '.2')).toEqual('22.20%');
        expect(pipe.transform(22.254, '.2')).toEqual('22.254%');
    }));

    it('value undefined', inject([PercentPipe], (pipe: PercentPipe) => {
        expect(pipe.transform(undefined)).toEqual(undefined);
    }));

    it('value null', inject([PercentPipe], (pipe: PercentPipe) => {
        expect(pipe.transform(null)).toEqual(undefined);
    }));
});
