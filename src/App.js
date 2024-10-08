import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti-boom';

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 10;

const generateSecretCode = () => {
  return Array.from({ length: CODE_LENGTH }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
};

const SimpleModal = ({ children, onClick, small, darkMode }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center backdrop-blur-sm w-full p-8 min-h-full ${darkMode ? 'bg-[#00000088]' : 'bg-[#00000033]'} ${small ? 'fixed' : "absolute"}`}
      onClick={onClick}
    >
      <div className={`border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-slate-400 bg-white'} rounded-lg m-4 drop-shadow`} onClick={(e) => e.preventDefault()}>
        {children}
      </div>
    </div>
  )
}

const Peg = ({ color, onClick, onClear, showClearButton, darkMode }) => (
  <div className="relative">
    <div
      className={`w-12 h-12 rounded-full cursor-pointer ${color} border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
      onClick={onClick}
    />
    {showClearButton && (
      <button
        className="absolute top-0 rounded-full w-full h-full flex items-center justify-center bg-transparent"
        onClick={onClear}
      >
      </button>
    )}
  </div>
);

const Row = ({ guess, pegResults, isCurrentGuess, onClearPeg, darkMode }) => (
  <div className="flex items-center gap-2">
    {guess.map((color, index) => (
      <Peg
        key={index}
        color={color}
        showClearButton={isCurrentGuess && color !== ''}
        onClear={() => onClearPeg(index)}
        darkMode={darkMode}
      />
    ))}
    {isCurrentGuess ? null : (
      <div className={`grid grid-cols-2 gap-1 p-2 rounded bg-white`}>
        {pegResults.map((result, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full ${result === 'correct'
                ? 'bg-black'
                : result === 'wrongPosition'
                  ? `bg-white border border-black`
                  : 'bg-gray-300'
              }`}
          />
        ))}
      </div>
    )}
  </div>
);

const ColorPicker = ({ onSelectColor, darkMode }) => (
  <div className="flex gap-2">
    {COLORS.map((color) => (
      <Peg key={color} color={`bg-${color}-500`} onClick={() => onSelectColor(color)} darkMode={darkMode} />
    ))}
  </div>
);

const HelpModal = ({ darkMode }) => {
  return (
    <div className={`m-4 flex flex-col gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <h2>
        How to Play Mastermind
      </h2>
      <h3 className="text-lg font-bold mt-4">Objective</h3>
      <p className="">
        Guess the secret code set by the computer. The code is a sequence of 4 colored pegs.
      </p>

      <h3 className="text-lg font-bold  mt-2">Game Rules</h3>
      <ul className="list-disc pl-6 ">
        <li>You have 10 attempts to guess the secret code.</li>
        <li>
          For each guess, the computer will provide feedback on how many pegs are the correct color and in the
          correct position (black pegs), and how many are the correct color but in the wrong position (white pegs).
        </li>
        <li>
          Clear pegs by clicking on them individually or use the clear button to clear the whole current guess
        </li>
        <li>
          If you guess the secret code correctly, you win! If you run out of attempts, you lose.
        </li>
      </ul>

      <h3 className="text-lg font-bold  mt-2">Game Interface</h3>
      <p className="">
        The game interface consists of the following elements:
      </p>
      <ul className="list-disc pl-6 ">
        <li>The secret code (hidden from you)</li>
        <li>Your current guess, with clear buttons for individual pegs</li>
        <li>Feedback on your previous guesses, showing the correct and misplaced pegs</li>
        <li>Buttons to submit your guess, clear the current guess, and start a new game</li>
      </ul>

      <p>
        Good luck and have fun playing Mastermind!
      </p>
    </div>
  );
};

const MastermindGame = () => {
  const [secretCode, setSecretCode] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(Array(CODE_LENGTH).fill(''));
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setSecretCode(generateSecretCode());
  }, []);

  const handleColorSelect = (color) => {
    const nextEmptyIndex = currentGuess.findIndex((c) => c === '');
    if (nextEmptyIndex !== -1) {
      const newGuess = [...currentGuess];
      newGuess[nextEmptyIndex] = `bg-${color}-500`;
      setCurrentGuess(newGuess);
    }
  };

  const checkGuess = () => {
    if (currentGuess.includes('')) return;

    const codeFrequency = {};
    secretCode.forEach(color => {
      codeFrequency[color] = (codeFrequency[color] || 0) + 1;
    });

    const pegResults = [];
    const guessColors = currentGuess.map(color => color.replace('bg-', '').replace('-500', ''));

    // Check for correct positions first
    guessColors.forEach((color, index) => {
      if (color === secretCode[index]) {
        pegResults.push('correct');
        codeFrequency[color]--;
      }
    });

    // Check for correct colors in wrong positions
    guessColors.forEach((color, index) => {
      if (color !== secretCode[index] && codeFrequency[color] > 0) {
        pegResults.push('wrongPosition');
        codeFrequency[color]--;
      }
    });

    // Fill the rest with 'incorrect'
    while (pegResults.length < CODE_LENGTH) {
      pegResults.push('incorrect');
    }

    const newGuesses = [...guesses, { colors: currentGuess, results: pegResults }];

    setGuesses(newGuesses)
    setCurrentGuess(Array(CODE_LENGTH).fill(''));

    if (pegResults.every((result) => result === 'correct')) {
      setGameOver(true);
      setWin(true);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setSecretCode(generateSecretCode());
    setCurrentGuess(Array(CODE_LENGTH).fill(''));
    setGuesses([]);
    setGameOver(false);
    setWin(false);
  };

  const clearCurrentGuess = () => {
    setCurrentGuess(Array(CODE_LENGTH).fill(''));
  };

  const clearPeg = (index) => {
    const newGuess = [...currentGuess];
    newGuess[index] = '';
    setCurrentGuess(newGuess);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // TODO replace this hack with something better
    document.querySelector('body').style.background = darkMode ? 'white' : '#111827';
  };

  return (
    <div className={`container mx-auto flex flex-col items-center gap-4 main min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className='w-full max-w-2xl grid grid-cols-[1fr_auto_1fr] items-center'>

        <button
          className={`text-xs ${darkMode ? 'text-gray-300' : 'text-neutral-500'}`}
          onClick={toggleDarkMode}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <a href="https://en.wikipedia.org/wiki/Mastermind_(board_game)" target="_blank" rel="noreferrer">
          <h1 className="text-3xl font-bold text-center mt-2">Mastermind</h1>
        </a>
        <button
          className={`text-xs ${darkMode ? 'text-gray-300' : 'text-neutral-500'}`}
          onClick={() => setShowHelp(true)}
        >How to Play</button>
      </div>
      <div className="flex flex-col gap-2">
        {guesses.map((guess, index) => (
          <Row key={index} guess={guess.colors} pegResults={guess.results} isCurrentGuess={false} darkMode={darkMode} />
        ))}
        <div className="flex justify-around gap-2">
          <Row
            guess={currentGuess}
            pegResults={[]}
            isCurrentGuess={true}
            onClearPeg={clearPeg}
            darkMode={darkMode}
          />
          <button
            className={`text-sm px-2 rounded flex items-center justify-center border ${darkMode
                ? 'border-gray-600 bg-gray-800 text-gray-200'
                : 'border-neutral-200 bg-white text-black'
              }`}
            onClick={clearCurrentGuess}
            disabled={currentGuess.every(color => color === '')}
          >
            clear
          </button>
        </div>
      </div>
      <ColorPicker onSelectColor={handleColorSelect} darkMode={darkMode} />
      <div className='flex justify-around gap-2 mb-4'>
        <button
          className={`${darkMode ? 'bg-blue-700' : 'bg-blue-500'} text-white px-4 py-2 rounded`}
          onClick={checkGuess}
          disabled={currentGuess.includes('') || gameOver}
        >
          Submit Guess
        </button>
        <button
          className={`${darkMode ? 'bg-gray-700' : 'bg-gray-500'} text-white px-4 py-2 rounded`}
          onClick={resetGame}
        >
          New Game
        </button>
      </div>
      {showHelp && (
        <SimpleModal onClick={() => setShowHelp(false)} small={false} darkMode={darkMode}>
          <HelpModal darkMode={darkMode} />
        </SimpleModal>
      )}
      {gameOver && (
        <SimpleModal onClick={() => setGameOver(false)} small={true} darkMode={darkMode}>
          <div className={`p-4 rounded-lg flex flex-col gap-2 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <div className='text-4xl text-purple-500 text-center'>{win ? '🎉 You Won! 🎉' : 'Game Over'}</div>
            <div>
              {win
                ? `You guessed the secret code in ${guesses.length} attempt${guesses.length === 1 ? '' : 's'}!`
                : (
                  <>
                    <div>You've run out of attempts.</div>
                    <div className='mb-4'>The secret code was:</div>
                  </>
                )
              }
              {win ? null : <Row key={0} guess={secretCode.map(color => `bg-${color}-500`)} pegResults={[]} isCurrentGuess={true} darkMode={darkMode} />}
            </div>
          </div>
        </SimpleModal>
      )}
      {win && gameOver ? <Confetti className='absolute top-0' x={0.5} y={0.7} mode="boom" particleCount={100} colors={['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#A855F7', '#F97316']} shapeSize={20} launchSpeed={2} /> : null}
    </div>
  );
};

export default MastermindGame;