import React from 'react'
import { usePomodoroStore } from '../store/usePomodoroStore'

export function History(): React.JSX.Element {
  const { history, clearHistory, exportHistory } = usePomodoroStore()

  const handleExport = () => {
    const jsonData = exportHistory()
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pomodoro-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / (1000 * 60))
    return `${minutes} min`
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Session History</h2>
        <div className="flex gap-2">
          <button 
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            onClick={handleExport}
            disabled={history.length === 0}
          >
            Export JSON
          </button>
          <button 
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
            onClick={clearHistory}
            disabled={history.length === 0}
          >
            Clear
          </button>
        </div>
      </div>
      
      {history.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No sessions completed yet</p>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {history.map((session) => (
              <div 
                key={session.id}
                className="p-3 border rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">
                      {session.type === 'work' ? '🍅 Work Session' : '☕ Break Session'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(session.startTime)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatDuration(session.duration)}</div>
                    <div className="text-sm text-gray-600">
                      {session.completed ? '✅ Completed' : '⏸️ Incomplete'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default History
