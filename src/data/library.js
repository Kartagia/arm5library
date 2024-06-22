
/**
 * The library data model.
 * @module data/library
 */

/**
 * The book content types.
 * @typedef {"Tractatus"|"Summa"|"Laboratory Text"} BookContentType
 */

/**
 * The book types.
 * @typedef {"Tractatus"|"Summa"|"Commentary"|"Florilegum"|"Labtexts"} BookType
 */

/**
 * The book content model.
 * @property {tring} id The unique book identifier.
 * @property {string} name The name of the book.
 * @property {BookContentType} [type="Tractatus"] type The book type.
 * @property {string} [title] The title of the book content.
 * @property {string} [author] THe author of the book content.
 * Defaults to the author of the book.
 */

/**
 * The model of a book.
 * @type {Object} BookModel
 * @property {tring} id The unique book identifier.
 * @property {string} name The name of the book.
 * @property {BookType} [type="Tractatus"] type The book type.
 * @property {string} [title] The title of the book.
 * @property {string} [author] THe author of the book.
 * @property {BookContentModel[]} [contents] The book contents.
 */

/**
 * @type {Object} BookColectionModel
 * @property {string} name The name of the collection. The value is
 * unique within the library.
 * @property {(BookModel|string)[]} books THe books of the collection.
 * The string entries are references to the book identifiers of the library containing
 * the book.
 */

/**
 * The library model interface.
 * @typedef {Object} LibraryModel
 * @property {string} name The library name.
 * @property {BookModel[]} [books] The books of the library.
 * @property {BookCollectionModel[]} [collections] The books of the library.
 * @property {BookContentModel[]} [contents] The books of the library.
 */

/**
 * The class implementing a library model.
 * @extends {LibraryModel}
 */
export class Library {

    /**
     * Create a new library from a model.
     * @param {LibraryModel} model The model of the library.
     */
    constructor(model) {
        this.name = model.name;
        this.collections = model.collections ?? [];
        this.books = model.books ?? [];
        this.contents = model.contents ?? [];
    }

}

export default Library;