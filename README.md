# 🏓 Table Tennis Game

A React Native table tennis game built with Expo. Play against the computer and master your ping pong skills!

## 🎮 Features

- **Single Player Mode** - Play against AI opponent
- **Touch Controls** - Swipe to move your paddle
- **Realistic Physics** - Ball bounces and paddle collisions
- **Score Tracking** - First to 11 points wins
- **Responsive Gameplay** - Smooth 60 FPS gameplay

## 📱 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for testing on device)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

1. Install the **Expo Go** app from App Store (iOS) or Google Play (Android)
2. Scan the QR code displayed in the terminal
3. The game will load in Expo Go

### Running on Simulator

```bash
# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android
```

## 🎯 How to Play

1. Tap "Start Match" to begin
2. Swipe or drag to move your paddle
3. Hit the ball back to your opponent
4. First player to 11 points wins!

## 📁 Project Structure

```
table-tennis-game/
├── src/
│   ├── components/
│   │   ├── Ball.tsx         # Ball component
│   │   ├── Paddle.tsx       # Paddle component
│   │   ├── GameBoard.tsx    # Game board
│   │   └── Scoreboard.tsx   # Score display
│   ├── screens/
│   │   ├── StartScreen.tsx  # Main menu
│   │   └── MatchScreen.tsx  # Game screen
│   └── navigation/
│       └── index.tsx        # Navigation setup
├── App.tsx                  # App entry point
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

## 🛠️ Technologies Used

- **Expo** - React Native framework
- **TypeScript** - Type safety
- **React Native** - Mobile app framework
- **React Navigation** - Screen navigation

## 🎨 Game Rules

- First player to score 11 points wins
- Ball must bounce once on each side
- Serve alternates every 2 points
- Win by 2 points if score reaches 10-10

## 📝 License

MIT
