# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native project called "percli-react" - a cross-platform mobile application supporting both iOS and Android. The project uses TypeScript and follows standard React Native conventions with the latest React Native 0.81.1.

## Development Commands

### Environment Setup
- **Install dependencies**: `npm install`
- **iOS CocoaPods**: `bundle install` (first time) then `bundle exec pod install` (when native dependencies change)

### Development
- **Start Metro bundler**: `npm start`
- **Run on Android**: `npm run android`
- **Run on iOS**: `npm run ios`
- **Run tests**: `npm test`
- **Lint code**: `npm run lint`

### Requirements
- Node.js >= 20 (specified in package.json engines)
- React Native development environment setup (Android SDK, Xcode)

## Project Structure

### Root Level Architecture
- **App.tsx**: Main application component using SafeAreaProvider and NewAppScreen template
- **index.js**: React Native entry point that registers the App component
- **__tests__/**: Test directory with App.test.tsx for basic rendering tests

### Platform Directories
- **android/**: Native Android code and Gradle build configuration
- **ios/**: Native iOS code, Xcode project, and CocoaPods Podfile

### Key Dependencies
- **React Native**: 0.81.1 with TypeScript support
- **Safe Area Context**: For handling device safe areas (notches, status bars)
- **Testing**: Jest with React Test Renderer for component testing

## Code Style and Configuration

### TypeScript
- Extends `@react-native/typescript-config`
- Includes all .ts and .tsx files
- Excludes node_modules and iOS Pods

### ESLint
- Uses `@react-native` configuration
- Root configuration in .eslintrc.js

### Prettier
- Single quotes, avoid arrow parens, trailing commas
- Configuration in .prettierrc.js

### Build Tools
- **Metro**: Default React Native bundler configuration
- **Babel**: Uses `@react-native/babel-preset`
- **Jest**: Uses `react-native` preset for testing

## Platform-Specific Notes

### iOS Development
- Requires CocoaPods for native dependency management
- Run `bundle exec pod install` when adding/updating native dependencies
- Minimum iOS version defined in Podfile

### Android Development
- Uses Gradle build system
- Kotlin support enabled
- React Native Android configuration in android/app/build.gradle

## Testing Strategy
- Jest with React Test Renderer for component testing
- Basic smoke test ensures App component renders without crashing
- Run tests with `npm test`