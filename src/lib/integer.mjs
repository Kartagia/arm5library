
/**
 * @module lib/integer
 * The class createing data type of integer.
 */

const INT = Symbol("Safe Integer");

/**
 * The integer type. 
 * @typedef {number & {readonly [INT]: true}} integer
 */

/**
 * Is a value an integer.
 * @param {*} value Tested value.
 * @returns {boolean} True, if and only if the value is a safe integer.
 */
export function isInteger(value) {
    return typeof value === "number" && Number.isSafeInteger(value);
}

/**
 * TEst whether a value is an integer.
 * @param {*} value The checked value.
 * @returns {integer} THe given value as integer.
 * @throws {TypeError} The value was not an integer.
 */
export function checkInteger(value) {
    const result = Number(value);
    if (isInteger(result)) {
        return /** @type {integer} */ result;
    } else {
        throw new TypeError("Not a safe integer");
    }
}

/**
 * Create an integer.
 * @param {*} value The checked value.
 * @returns {integer} THe given value as integer.
 * @throws {TypeError} The value was not an integer.
 */
export function Integer(value) {
    return checkInteger(value);
}

export default { checkInteger, isInteger, Integer }