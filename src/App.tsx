import React from 'react'
import Timer from './components/Timer'
import Settings from './components/Settings'
import History from './components/History'
import { useAppInitialization } from './hooks/useAppInitialization'

export function App(): React.JSX.Element {
  useAppInitialization()
  
  return (
    <div className="min-h-screen flex flex-col items-center p-6 gap-8">
      <header className="w-full max-w-3xl flex items-center justify-between">
        <h1 className="text-2xl font-bold">🍅 Pomodoro</h1>
      </header>
      <main className="w-full max-w-6xl grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="p-6 border rounded-lg">
          <Timer />
        </section>
        <section className="p-6 border rounded-lg">
          <Settings />
        </section>
        <section className="p-6 border rounded-lg md:col-span-2 lg:col-span-1">
          <History />
        </section>
      </main>
    </div>
  )
}

export default App


