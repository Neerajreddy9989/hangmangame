const GameOverScreen = ({ word = "", score = { diamonds: 0, trophy: 0 }, onRestart, onHome }) => {
  return (
    <div className="game-over-screen">
      <h2 className="game-over-title">Game Over</h2>
      <div className="final-word">
        The word was: <span>{word}</span>
      </div>
      <div className="final-score">
        <span className="trophy">🏆 {score?.trophy || 0}</span>
        <span className="diamonds">💎 {score?.diamonds || 0}</span>
      </div>
      <div className="button-container">
        <button className="home-button" onClick={onHome}>
          <span className="button-icon">🏠</span>
          Home
        </button>
        <button className="restart-button" onClick={onRestart}>
          <span className="button-icon">🔄</span>
          Play Again
        </button>
      </div>
    </div>
  )
}

export default GameOverScreen

