'use client'

import { useState, useEffect } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

interface PromptSelectorProps {
  onPromptSelect: (prompt: string) => void
}

export default function PromptSelector({ onPromptSelect }: PromptSelectorProps) {
  const [prompt, setPrompt] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrompt = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/prompts')
      if (!response.ok) throw new Error('Failed to fetch prompt')
      const data = await response.json()
      if (!data.prompt || typeof data.prompt !== 'string') {
        throw new Error('Invalid prompt data received')
      }
      setPrompt(data.prompt)
      onPromptSelect(data.prompt)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching prompt:', error)
      setError(error instanceof Error ? error.message : 'Failed to load prompt')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrompt()
  }, [])

  if (error) {
    return (
      <div className="space-y-2">
        <div className="text-red-500 p-3">{error}</div>
        <button
          onClick={fetchPrompt}
          className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className={`p-4 rounded-lg border ${isLoading ? 'bg-gray-50' : 'bg-white'}`}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <ArrowPathIcon className="h-5 w-5 animate-spin text-gray-500" />
            <span className="text-gray-500">Loading prompt...</span>
          </div>
        ) : (
          <p className="text-gray-800">{prompt}</p>
        )}
      </div>
      {!isLoading && (
        <button
          onClick={fetchPrompt}
          className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Get another prompt
        </button>
      )}
    </div>
  )
}
