const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

const games = new Map()
const playerSessions = new Map()

const categories = {
  Verbs: ["JUMP", "PLAY", "SING", "DANCE", "RUN", "SWIM", "WRITE", "READ", "COOK", "SLEEP"],
  Animals: ["LION", "ELEPHANT", "GIRAFFE", "ZEBRA", "MONKEY", "TIGER", "PENGUIN", "KANGAROO", "DOLPHIN", "KOALA"],
  Fruits: ["APPLE", "BANANA", "ORANGE", "GRAPE", "MANGO", "PINEAPPLE", "STRAWBERRY", "WATERMELON", "KIWI", "PEACH"],
  Countries: ["FRANCE", "JAPAN", "BRAZIL", "AUSTRALIA", "CANADA", "INDIA", "EGYPT", "MEXICO", "ITALY", "RUSSIA"],
}

function getRandomWord(category) {
  const words = categories[category] || Object.values(categories).flat()
  return words[Math.floor(Math.random() * words.length)]
}

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id)

  socket.on("joinGame", (gameId) => {
    console.log(`Player ${socket.id} joining game ${gameId}`)

    playerSessions.set(socket.id, gameId)

    let game = games.get(gameId)
    if (!game) {
      const category = Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)]
      const word = getRandomWord(category)
      game = {
        id: gameId,
        word,
        category,
        guessedLetters: new Set(),
        players: new Map(),
        level: 1,
        startTime: Date.now(),
      }
      games.set(gameId, game)
    }

    game.players.set(socket.id, {
      diamonds: 80,
      trophy: 30,
    })

    socket.join(gameId)

    io.to(gameId).emit("gameState", getGameState(game, socket.id))

    socket.to(gameId).emit("playerJoined", {
      playerId: socket.id,
      playerCount: game.players.size,
    })
  })

  socket.on("guess", ({ gameId, letter }) => {
    const game = games.get(gameId)
    if (game && game.players.has(socket.id)) {
      game.guessedLetters.add(letter)

      const state = getGameState(game, socket.id)

      if (!state.maskedWord.includes("_")) {
        game.players.forEach((score, playerId) => {
          score.diamonds += 10
          score.trophy += 30
        })
      }

      io.to(gameId).emit("gameState", state)
    }
  })

  socket.on("hint", ({ gameId }) => {
    const game = games.get(gameId)
    if (game && game.players.has(socket.id)) {
      const playerScore = game.players.get(socket.id)
      if (playerScore.diamonds >= 10) {
        const unguessedLetters = [...game.word].filter((letter) => !game.guessedLetters.has(letter))

        if (unguessedLetters.length > 0) {
          const hintLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)]
          game.guessedLetters.add(hintLetter)
          playerScore.diamonds -= 10

          io.to(gameId).emit("gameState", getGameState(game, socket.id))
        }
      }
    }
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id)

    const gameId = playerSessions.get(socket.id)
    if (gameId) {
      const game = games.get(gameId)
      if (game) {
        game.players.delete(socket.id)

        if (game.players.size === 0) {
          setTimeout(() => {
            if (game.players.size === 0) {
              games.delete(gameId)
            }
          }, 3600000)
        } else {
          io.to(gameId).emit("playerLeft", {
            playerId: socket.id,
            playerCount: game.players.size,
          })
        }
      }
      playerSessions.delete(socket.id)
    }
  })
})

function getGameState(game, playerId) {
  return {
    word: game.word,
    category: game.category,
    maskedWord: game.word
      .split("")
      .map((letter) => (game.guessedLetters.has(letter) ? letter : "_"))
      .join(""),
    guessedLetters: Array.from(game.guessedLetters),
    wrongGuesses: Array.from(game.guessedLetters).filter((letter) => !game.word.includes(letter)).length,
    score: game.players.get(playerId),
    level: game.level,
    playerCount: game.players.size,
  }
}

const PORT = process.env.PORT || 3001
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

