import {UIDUtils} from './uid.utils';

describe('UID generation with', () => {

    it('UID is correct', () => expect(UIDUtils.computeUID('testValue', 'testValue2'))
        .toBe('testValue-testValue2'));

    it('UID for missing parts is null', () => expect(UIDUtils.computeUID()).toBe(null));

    it('UID for null values contains empty strings', () => expect(
        UIDUtils.computeUID('testValue', null, 'testValue2', null))
        .toBe('testValue--testValue2-'));

    it('UID for undefined values contains empty strings', () => expect(
        UIDUtils.computeUID('testValue', undefined, 'testValue2', undefined))
        .toBe('testValue--testValue2-'));

    it('random UID do not equal', () => {
        for (let i = 0; i < 100; i++) {
            expect(UIDUtils.generateUID()).not.toBe(UIDUtils.generateUID());
        }
    });
});
