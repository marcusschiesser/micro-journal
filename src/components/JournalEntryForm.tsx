'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSWRConfig } from 'swr'
import PromptSelector from './PromptSelector'

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😴', label: 'Tired' },
]

export default function JournalEntryForm() {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [selectedMood, setSelectedMood] = useState('')
  const [entry, setEntry] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: selectedMood,
          entry,
          prompt: selectedPrompt,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save entry')
      }

      // Mutate the entries cache
      await mutate('/api/entries')
      router.push('/')
    } catch (error) {
      console.error('Error saving entry:', error)
      // TODO: Show error message to user
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">How are you feeling?</h2>
        <div className="flex gap-4 mb-6">
          {moods.map(({ emoji, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => setSelectedMood(label)}
              className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                selectedMood === label
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-sm mt-1">{label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Choose a prompt:</h3>
            <PromptSelector onPromptSelect={setSelectedPrompt} />
          </div>
          <div>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={selectedPrompt || "Write your thoughts here..."}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        disabled={!selectedMood || !entry || !selectedPrompt}
      >
        Save Entry
      </button>
    </form>
  )
}
