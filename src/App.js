import { useState } from "react";

function Square({ value, onSquareClick }) {
  let svg;
  if (value === "X") {
    svg = <XSvg />;
  } else if (value === "O") {
    svg = <OSvg />;
  } else {
    svg = null;
  }

  return (
    <button className="square" onClick={onSquareClick}>
      {svg}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else if (!squares.some((item) => item === null)) {
    status = "Game is over, No winner";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const rows = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      row.push(
        <Square
          key={index}
          value={squares[ index ]}
          onSquareClick={() => handleClick( index )}
        />
      );
    }

    rows.push(<div key={i} className="board-row" >{row}</div>);
  }

  return (
    <>
      <h2 className="status">{status}</h2>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpToMove(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;

    if (move > 0) {
      if (move === currentMove) {
        description = "you are at move #" + move;
      } else {
        description = "Go to move #" + move;
      }
    } else {
      if (move === currentMove) {
        description = "you are at game";
      } else {
        description = "Go to game start";
      }
    }

    const content =
      move === currentMove ? (
        <span>{description}</span>
      ) : (
        <button onClick={() => jumpToMove(move)}>{description}</button>
      );

    return <li key={move}>{content}</li>;
  });

  return (
    <div className="game">
      <div className="game-board">
        <h1 className="game-title">
          <span className="h-word1">Tic</span>
          <span className="h-word2"> Tac</span>
          <span className="h-word3"> Toe</span>
        </h1>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="gmae-info">
        <ul>{moves}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winLines.length; i++) {
    const [a, b, c] = winLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

// XSvg component
function XSvg() {
  return (
    <svg
      width="70"
      height="71"
      viewBox="0 0 70 71"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.20819 4.91786L65.7918 66.5014M4.20819 66.5014L65.7918 4.91786"
        stroke="#545454"
        strokeWidth="11.1193"
      />
    </svg>
  );
}

// OSvg component
function OSvg() {
  return (
    <svg
      width="78"
      height="78"
      viewBox="0 0 78 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="39.0645"
        cy="39.0909"
        r="34.2522"
        stroke="white"
        strokeWidth="9.23754"
      />
    </svg>
  );
}
