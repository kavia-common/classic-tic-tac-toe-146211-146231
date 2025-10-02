import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Ocean Professional Tic Tac Toe
 * - Modern, minimal UI
 * - Blue primary (#2563EB) and amber secondary (#F59E0B) accents
 * - Rounded corners, subtle shadows, smooth transitions, soft gradient surfaces
 */

// Helpers
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diags
];

// PUBLIC_INTERFACE
export function calculateWinner(squares) {
  /** Determine the winner in a 3x3 board.
   * Returns:
   * - { winner: 'X'|'O', line: [a,b,c] } if there is a win
   * - null otherwise
   */
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
export function isBoardFull(squares) {
  /** Checks whether all squares are filled. */
  return squares.every(Boolean);
}

function useGameState() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const result = useMemo(() => calculateWinner(squares), [squares]);
  const full = useMemo(() => isBoardFull(squares), [squares]);

  const status = useMemo(() => {
    if (result?.winner) {
      return result.winner === 'X' ? 'X wins! Great game.' : 'O wins! Well played.';
    }
    if (full) return "It's a draw. Try again!";
    return `Turn: ${xIsNext ? 'X' : 'O'}`;
  }, [result, full, xIsNext]);

  const canPlay = !result?.winner && !full;

  const handlePlay = (idx) => {
    if (!canPlay || squares[idx]) return;
    setSquares((prev) => {
      const next = prev.slice();
      next[idx] = xIsNext ? 'X' : 'O';
      return next;
    });
    setXIsNext((p) => !p);
  };

  const reset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return {
    squares,
    xIsNext,
    status,
    canPlay,
    result,
    handlePlay,
    reset,
  };
}

function Header() {
  return (
    <div className="header">
      <div className="brand">
        <div className="logo-dot" aria-hidden />
        <span className="brand-text">Ocean Tic Tac Toe</span>
      </div>
      <div className="subtext">A clean, modern take on a classic</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>
        Built with <span className="accent">React</span> • Ocean Professional theme
      </span>
    </footer>
  );
}

function Square({ value, onClick, highlight, index }) {
  const isX = value === 'X';
  const isO = value === 'O';
  const label = value ? `Square ${index + 1}, ${value}` : `Square ${index + 1}, empty`;
  return (
    <button
      type="button"
      aria-label={label}
      className={[
        'square',
        isX ? 'square-x' : '',
        isO ? 'square-o' : '',
        highlight ? 'square-win' : '',
      ].join(' ')}
      onClick={onClick}
    >
      <span className="square-value">{value}</span>
    </button>
  );
}

function Board({ squares, onPlay, winningLine }) {
  return (
    <div className="board">
      {squares.map((v, i) => (
        <Square
          key={i}
          value={v}
          index={i}
          onClick={() => onPlay(i)}
          highlight={winningLine?.includes(i)}
        />
      ))}
    </div>
  );
}

function Controls({ status, onReset, canReset }) {
  return (
    <div className="controls">
      <div className="status" role="status" aria-live="polite">
        {status}
      </div>
      <button
        type="button"
        className="btn-reset"
        onClick={onReset}
        disabled={!canReset}
        aria-disabled={!canReset}
        aria-label="Reset game"
        title="Reset game"
      >
        Reset
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Main application component for Tic Tac Toe with Ocean Professional theme. */
  const { squares, status, result, handlePlay, reset } = useGameState();
  const canReset = squares.some(Boolean);

  return (
    <div className="ocean-app">
      <div className="bg-gradient" />
      <main className="container">
        <Header />
        <section className="game-card" aria-label="Tic Tac Toe board">
          <div className="card-header">
            <h1 className="card-title">Tic Tac Toe</h1>
            <p className="card-subtitle">X vs O — take turns and align three to win.</p>
          </div>
          <Board
            squares={squares}
            onPlay={handlePlay}
            winningLine={result?.line}
          />
          <Controls status={status} onReset={reset} canReset={canReset} />
        </section>
        <Footer />
      </main>
    </div>
  );
}

export default App;
