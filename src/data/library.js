
/**
 * The library data model.
 * @module data/library
 */

/**
 * The book content types.
 * @typedef {"Tractatus"|"Summa"|"Commentary"|"Laboratory Text"} BookContentType
 */

/**
 * The book types.
 * @typedef {"Tractatus"|"Summa"|"Commentary"|"Florilegum"|"Labtexts"} BookType
 */

/**
 * The common properties of the book content model.
 * @typedef {Object} CommonBookContentModelProps
 * @property {number} [book_id] The unique book identifier of the
 * book the content model belongs to.
 * @property {number} [collection_id] The unique collection identifier of the
 * collection the content model belongs to.
 * @property {number} [library_id] The unique library identifier of the
 * lubrary the content model belongs to.
 * @property {number} [id] The unique book content identifier. Only content stored
 * into persisting storage has identifier.
 * @property {string} name The name of the book.
 * @property {BookContentType} [type="Tractatus"] type The book type.
 * @property {string} [title] The title of the book content. Defaults to the
 * name.
 * @property {string} [author] THe author of the book content.
 * Defaults to the author of the book.
 */

/**
 * The properties specific to the laboratory text content.
 * @typedef {Object} ItemLabtextContentProps 
 * @property {string|LabtextItemRef} item The item of the lab text.
 * @property {string} activation The way of activation.
 * @property {string|LabtextSpellRef} effect The effect
 * referende. 
 */


/**
 * A reference to a spell.
 * @typedef {Object} LabtextSpellRef
 * @property {RefId} [refId] The referred persisting storage reference identifier
 * of the referred spell.
 * @property {string} name The name of the reference.
 * @property {string} [title] The title of the reference. Defaults to the name.
 * 
 */

/**
 * The properties specific to the laboratory text content.
 * @typedef {Object} SpellLabtextContentProps
 * @property {string|LabtextSpellRef} spell The invented spell name or reference. 
 */

/**
 * The properties specific to the laboratory text content.
 * @typedef {SpellLabtextContentProps|ItemLabtextContentProps} LabtextContentProps
 */

/**
 * The model of a item enchantment laboratory text content.
 * @typedef {CommonBookContentModelProps & ItemLabtextContentProps} EnchantmentLabtextContentModel
 */


/**
 * The model of a spell laboratory text content.
 * @typedef {CommonBookContentModelProps & SpellLabtextContentProps} SpellLabtextContentModel
 */

/**
 * The model of the laboratory texts.
 * @typedef {EnchantmentLabtextContentModel|SpellLabtextContentModel} LabtextContentModel
 */

/**
 * The properties specific to the summa content.
 * @typedef {Object} SummaContentProps
 * @property {number} [quality] The quality of the book content.
 * @property {string} targetType The type of the target.
 * @property {string} target The target of the tractatus.
 * @property {number} [capLevel] The cap level of the book content.
 */

/**
 * The content model of the summas.
 * @typedef {CommonBookContentModelProps & SummaContentProps} SummaBookContentModel
 */

/**
 * The tractatus content specific properties.
 * @typedef {Object} TractatusContentProps
 * @property {string} targetType The type of the target.
 * @property {string} target The target of the tractatus.
 * @property {number} quality The quality of the tractatus.
 */

/**
 * The properties sepcific to the commentary contents.
 * @typedef {Object} CommentaryContentProps
 * @property {number} [source_id] The summa content identifier
 * of the source summa requried to study this commentary.
 * @property {string} sourceName The name of the source summa
 * content the commantyry comments.
 */

/**
 * The book content model for Tractatus.
 * @typedef {CommonBookContentModelProps & TractatusContentProps} TractatusBookContentModel
 */

/**
 * The book content model for commentary.
 * @typedef {TractatusContentProps & CommentaryContentProps} CommentaryBookContentModel
 */


/**
 * The book content model.
 * @typedef {TractatusBookContentModel|CommentaryBookContentModel|SummaBookContentModel|LabtextContentModel} BookContentModel
 */

/**
 * The model of a book.
 * @typedef {Object} BookModel
 * @property {number} [collection_id] The unique collection identifier of the
 * collection the book model belongs to.
 * @property {number} [library_id] The unique library identifier of the
 * lubrary the book model belongs to.
 * @property {number} [id] The unique book identifier. ONly books
 * stored in a persisting storage has identifier.
 * @property {string} name The name of the book.
 * @property {BookType} [type="Tractatus"] type The book type.
 * @property {string} [title] The title of the book.
 * @property {string} [author] THe author of the book.
 * @property {BookContentModel[]} [contents] The book contents.
 */

/**
 * The model representing a collection of books.
 * @type {Object} BookColectionModel
 * @property {number} [library_id] The unique library identifier of the library
 * the library model belongs to.
 * @property {number} [id] The unique collection identifier. Only
 * collections stored in a persisting storage has identifier.
 * @property {string} name The name of the collection. The value is
 * unique within the library of the collection.
 * @property {(BookModel|string)[]} [books=[]] The books of the collection.
 * The string entries are references to the book identifiers of the library containing
 * the book.
 * @property {(BookContentModel|string)[]} [contents=[]] The book contents of
 * the collection.
 */

/**
 * The library model interface.
 * @typedef {Object} LibraryModel
 * @property {number} [saga_id] The unique saga identifier of the sage
 * the library model belongs to.
 * @property {number} [id] The unique library identifier. Only libraries
 * stored in a persisting storage has identifier.
 * @property {string} name The library name. The name is 
 * unique withing saga of the library.
 * @property {BookModel[]} [books=[]] The books of the library.
 * @property {BookCollectionModel[]} [collections=[]] The books of the library.
 * @property {BookContentModel[]} [contents=[]] The books of the library.
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