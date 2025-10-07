import React from 'react'
import { usePomodoroStore } from '../store/usePomodoroStore'

export function Settings(): React.JSX.Element {
  const { settings, updateSettings } = usePomodoroStore()

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">Settings</h2>
      <label className="flex items-center gap-2">
        <span>Work (min)</span>
        <input
          className="border rounded px-2 py-1 w-20"
          type="number"
          min={1}
          value={settings.workDuration}
          onChange={(e) => updateSettings({ workDuration: Number(e.target.value) })}
        />
      </label>
      <label className="flex items-center gap-2">
        <span>Break (min)</span>
        <input
          className="border rounded px-2 py-1 w-20"
          type="number"
          min={1}
          value={settings.breakDuration}
          onChange={(e) => updateSettings({ breakDuration: Number(e.target.value) })}
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.autoStart}
          onChange={(e) => updateSettings({ autoStart: e.target.checked })}
        />
        <span>Auto-start next session</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.hapticsEnabled}
          onChange={(e) => updateSettings({ hapticsEnabled: e.target.checked })}
        />
        <span>Haptics</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.soundEnabled}
          onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
        />
        <span>Sound</span>
      </label>
    </div>
  )
}

export default Settings



