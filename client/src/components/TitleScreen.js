const TitleScreen = ({ onStart, score = { diamonds: 0, trophy: 0 } }) => {
  return (
    <div className="title-screen">
      <div className="title">
        <h1>HANGMAN</h1>
        <svg className="noose" width="100" height="100" viewBox="0 0 100 100">
          <path d="M50,20 L50,40 Q50,50 40,50" stroke="#1E90FF" strokeWidth="3" fill="none" />
        </svg>
      </div>
      <button className="play-button" onClick={onStart}>
        <div className="play-circle">
          <div className="play-triangle"></div>
        </div>
      </button>
      <div className="score-display">
        <span className="trophy-icon">🏆</span>
        <span className="score-value">{score?.trophy || 0}</span>
      </div>
    </div>
  )
}

export default TitleScreen

