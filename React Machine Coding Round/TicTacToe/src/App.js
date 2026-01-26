import { useState } from "react";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const determineWinner = (board) => {
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [x, y, z] = WINNING_COMBINATIONS[i];
    if (board[x] != null && board[x] === board[y] && board[y] === board[z]) {
      return board[x];
    }
  }
  return null;
};

const Cell = ({ index, disabled, mark, turn, onClick }) => {
  return (
    <button
      aria-label={mark == null ? `Mark cell ${index} as ${turn}` : undefined}
      className="cell"
      disabled={disabled}
      onClick={onClick}
    >
      <span aria-hidden={true}>{mark}</span>
    </button>
  );
};
export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsPlaying, setXIsPlaying] = useState(true);

  const winner = determineWinner(board);

  const onReset = () => {
    if (winner == null) {
      const confirm = window.confirm(
        "Are you sure you want to reset the game?"
      );
      if (!confirm) return;
    }
    setBoard(Array(9).fill(null));
    setXIsPlaying(true);
  };

  const getStatusMessage = () => {
    if (winner != null) {
      return `Player ${winner} wins!`;
    }
    if (!board.includes(null)) {
      return `It's a draw!`;
    }
    return `Player ${xIsPlaying ? "X" : "O"} turn`;
  };

  const onCellClick = (cellIndex, turn) => {
    console.log("CellIndex", cellIndex);
    const newBoard = board.slice();
    newBoard[cellIndex] = turn;
    setBoard(newBoard);
    setXIsPlaying(!xIsPlaying);
  };

  return (
    <div className="app">
      <div aria-live="polite">{getStatusMessage()}</div>
      <div className="board">
        {Array(9)
          .fill(null)
          .map((_, index) => index)
          .map((cellIndex) => {
            const turn = xIsPlaying ? "X" : "O";
            return (
              <Cell
                key={cellIndex}
                disabled={board[cellIndex] != null || winner != null}
                index={cellIndex}
                mark={board[cellIndex]}
                turn={turn}
                onClick={() => onCellClick(cellIndex, turn)}
              />
            );
          })}
      </div>
      <button onClick={() => onReset()}>Reset</button>
    </div>
  );
}
