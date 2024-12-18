import Database from 'better-sqlite3'
import path from 'path'

let db: Database.Database

export function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'journal.db')
    db = new Database(dbPath)
    
    // Create table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mood TEXT NOT NULL,
        entry TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `)
  }
  return db
}
