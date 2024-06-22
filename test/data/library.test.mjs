
import { Library } from "../../src/data/library.js";
import { expect, AssertionError } from "chai";

/**
 * Test suite implementation for Mocha/Chai Unit test for SummaContentModel.
 */
function testSummaContentModel() {
    this.skip();
}

/**
 * Test suite implementation for Mocha/Chai Unit test for TractatusContentModel.
 */
function testTractatusContentModel() {
    this.skip();
}

/**
 * Test suite implementation for Mocha/Chai Unit test for CommentaryContentModel.
 */
function testCommentaryContentModel() {
    this.skip();
}

/**
 * Test suite implementation for Mocha/Chai Unit test for LabTextModel.
 */
function testLaboratoryTextContentModel() {
    this.skip();
}

/**
 * 
 */
function testBookContentModel() {

    describe("interface SummaContentModel", testSummaContentModel);
    describe("interface TractatusContentModel", testTractatusContentModel);
    describe("interface CommentaryContentModel", testCommentaryContentModel);
    describe("interface LabTextContentModel", testLaboratoryTextContentModel);
}

describe("interface BookContentModel", testBookContentModel);

/**
 * The definition of a property. 
 * - First argument is the property.
 * - Second argumetn is the property type.
 * - Thrid argument is optional test function.
 * @typedef {[string|number|symbol, string, function?]} PropertyDefinition
 */

/**
 * Test object model.
 * @param {*} tested The tested value.
 * @param {PropertyDefinition[]} [requiredPropDefs] 
 * @param {PropertyDefinition[]} [optionalPropDefs] 
 */
function testObject(tested, requiredPropDefs=[], optionalPropDefs=[]) {
    expect(model).a("object");
    requiredPropDefs.forEach(([prop, propType, propTest = (() => true)]) => {
        const propName = String(prop);
        expect(model).have(prop, `Missing required property ${propName}`);
        expect(model[prop],`Invalid property ${propName} type`).a(propType);
        expect(propTest(model[prop]), `Invalid property ${propName}`).true;
    });
    optionalPropDefs.forEach(([prop, propType, propTest = (() => true)]) => {
        const propName = String(prop);
        if (prop in model) {
            expect(model[prop], `Invalid property ${propName} type`).a(propType);
            expect(propTest(model[prop]), `Invalid property ${propName}`).true;
        }
    });

}

/**
 * Test library model validity.
 * @param {import("@/data/library").LibraryModel} model The tested model.
 * @param {number} [index] Test index. 
 * @throws {AssertionError} The test failed. 
 */
function testLibraryModel(model, index = undefined) {
    const requiredProperties = [];
    const optionalProperties = [];
    testObject(model, requiredProperties, optionalProperties);
}


/**
 * The valid library models used for testing libary models.
 */
const validLibraryModels = [];

/**
 * Invalid library models. 
 */
const invalidLibraryModels = [];

function testLibraryModels() {
    validLibraryModels.forEach((libraryModel, testIndex) => {
        it("Valid library model", function() {
            let result = undefined;
            expect( () => {result = new Library(libraryModel)}).not.throw;
            testLibraryModel(result);
        })
    })
    invalidLibraryModels.forEach( (libraryModel, testIndex) => {
        it("Invalid library model", function() {
            expect( () => {result = new Library(libraryModel)}).throw;
        })
    })
}

describe("interface LibraryModel", testLibraryModels);

describe("class Library", function () {

    describe("Construction", function () {
        validLibraryModels.forEach((libraryModel, testIndex) => {
            it("Is valid library model", function () {
                testLibraryModel(libraryModel, testIndex);
            })
        })
        invalidLibraryModels.forEach( (libraryModel, testIndex) => {
            it("Is invalid library model", function() {
                expect( () => {testLibraryModel(libraryModel, testIndex)}).throw(AssertionError);
            })
        })
    });
})