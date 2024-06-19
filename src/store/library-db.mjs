import Database from 'better-sqlite3';
const dbName = "arm5library.db"

/**
 * Convert first code point of the string to upper case.
 * @param {string} str The converted string.
 * @returns {string} The str with first code point in upper case.
 */
function ucFirst(/** @type {string} */ str) {
    return (
        str.substring(0, 1).toUpperCase().concat(str.substring(1))
    )
};

/**
 * Get the relation table name. 
 * @param {string[]} tables The joined table names.
 * @returns {string} The table name.
 */
function getRelationTableName(tables) {
    return tables.map((table, index) => (index ? ucFirst(table) : table)).join("");
}


/**
 * Get the current database.
 * @returns {import('better-sqlite3').Database|undefined} The current database.
 */
export function getDatabase() {
    try {
        return new Database(dbName, { fileMustExist: true });
    } catch (err) {
        // Database does not exist.
        return undefined;
    }
}

/**
 * The current database.
 * @type {import('better-sqlite3').Database|undefined}
 */
let db = getDatabase();

/**
 * Create SQL statement for creating a table.
 * @param {string} tableName The name of the created table.
 * @param {(string)[]} [fieldDefs] The field definitions of the created table.
 * @param {(string)[]} [constraints] The constraints of the created table.
 * @returns {import('better-sqlite3').Statement} The SQL statement.
 * @throws {Error} The database does not exist.
 */
function createTableStatement(tableName, fieldDefs = [], constraints = []) {
    if (db === undefined) {
        throw new Error("No database connection available");
    }
    const stmt = `CREATE TABLE IF NOT EXISTS ${tableName}(` +
        [...fieldDefs,
        ...constraints
        ].join(", ") + ")";
    return db.prepare(stmt);
}

/**
 * Get the primary key of the relationship table from referred table
 * name.
 * @param {string} tableName The table name. 
 * @returns {string} The name of the relation table primary key for
 * given table.
 */
function getRelationPrimaryKeyFieldName(tableName) {
    return `${tableName}_id`;
}

/**
 * Get the names of the primary key field names.
 * @param {string[]} tableNames The names of the tables in the relation. 
 * @returns {string[]} The array of the table names.
 */
function getRelationPrimaryKeyFieldNames(tableNames) {
    return tableNames.map(getRelationPrimaryKeyFieldName);
}

/**
 * Get the relation table default field defintions for the create statement. 
 * @param {string[]} tableNames The names of the tables in the relation. 
 * @param {ForeignKeyAction} [updateAction="Cascade"] The action on foreign key changes.
 * @param {ForeignKeyAction} [deleteAction="Cascade"] The action on foregin key changes.
 * @returns {string[]} The array of table defintion strings for the relation
 * fields.
 */
function createRelationFieldDefs(tableNames, updateAction = "Cascade", deleteAction = "Cascade") {
    return tableNames.map(
        tableName => (
            `${getRelationPrimaryKeyFieldName(tableName)
            } number not null references ${tableName}(id) on update ${updateAction
            } on delete ${deleteAction
            }`
        )
    );
}
function getRelationPrimaryKeyFields(tableNames) {
    return getRelationPrimaryKeyFieldNames(tableNames).join(",");
}

/**
 * Get the primary key constraint of the relation table.
 * @param {string[]} tableNames The joined tables.
 * @returns {string} The primary key constraint.
 */
function createRelationPrimaryKey(tableNames) {
    return [
        `primary key(${getRelationPrimaryKeyFields(tableNames)})`
    ];
}

/**
 * The actions possible for a foreign key action.
 * @typedef {"Cascade"|"Set Null"|"Set Default"|"Restrict"|"No Action"} ForeignKeyAction
 */

/**
 * Create a foreign key constraint for relationship tables.
 * @param {string[]} tableNames 
 * @param {string} [relationTableName] The relationship table name.
 * Defaults to the table names in camel case.  
 * @param {ForeignKeyAction} [updatePolicy] The update policy. Defaults to "Cascade".
 * @param {ForeignKeyAction} [deletePolicy] The delete policy. Defaults to "Cascade".
 * @returns 
 */
function createRelationForeignKeyConstraints(tableNames, relationTableName = undefined,
    updatePolicy = "Cascade", deletePolicy = "Cascade"
) {
    const relationTable = relationTableName ?? tableNames.map((tableName, index) => (index ? ucFirst(tableName) : tableName)).join("");
    return [
        `foreign key(${getRelationPrimaryKeyFields(tableNames)
        }) references ${relationTable}(${getRelationPrimaryKeyFields(tableNames)
        }) on update ${updatePolicy} on delete ${deletePolicy}`
    ];

}

/**
 * The content insert fields.
 * @type {[string[], Record<string. (string|symbol|number)]}
 */
let contentInsertFieldNames = [];

/**
 * The content fields.
 * @type {[string[], Record<string. (string|symbol|number)]}
 */
let contentFieldNames = [];

/**
 * Set cotnent field names.
 * @param {string[]} fieldNames The field names of the content. 
 * @param {Record<string, string|symbol|number>} propertyNames The properties of database field names
 * of the content.
 */
function setContentFieldNames(fieldNames, propertyNames) {
    contentInsertFieldNames = [fieldNames.filter(fieldName => (fieldName !== "id")),
    Object.fromEntries(Object.entries(propertyNames).filter(
        ([fieldName]) => (fieldName !== "id")
    ))
    ];
    contentFieldNames = [fieldNames, propertyNames];
}


/**
 * The book insert fields.
 * @type {[string[], Record<string. (string|symbol|number)]}
 */
let bookInsertFieldNames = [];

/**
 * The book fields.
 * @type {[string[], Record<string. (string|symbol|number)]}
 */
let bookFieldNames = [];

/**
 * Set cotnent field names.
 * @param {string[]} fieldNames The field names of the content. 
 * @param {Record<string, string|symbol|number>} propertyNames The properties of database field names
 * of the content.
 */
function setBookFieldNames(fieldNames, propertyNames) {
    bookInsertFieldNames = [fieldNames.filter(fieldName => (fieldName !== "id")),
    Object.fromEntries(Object.entries(propertyNames).filter(
        ([fieldName]) => (fieldName !== "id")
    ))
    ];
    bookFieldNames = [fieldNames, propertyNames];
}

/**
 * The collection insert fields.
 * @type {[string[], Record<string. (string|symbol|number)]}
 */
let collectionInsertFieldNames = [];

/**
 * The collection fields.
 * @type {[string[], Record<string. (string|symbol|number)]}
 */
let collectionFieldNames = [];

/**
 * Set cotnent field names.
 * @param {string[]} fieldNames The field names of the collection. 
 * @param {Record<string, string|symbol|number>} propertyNames The properties of database field names
 * of the collection.
 */
function setCollectionFieldNames(fieldNames, propertyNames) {
    collectionInsertFieldNames = [fieldNames.filter(fieldName => (fieldName !== "id")),
    Object.fromEntries(Object.entries(propertyNames).filter(
        ([fieldName]) => (fieldName !== "id")
    ))
    ];
    collectionFieldNames = [fieldNames, propertyNames];
}

/**
 * The library insert fields.
 * @type {[string[], Record<string. (string|symbol|number)]}
 */
let libraryInsertFieldNames = [];

/**
 * The library fields.
 * @type {[string[], Record<string. (string|symbol|number)]}
 */
let libraryFieldNames = [];

/**
 * Set cotnent field names.
 * @param {string[]} fieldNames The field names of the library. 
 * @param {Record<string, string|symbol|number>} propertyNames The properties of database field names
 * of the library.
 */
function setLibraryFieldNames(fieldNames, propertyNames) {
    libraryInsertFieldNames = [fieldNames.filter(fieldName => (fieldName !== "id")),
    Object.fromEntries(Object.entries(propertyNames).filter(
        ([fieldName]) => (fieldName !== "id")
    ))
    ];
    libraryFieldNames = [fieldNames, propertyNames];
}

/**
 * Removes the database.
 */
export async function deleteDb() {
    if (db) {
        ["content", "book", "collection", "library"].forEach(
            tableName => db.prepare(`DROP TABLE IF EXISTS ${tableName}`).run()
        )
    }
}


/**
 * Initialize a database.
 * @param {import('@/data/library').LibraryModel} [model] THe model
 * of the created database library.
 */
export async function initDb(model = undefined) {
    if (db !== undefined) {
        // Delete existing database.
        deleteDb();
    } else {
        // Create new database.
        db = new Database(dbName, {});
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = on');
    }

    setContentFieldNames(["id", "name"], { "id": "id", "name": "name" });
    createTableStatement("content", [
        "id integer primary key autoincrement",
        "name varchar(255)"
    ]).run();
    setBookFieldNames(["id", "name"], { "id": "id", "name": "name" });
    createTableStatement("book", [
        "id integer primary key autoincrement",
        "name varchar(255) not null"
    ]).run();
    setCollectionFieldNames(["id", "name"], { "id": "id", "name": "name" });
    createTableStatement("collection", [
        "id integer primary key autoincrement",
        "name varchar(255) not null"
    ]).run();
    setLibraryFieldNames(["id", "name"], { "id": "id", "name": "name" });
    createTableStatement("library", [
        "id integer primary key autoincrement",
        "name varchar(255) not null unique"
    ]).run();

    // Creating relationship tables. 
    [
        ["library", "content"],
        ["library", "book"],
        ["library", "book", "content"],
        ["library", "collection"],
        ["library", "collection", "content"],
        ["library", "collection", "book"],
        ["library", "collection", "book", "content"],
    ].forEach(joinedTables => {
        const tableName = getRelationTableName(joinedTables);
        createTableStatement(tableName,
            createRelationFieldDefs(joinedTables),
            [createRelationPrimaryKey(joinedTables),
            ...(joinedTables.length > 2 ?
                createRelationForeignKeyConstraints(
                    joinedTables.slice(0, joinedTables.length - 1)) : [])
            ]
        )
    });

    if (model) {
        initValues(model);
    }
}

/**
 * Insert a content into a book.
 * The content is also added the library contents.
 * @param {number} libraryId The content identifier of the target library.
 * @param {number} bookId The book identifier of the book the target book. 
 * @param {import('@/data/library').BookContent} content The added content.
 * @returns {number|undefined} The content identifier of the added content.
 */
function insertBookContent(libraryId, bookId, content) {
    const contentId = insertLibraryContent(libraryId, content);
    if (contentId === undefined) {
        return undefined;
    }

    // Adding content to the book contents.
    const tables = ["library", "book", "content"];
    const stmt = `INSERT INTO ${getRelationTableName(tables)}(${getRelationPrimaryKeyFieldNames(tables)}) VALUES (${tables.map(() => ("?")).join(",")})`;
    const result = db.prepare(stmt).bind(libraryId, bookId, contentId);
    if (result.changes) {
        return contentId;
    } else {
        return undefined;
    }
}

/**
 * Insert a content into a book in a collection.
 * The content is also added the library contents.
 * @param {number} libraryId The content identifier of the target library.
 * @param {number} bookId The book identifier of the book the target book. 
 * @param {import('@/data/library').BookContent} content The added content.
 * @returns {number|undefined} The content identifier of the added content.
 */
function insertCollectionBookContent(libraryId, collectionId, bookId, content) {
    const contentId = insertCollectionContent(libraryId, collectionId, content);
    if (contentId === undefined) {
        return undefined;
    }

    // Adding content to the book contents.
    const tables = ["library", "collection", "book", "content"];
    const stmt = `INSERT INTO ${getRelationTableName(tables)}(${getRelationPrimaryKeyFieldNames(tables)}) VALUES (${tables.map(() => ("?")).join(",")})`;
    const result = db.prepare(stmt).bind(libraryId, collectionId, bookId, contentId);
    if (result.changes) {
        return contentId;
    } else {
        return undefined;
    }

}

/**
 * Add content into collection of a library. 
 * The content is also added the library contents.
 * @param {number} libraryId The library identifier of the library containing
 * the content.
 * @param {number} collectionId THe collection identifier of the collection
 * owning the content, and allowing building new books from it. 
 * @param {import("@/data/library").BookContent} content The added book content.
 * @returns 
 */
function insertCollectionContent(libraryId, collectionId, content) {
    const contentId = insertLibraryContent(libraryId, content);
    if (contentId === undefined) {
        return undefined;
    }

    // Adding content to the book contents.
    const tables = ["library", "collection"];
    const stmt = `INSERT INTO ${getRelationTableName(tables)}(${getRelationPrimaryKeyFieldNames(tables)}) VALUES (${tables.map(() => ("?")).join(",")})`;
    const result = db.prepare(stmt).bind(libraryId, collectionId, contentId);
    if (result.changes) {
        return contentId;
    } else {
        return undefined;
    }

}

/**
 * Get the content model database field names, and the content
 * properties of database field names.
 * @param {BookContent} content The cotnent model object, whose fields 
 * are queried.
 * @returns {[string[], Record<string, string|symbol|number>]} The tuple
 * containing the database field names of the content table, and the
 * reverse mapping from database field name to content property.
 */
function getInsertContentDbFields(content) {
    return ["name", { name: "name" }];
}

/**
 * Insert a content into the contents table.
 * 
 * @param {import("@/data/library").BookContent} content The added content. 
 * @returns {number} The content identifier attached to the added content.
 */
function insertContent(content) {
    const [contentFieldNames, contentFieldProps] = getInsertContentDbFields(content);
    const stmt = db.prepare(`insert into content(${contentFieldNames.join(",")}) values (${contentFieldNames.map(() => ("?")).join(",")
        })`);
    const result = stmt.run(...(contentFieldNames.map(fieldName => (content[contentFieldProps[fieldName]]))));
    if (result.changes) {
        return result.lastInsertRowid;
    } else {
        return undefined;
    }
}

/**
 * Create relationship inserting statement.
 * @param {string[]} tableNames The relation member tables.
 * @param {string} [relationTable] The relation table name.
 * @return {import('better-sqlite3').Statement} The prepared statement
 * for insenrting relationships.
 */
function createInsertRelationStatement(tableNames, relationTable = undefined) {
    const relationName = relationTable ?? getRelationTableName(tableNames);
    const relationKeys = getRelationPrimaryKeyFieldNames(tableNames);
    return db.prepare(`insert into ${relationName}(${relationKeys.join(",")}) values (${relationKeys.map(() => "?").join(",")})`);
}

/**
 * Insert a content into a book.
 * @param {number} libraryId The content identifier of the target library.
 * @param {import('@/data/library').BookContent} content The added content.
 * @returns {number|undefined} The content identifier of the added content.
 */
function insertLibraryContent(libraryId, content) {
    const contentId = insertContent(content);
    if (contentId !== undefined) {
        const stmt = createInsertRelationStatement(["library", "content"]);
        const result = stmt.run(libraryId, contentId);
        if (result.changes) {
            return contentId;
        } else {
            if (db.inTransaction) {
                /** @todo Rollback the change as inserting the content failed. */
            }
            return undefined;
        }
    }
}

/**
 * Insert a book content. The book content is always added to the
 * library, but it may also be added to the collection, a book of library, or 
 * a book of collection depending on optional keys <code>collectionId</code>
 * and <code>bookIde</code>
 * 
 * The combinations:
 * - a defined collectionId and bookId means the content is added to the book of 
 * the collection with given libraryId, collecitonId, and bookId.
 * - a defined collectionId with an undefined bookId is added to the cotents of
 * the collection with collectionId and libraryId.
 * - an undefined collectionId with a defined bookId is added to the contents
 * of the book of the library with libraryId and bookId.
 * - an undefined collection and bookId means the content is only added
 * to the library.
 *  
 * @param {import("@/data/library").BookContent} bookContent 
 * @param {object} param1 The options.
 * @param {number} param1.libraryId The library identifier of the library
 * into which the book is added.
 * @param {number} [param1.collectionId] The collection identifier of the
 * collection into whcih teh book is added.
 * @param {number} [param1.bookId] The book identifier of the book the 
 * collection belongs.
 */
function addBookContent(bookContent, { libraryId, collectionId = undefined, bookId = undefined }) {
    if (bookId === undefined && collectionId === undefined) {
        return insertLibraryContent(libraryId, bookContent);
    } else if (collectionId === undefined) {
        return insertBookContent(libraryId, bookId, bookContent);
    } else if (bookId === undefined) {
        return insertCollectionContent(libraryId, collectionId, bookContent);
    } else {
        return insertCollectionBookContent(libraryId, collectionId, bookId, bookContent);
    }
}


/**
 * Insert a book into a collection.
 * @param {number} libraryId The library identifier.
 * @param {number} collectionId The collection identifier.
 * @param {import("@/data/library").bookModel} bookModel The inserted book.
 * @returns {number} The book identifier of the inserted book.
 */
function insertCollectionBook(libraryId, collectionId, bookModel) {
    throw new Error("Inserting collection books is not supported");
}


/**
 * Insert a book into a library.
 * @param {number} libraryId The library identifier.
 * @param {import("@/data/library").bookModel} bookModel The inserted book.
 * @returns {number} The book identifier of the inserted book.
 */
function insertLibraryBook(libraryId, bookModel) {
    throw new Error("Inserting library books is not supported");
}

/**
 * Add a book to the library.
 * @param {import("@/data/library").bookModel} bookModel The added book.
 */
function insertBook(bookModel, libraryId = undefined, collectionId = undefined) {
    if (collectionId !== undefined) {
        // The book belongs to a collection.
        const stmt = db.prepare("SELECT book_id FROM CollectionBooks WHERE collection_id=? AND bookName=?");
        const result = stmt.get(collectionId, bookModel.name);
        if (bookId === undefined) {
            // THe book does not exist.
            const bookId = insertCollectionBook(libraryId, collectionId, bookModel);
            return bookId;
        } else {
            // The book already exists.
            return undefined;
        }
    } else {
        // The book does not belong to a collection.
        const stmt = db.prepare("SELECT book_id FROM LibfraryBooks WHERE collection_id=@id");
        stmt.run(collectionId);

        insertLibraryBook(newBookId);
    }
}

function insertCollection(collectionModel) {
    throw Error("Collections not yet supported");
}

function initValues(model) {
    db.transaction(() => {
        (model.contents ?? []).forEach(
            content => {

            }
        );
        (model.books ?? []).forEach(
            book => {

            }
        );
        (model.collections ?? []).forEach(
            collection => {

            }
        );
    });
}

export function LibraryDao() {

    return {
        all() {
            return new Promise((resolve, reject) => {
                let result = db.prepare("SELECT * FROM library").all();
                Promise.all([
                    new Promise(
                        (resolve, reject) => {
                            const tableName = getRelationTableName(["library","content"])
                            const libraryContents = db.prepare("SELECT library_id, content.* FROM content JOIN libraryContent ON content_id = id").all();
                            libraryContents.forEach(libraryContent => {
                                result.find(library => (library.id === libraryContent.library_id))?.contents.push(libraryContent);
                            });
                            resolve();
                        }),
                    new Promise(
                        (resolve, reject) => {
                            const libraryBooks = db.prepare("SELECT library_id, book.* FROM book JOIN libraryBooks ON book_id = id").all();
                            libraryBooks.forEach(libraryBook => {
                                result.find(library => (library.id === libraryBook.library_id))?.books.push(libraryBook);
                            });
                            resolve();
                        }),
                    new Promise(
                        (resolve, reject) => {
                            const libraryCollections = db.prepare("SELECT library_id, collection.* FROM book JOIN libraryCollection ON colllection_id = id").all();
                            libraryCollections.forEach(libraryCollection => {
                                result.find(library => (library.id === libraryCollection.library_id))?.collections.push(libraryCollection);
                            });
                            resolve();
                        }),
                ]).then(
                    (results) => {
                        resolve(result);
                    },
                    (error) => {
                        reject(error);
                    }
                )
                resolve(result);
            });
        },
        one(/** @type {string} */ id) {
            return new Promise((resolve, reject) => {

            });

        },
        update(/** @type {string} */ id, /** @type {import("@/data/library").LibraryModel} */ library
        ) {
            return new Promise((resolve, reject) => {

            });

        },
        create(/** @type {import("@/data/library").LibraryModel} */ library) {
            return new Promise((resolve, reject) => {

            });

        },
        delete(/** @type {string} */ id) {
            return new Promise((resolve, reject) => {

            });
        }
    };
}