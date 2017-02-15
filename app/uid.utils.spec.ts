import {UIDUtils} from "./uid.utils";

describe('UID generation test', () => {

    it('UID based on "_id" only is correct', () => expect(UIDUtils.computeUID({
        _id: {
            testKey1: 'testValue',
            testKey2: 'testValue2'
        }
    })).toBe('testValue-testValue2'));

    it('UID based on both "_id" and "id" is correct', () => expect(UIDUtils.computeUID({
        _id: {
            testKey1: 'testValue',
            testKey2: 'testValue2'
        },
        id: {
            $oid: 'uniqueString'
        }
    })).toBe('testValue-testValue2'));

    it('UID based on "id" only is correct', () => expect(UIDUtils.computeUID({
        id: {
            $oid: 'uniqueString'
        }
    })).toBe('uniqueString'));

    it('UID for missing both "_id" and "id" is null', () => expect(UIDUtils.computeUID({})).toBe(null));

    it('UID for missing "$oid" in "id" is null', () => expect(UIDUtils.computeUID({
        id: {}
    })).toBe(null));

    it('UID for empty "_id"  and non-empty "id" is "$oid"', () => expect(UIDUtils.computeUID({
        _id: {},
        id: {
            $oid: 'uniqueString'
        }
    })).toBe('uniqueString'));

    it('UID for null values in "_id" contains empty strings', () => expect(UIDUtils.computeUID({
        _id: {
            testKey1: 'testValue',
            testKey2: null,
            testKey3: 'testValue2',
            testKey4: null
        }
    })).toBe('testValue--testValue2-'));

    it('UID for undefined values in "_id" contains empty strings', () => expect(UIDUtils.computeUID({
        _id: {
            testKey1: 'testValue',
            testKey2: undefined,
            testKey3: 'testValue2',
            testKey4: undefined
        }
    })).toBe('testValue--testValue2-'));
});
