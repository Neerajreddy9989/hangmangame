const Keyboard = ({ guessedLetters, onGuess }) => {
  const rows = ["QWERTYUIOP".split(""), "ASDFGHJKL".split(""), "ZXCVBNM".split("")]

  return (
    <div className="keyboard">
      {rows.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map((letter) => {
            const isGuessed = guessedLetters.has(letter)
            return (
              <button
                key={letter}
                onClick={() => onGuess(letter)}
                disabled={isGuessed}
                className={`keyboard-key ${isGuessed ? "guessed" : ""}`}
              >
                {letter}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Keyboard

