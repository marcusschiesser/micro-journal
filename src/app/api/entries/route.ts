import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

interface JournalEntry {
  id?: number
  mood: string
  entry: string
  createdAt: string
}

export async function GET() {
  const db = getDb()
  const entries = db.prepare('SELECT * FROM entries ORDER BY createdAt DESC').all()
  return NextResponse.json(entries)
}

export async function POST(request: Request) {
  const data = await request.json()
  const { mood, entry } = data
  
  const newEntry: JournalEntry = {
    mood,
    entry,
    createdAt: new Date().toISOString()
  }

  const db = getDb()
  const stmt = db.prepare(
    'INSERT INTO entries (mood, entry, createdAt) VALUES (?, ?, ?)'
  )
  
  const result = stmt.run(newEntry.mood, newEntry.entry, newEntry.createdAt)
  newEntry.id = Number(result.lastInsertRowid)

  return NextResponse.json(newEntry)
}
