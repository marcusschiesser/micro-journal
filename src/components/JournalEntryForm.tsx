'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [showMotivation, setShowMotivation] = useState(false)
  const [motivationalMessage, setMotivationalMessage] = useState('')
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const [isLoadingMessage, setIsLoadingMessage] = useState(false)

  useEffect(() => {
    const generateMotivation = async (text: string) => {
      try {
        setIsLoadingMessage(true)
        const response = await fetch('/api/motivation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate motivation')
        }

        const data = await response.json()
        setMotivationalMessage(data.message)
        setShowMotivation(true)
        
        // Hide the message after 8 seconds
        setTimeout(() => {
          setShowMotivation(false)
        }, 8000)
      } catch (error) {
        console.error('Error getting motivation:', error)
        setShowMotivation(false)
      } finally {
        setIsLoadingMessage(false)
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    if (entry && entry.length > 10) {
      typingTimeoutRef.current = setTimeout(() => {
        generateMotivation(entry)
      }, 3000) // Generate message after 3 seconds of inactivity
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [entry])

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
            {showMotivation && (
              <div className="mt-2 text-blue-600 text-sm italic animate-fade-in flex items-center">
                {isLoadingMessage ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Thinking of something witty...
                  </span>
                ) : (
                  motivationalMessage
                )}
              </div>
            )}
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
