"use client"

import { useState, useEffect, useCallback } from "react"
import io from "socket.io-client"
import TitleScreen from "./components/TitleScreen"
import GameScreen from "./components/GameScreen"
import GameOverScreen from "./components/GameOverScreen"
import "./App.css"

const socket = io("http://localhost:3001", {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

function App() {
  const [gameState, setGameState] = useState("title")
  const [gameId, setGameId] = useState("")
  const [word, setWord] = useState("")
  const [maskedWord, setMaskedWord] = useState("")
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem("hangmanScore")
    return savedScore ? JSON.parse(savedScore) : { diamonds: 80, trophy: 30 }
  })
  const [category, setCategory] = useState("")
  const [level, setLevel] = useState(1)
  const [playerCount, setPlayerCount] = useState(1)
  const [isConnecting, setIsConnecting] = useState(true)

  const handleGameState = useCallback((state) => {
    setWord(state.word)
    setMaskedWord(state.maskedWord)
    setGuessedLetters(state.guessedLetters)
    setWrongGuesses(state.wrongGuesses)
    setCategory(state.category)
    setLevel(state.level)
    setPlayerCount(state.playerCount)

    if (state.score) {
      setScore(state.score)
    }

    setIsConnecting(false)

    if (!state.maskedWord.includes("_")) {
      setGameState("gameover")
    } else if (state.wrongGuesses >= 6) {
      setGameState("gameover")
    } else {
      setGameState("playing")
    }
  }, [])

  const joinGame = useCallback((savedGameId) => {
    setIsConnecting(true)
    setGameId(savedGameId)
    socket.emit("joinGame", savedGameId)
  }, [])

  useEffect(() => {
    const savedGameId = localStorage.getItem("hangmanGameId")
    if (savedGameId) {
      joinGame(savedGameId)
    } else {
      setIsConnecting(false)
    }

    const handleConnect = () => {
      console.log("Connected to server")
      if (gameId) {
        joinGame(gameId)
      }
    }

    const handleDisconnect = (reason) => {
      console.log("Disconnected:", reason)
      setIsConnecting(true)
    }

    const handleReconnect = (attemptNumber) => {
      console.log("Reconnected on attempt:", attemptNumber)
      if (gameId) {
        joinGame(gameId)
      }
    }

    const handleReconnectError = (error) => {
      console.log("Reconnection error:", error)
      setIsConnecting(false)
      setGameState("title")
    }

    const handlePlayerJoined = ({ playerCount }) => {
      setPlayerCount(playerCount)
    }

    const handlePlayerLeft = ({ playerCount }) => {
      setPlayerCount(playerCount)
    }

    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    socket.on("reconnect", handleReconnect)
    socket.on("reconnect_error", handleReconnectError)
    socket.on("gameState", handleGameState)
    socket.on("playerJoined", handlePlayerJoined)
    socket.on("playerLeft", handlePlayerLeft)

    return () => {
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
      socket.off("reconnect", handleReconnect)
      socket.off("reconnect_error", handleReconnectError)
      socket.off("gameState", handleGameState)
      socket.off("playerJoined", handlePlayerJoined)
      socket.off("playerLeft", handlePlayerLeft)
    }
  }, [gameId, handleGameState, joinGame])

  useEffect(() => {
    localStorage.setItem("hangmanScore", JSON.stringify(score))
  }, [score])

  const startGame = () => {
    const newGameId = Math.random().toString(36).substr(2, 9)
    setGameId(newGameId)
    localStorage.setItem("hangmanGameId", newGameId)
    joinGame(newGameId)
  }

  const handleGuess = (letter) => {
    if (gameState === "playing") {
      socket.emit("guess", { gameId, letter })
    }
  }

  const useHint = () => {
    if (score.diamonds >= 10) {
      socket.emit("hint", { gameId })
    }
  }

  const restartGame = () => {
    localStorage.removeItem("hangmanGameId")
    startGame()
  }

  if (isConnecting) {
    return <div className="connecting">Connecting to game...</div>
  }

  return (
    <div className="app">
      {gameState === "title" && <TitleScreen onStart={startGame} score={score} />}
      {gameState === "playing" && (
        <GameScreen
          word={maskedWord}
          category={category}
          level={level}
          guessedLetters={new Set(guessedLetters)}
          wrongGuesses={wrongGuesses}
          score={score}
          playerCount={playerCount}
          onGuess={handleGuess}
          onHint={useHint}
        />
      )}
      {gameState === "gameover" && (
        <GameOverScreen
          word={word}
          score={score}
          onRestart={restartGame}
          onHome={() => {
            localStorage.removeItem("hangmanGameId")
            setGameState("title")
          }}
        />
      )}
    </div>
  )
}

export default App

