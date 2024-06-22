
/**
 * The dummy memory based implementation of the library.
 * @module data/library/dummy
 */

import {isLibraryModel} from "@/data/library";

/** @type {import("./library").LibraryModel[]} */ 
const libraries = [];

/**
 * @typedef {Object} LibraryStoreProps
 * @property {import("./library").LibraryModel[]} [libraries] The initial libraries.
 */

/**
 * Check ghe validity of the libraries model list.
 * @param {*} libraries The checked value.
 * @returns {import("./library").LibraryModel[]} The valid libary model list generated from the libraries.
 * @throws {SyntaxError} The libraries was invalid.
 */
function checkLibraries(libraries) {
    if (Array.isArray(libraries)) {
        if (libraries.every( library => (isLibraryModel(library)))) {
            return /** @type {import("./library").LibraryModel[]} */ libraries;
        } else {
            throw new SyntaxError("Not all entries were library models");
        }
    } else {
        throw SyntaxError("Only array of library models is accepted");
    }
}

/**
 * A library DAO providing library data.
 * @param {LibraryStoreProps} props 
 * @returns {Dao<string, import("./library").LibraryModel>}
 */
export function LibraryStore(props) {
    if (props.libraries) {
        libraries = checkLibraries(props.libraries);
    }

    return {
        one: (/** @type {string} */ id) => (libraries.find( current => (current.name === id))),
        all: () => ([...libraries]),
        update(/** @type {string} */ id,/** @type {import("@/data/library").LibraryModel} */ library) {
            const replaced = this.one(id);
            if (replaced) {
                if (Object.is(replaced, library)) {
                    // The values are equals, no need to change.
                    return false;
                }
                libraries = libraries.filter( current => (
                    (current.name === id ? library : current)
                ));
                return true;
            } else {
                throw new RangeError("Cannot update non-existing library");
            }
        },
        create(/** @type {import("@/data/library").LibraryModel} */ library) {
            /** @type {string} */ 
            const id = library.name;
            if (this.one(id)) {
                throw new TypeError("Library name already used");
            }
            libraries = libraries.concat(library);
            return id;
        },
        delete(/** @type {string} */ id) {
            const oldLength = libraries.length;
            libraries = libraries.filter( current => (current.name !== id));
            return oldLength !== libraries.length;
        }
    };
}

export default LibraryStore;