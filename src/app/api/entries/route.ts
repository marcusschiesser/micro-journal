import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'entries.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir)
  }
}

// Initialize entries file if it doesn't exist
async function initEntriesFile() {
  try {
    await fs.access(dataFile)
  } catch {
    await fs.writeFile(dataFile, JSON.stringify([]))
  }
}

export async function GET() {
  await ensureDataDir()
  await initEntriesFile()
  
  const data = await fs.readFile(dataFile, 'utf-8')
  const entries = JSON.parse(data)
  return NextResponse.json(entries)
}

export async function POST(request: Request) {
  await ensureDataDir()
  await initEntriesFile()

  const data = await request.json()
  const { mood, entry } = data
  
  const newEntry = {
    id: Date.now(),
    mood,
    entry,
    createdAt: new Date().toISOString(),
  }

  const fileData = await fs.readFile(dataFile, 'utf-8')
  const entries = JSON.parse(fileData)
  entries.unshift(newEntry) // Add new entry at the beginning
  
  await fs.writeFile(dataFile, JSON.stringify(entries, null, 2))
  
  return NextResponse.json(newEntry)
}
