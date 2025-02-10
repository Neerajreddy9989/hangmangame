import Keyboard from "./Keyboard"
import HangmanDrawing from "./HangmanDrawing"

const GameScreen = ({ word, category, level, guessedLetters, wrongGuesses, score, playerCount, onGuess, onHint }) => {
  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="score-container">
          <span className="diamonds">💎 {score?.diamonds || 0}</span>
          <span className="trophy">🏆 {score?.trophy || 0}</span>
        </div>
        <div className="game-info">
          <div className="level">Level {level}</div>
          <div className="player-count">Players: {playerCount}</div>
        </div>
      </div>

      <div className="category-box">
        <h2>{category}</h2>
      </div>

      <div className="word-display">{word}</div>

      <div className="hangman-container">
        <HangmanDrawing wrongGuesses={wrongGuesses} />
      </div>

      <Keyboard guessedLetters={guessedLetters} onGuess={onGuess} />

      <button className="hint-button" onClick={onHint} disabled={!score || score.diamonds < 10}>
        <span className="hint-icon">💡</span>
        <span className="hint-cost">💎10</span>
      </button>
    </div>
  )
}

export default GameScreen

