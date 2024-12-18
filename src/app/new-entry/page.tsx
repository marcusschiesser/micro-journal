import JournalEntryForm from '@/components/JournalEntryForm'

export default function NewEntry() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Journal Entry</h1>
      <div className="max-w-2xl mx-auto">
        <JournalEntryForm />
      </div>
    </div>
  )
}
