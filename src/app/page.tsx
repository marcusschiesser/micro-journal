'use client'

import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import useSWR from 'swr'

interface JournalEntry {
  id: number
  mood: 'Happy' | 'Calm' | 'Sad' | 'Frustrated' | 'Tired'
  entry: string
  createdAt: string
}

const moodEmojis = {
  'Happy': '😊',
  'Calm': '😌',
  'Sad': '😔',
  'Frustrated': '😤',
  'Tired': '😴'
} as const

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Home() {
  const { data: entries = [], mutate } = useSWR('/api/entries', fetcher, {
    refreshInterval: 1000, // Poll every second
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Micro Journal</h1>
        <p className="text-lg text-gray-600">Record your daily thoughts and reflections</p>
      </header>

      <div className="max-w-2xl mx-auto">
        <Link
          href="/new-entry"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PencilSquareIcon className="w-5 h-5" />
          <span>Write Today's Entry</span>
        </Link>

        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Recent Entries</h2>
          {entries.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500 text-center">Your journal entries will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry: JournalEntry) => (
                <div key={entry.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {moodEmojis[entry.mood] || '🤔'}
                      </span>
                      <span className="text-gray-600">{entry.mood}</span>
                    </div>
                    <time className="text-sm text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">{entry.entry}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
