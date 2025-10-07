# 🍅 Pomodoro Timer App

A complete Pomodoro timer application built with React Native Web, Vite, and Capacitor. Features local notifications, haptic feedback, audio alerts, session history, and persistent settings.

## ✨ Features

- **Timer Management**: Start, pause, resume, and reset Pomodoro sessions
- **Customizable Durations**: Adjust work (25min), break (5min), and long break (15min) durations
- **Local Notifications**: Get notified when sessions complete (even when app is backgrounded)
- **Haptic Feedback**: Vibration feedback on mobile devices
- **Audio Alerts**: Sound notifications when sessions end
- **Session History**: Track completed sessions with export to JSON
- **Persistent Settings**: All settings and history saved locally
- **Cross-Platform**: Works on web, Android, and iOS via Capacitor

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd Pomodoro-Local_Notifications
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` (or the port shown in terminal)

3. **Build for production:**
   ```bash
   npm run build
   ```

### Mobile Development (Capacitor)

1. **Add mobile platforms:**
   ```bash
   npx cap add android
   npx cap add ios
   ```

2. **Build and sync:**
   ```bash
   npm run build
   npx cap sync
   ```

3. **Run on device:**
   ```bash
   npx cap run android
   npx cap run ios
   ```

## 📱 Permissions

### Android
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

### iOS
Add to `ios/App/App/Info.plist`:
```xml
<key>NSUserNotificationsUsageDescription</key>
<string>This app needs notification permission to alert you when Pomodoro sessions complete.</string>
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + NativeWind
- **State Management**: Zustand with persistence
- **Mobile**: Capacitor for native features
- **Storage**: Capacitor Preferences (SQLite on mobile)
- **Notifications**: Capacitor Local Notifications
- **Audio**: Web Audio API + Capacitor Native Audio

### Project Structure
```
src/
├── components/          # React components
│   ├── Timer.tsx       # Main timer display and controls
│   ├── Settings.tsx    # Settings panel
│   └── History.tsx     # Session history with export
├── services/           # Platform services
│   ├── storage.ts      # Persistent storage abstraction
│   ├── notifications.ts # Local notifications
│   ├── haptics.ts      # Haptic feedback
│   ├── audio.ts        # Audio playback
│   └── soundManager.ts # Sound management
├── store/              # State management
│   └── usePomodoroStore.ts # Zustand store
├── types/              # TypeScript definitions
├── hooks/              # Custom React hooks
└── App.tsx            # Main app component
```

## 🔧 Configuration

### Timer Settings
- **Work Duration**: 25 minutes (default)
- **Break Duration**: 5 minutes (default)  
- **Long Break**: 15 minutes (default)
- **Auto-start**: Automatically start next session
- **Haptics**: Enable/disable vibration
- **Sound**: Enable/disable audio alerts

### Sound Files
Place alarm sounds in `public/sounds/`:
- `alarm.mp3` - Default alarm sound
- `manifest.json` - Sound configuration

## 🧪 Testing

```bash
# Type checking
npm run typecheck

# Linting (when configured)
npm run lint

# Build verification
npm run build
```

## 📦 Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Type checking
npm run typecheck
```

## 🔄 Data Management

### Session History
- All completed sessions are stored locally
- Export to JSON format for backup/analysis
- Clear history option available
- No data sent to external servers

### Settings Persistence
- Settings automatically saved on change
- Restored on app restart
- Stored using Capacitor Preferences

## 🐛 Troubleshooting

### Common Issues

1. **Notifications not working:**
   - Check browser/device notification permissions
   - Ensure app is not in "Do Not Disturb" mode

2. **Audio not playing:**
   - Check browser autoplay policies
   - Verify sound files exist in `public/sounds/`

3. **Timer not persisting:**
   - Check Capacitor Preferences plugin installation
   - Verify storage permissions

### Development Issues

1. **TypeScript errors:**
   ```bash
   npm run typecheck
   ```

2. **Build failures:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review Capacitor documentation
- Open an issue on GitHub