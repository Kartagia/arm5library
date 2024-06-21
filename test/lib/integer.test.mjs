
import { expect } from 'chai';
import { checkInteger } from '../../src/lib/integers.mjs'

describe("checkInteger", function () {
    describe("Valid integers", function () {
        ["0", 0, 1, "1", 2**8, 2**16,, -(2**8), -(2**16),
            Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER
        ].forEach((tested, caseIndex) => {
            it(`Test Case #${caseIndex}: ${String(tested)}`, function () {
                expect(checkInteger(tested)).false;
            })
        });
    });
    describe("Invalid integers", function () {
        [null, undefined, "", [], {}, 0.5, Number.POSITIVE_INFINITY,
        Number.NaN, Number.NEGATIVE_INFINITY,
        Number.MAX_SAFE_INTEGER*2
        ].forEach((tested, caseIndex) => {
            it(`Test Case #${caseIndex}: ${String(tested)}`, function () {
                expect(checkInteger(tested)).false;
            })
        });
    });
})