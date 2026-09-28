/*
 * connection.js · abre o SQLite, liga as chaves estrangeiras e aplica o schema (idempotente).
 */
const fs = require('fs')
const path = require('path')
const Database = require('better-sqlite3')

/* Abre o banco; use ':memory:' nos testes. */
function openDatabase(file = process.env.DATABASE_FILE || path.join(__dirname, '..', '..', 'data', 'academia.sqlite')) {
    if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true })
    const db = new Database(file)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'))
    return db
}

module.exports = { openDatabase }
/* fim de connection.js */
