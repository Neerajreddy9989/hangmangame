const HangmanDrawing = ({ wrongGuesses }) => {
    return (
      <svg className="hangman-drawing" viewBox="0 0 200 200">
        {/* Base */}
        <line x1="40" y1="180" x2="160" y2="180" />
        {/* Vertical pole */}
        <line x1="100" y1="180" x2="100" y2="20" />
        {/* Top */}
        <line x1="100" y1="20" x2="140" y2="20" />
        {/* Rope */}
        <line x1="140" y1="20" x2="140" y2="40" />

        {wrongGuesses > 0 && (
          // Head
          <circle cx="140" cy="50" r="10" />
        )}
        {wrongGuesses > 1 && (
          // Body
          <line x1="140" y1="60" x2="140" y2="100" />
        )}
        {wrongGuesses > 2 && (
          // Left arm
          <line x1="140" y1="80" x2="120" y2="90" />
        )}
        {wrongGuesses > 3 && (
          // Right arm
          <line x1="140" y1="80" x2="160" y2="90" />
        )}
        {wrongGuesses > 4 && (
          // Left leg
          <line x1="140" y1="100" x2="120" y2="130" />
        )}
        {wrongGuesses > 5 && (
          // Right leg
          <line x1="140" y1="100" x2="160" y2="130" />
        )}
      </svg>
    )
  }

  export default HangmanDrawing

