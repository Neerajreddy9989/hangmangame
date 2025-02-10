# Hangman Game Documentation

## Overview
This document provides a comprehensive overview of the multiplayer Hangman game implementation. The game is built using React for the frontend and Node.js with Express and Socket.IO for the backend, enabling real-time multiplayer functionality.

## Table of Contents
1. [Game Architecture](#game-architecture)
2. [Frontend Components](#frontend-components)
3. [Backend Structure](#backend-structure)
4. [Game Logic](#game-logic)
5. [Multiplayer Functionality](#multiplayer-functionality)
6. [Persistence and State Management](#persistence-and-state-management)
7. [User Interface and Styling](#user-interface-and-styling)

## Game Architecture
- Client-server architecture
- React frontend
- Node.js backend with Express and Socket.IO
- Real-time communication for synchronized game states

## Frontend Components
1. **App.js**
   - Main component
   - Manages overall game state
   - Handles routing between different screens

2. **TitleScreen**
   - Displays game title
   - Shows play button
   - Presents player's score

3. **GameScreen**
   - Main gameplay component
   - Displays word to guess
   - Shows hangman drawing
   - Includes keyboard for letter input

4. **GameOverScreen**
   - Appears at end of game
   - Shows final word and score
   - Provides options to restart or return to title

5. **Keyboard**
   - Reusable component for letter input
   - Disables guessed letters

6. **HangmanDrawing**
   - Visualizes hangman based on wrong guesses
   - Uses SVG for crisp graphics

## Backend Structure
- **server.js**
  - Sets up Express server
  - Configures Socket.IO for real-time communication
  - Manages game sessions
  - Processes player actions
  - Broadcasts updates to connected clients

## Game Logic
1. **Word Selection**
   - Words categorized (e.g., Verbs, Animals, Fruits, Countries)
   - Random selection for each game

2. **Guess Processing**
   - Server-side validation of guesses
   - Updates game state based on correct/incorrect guesses

3. **Score Calculation**
   - Players earn diamonds and trophies for successful games
   - Score updates in real-time

4. **Hint System**
   - Players can use diamonds to reveal a letter
   - Deducts diamonds from player's score

## Multiplayer Functionality
- Multiple players can join the same game session
- Real-time updates sent to all players on each guess
- Player count tracked and updated in real-time

## Persistence and State Management
1. **Game Session Persistence**
   - Game IDs stored in browser's localStorage
   - Allows players to rejoin ongoing games

2. **Score Persistence**
   - Player scores stored in localStorage and on server
   - Ensures long-term score tracking across sessions

3. **Server-side Session Management**
   - Game sessions kept alive for a period after player disconnection
   - Enables smooth reconnection to ongoing games

## User Interface and Styling
1. **Theme**
   - Notebook/grid paper style implemented
   - Consistent design across all components

2. **Responsiveness**
   - UI adapts to various screen sizes
   - Ensures good user experience on both desktop and mobile

3. **Custom Graphics**
   - SVG used for hangman drawing
   - Ensures crisp graphics at all sizes

4. **Accessibility**
   - Color contrast ensured for readability
   - Keyboard navigation supported

## Conclusion
This Hangman game implementation provides a robust, multiplayer experience with real-time updates, persistent state management, and an engaging user interface. The modular architecture allows for easy maintenance and future enhancements.

