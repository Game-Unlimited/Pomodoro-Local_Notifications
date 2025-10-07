import React, { useEffect } from 'react'
import { usePomodoroStore } from '../store/usePomodoroStore'

function msToClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function Timer(): React.JSX.Element {
  const {
    timer,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer
  } = usePomodoroStore()

  // Ensure remaining time is initialized when app loads
  useEffect(() => {
    if (!timer.currentSession && timer.remainingTime === 0) {
      // initialize from settings via reset
      resetTimer()
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-6xl font-bold tabular-nums">
        {msToClock(timer.remainingTime)}
      </div>
      <div className="text-sm text-gray-500">
        Session: {timer.sessionType} · Completed: {timer.completedSessions}
      </div>
      <div className="flex gap-2">
        {!timer.isRunning && !timer.isPaused && (
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={startTimer}>Start</button>
        )}
        {timer.isRunning && (
          <button className="px-4 py-2 bg-yellow-600 text-white rounded" onClick={pauseTimer}>Pause</button>
        )}
        {timer.isPaused && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={resumeTimer}>Resume</button>
        )}
        <button className="px-4 py-2 bg-gray-700 text-white rounded" onClick={resetTimer}>Reset</button>
      </div>
    </div>
  )
}

export default Timer



