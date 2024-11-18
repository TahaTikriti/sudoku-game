import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import { handleHint } from "../logic/hintLogic";

interface SudokuBoardProps {
  board: number[][];
  handleChange: (row: number, col: number, value: string) => void;
  solveBoard: () => void;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  handleChange,
  solveBoard,
}) => {
  const [conflicts, setConflicts] = useState<boolean[][]>(
    Array(9).fill(Array(9).fill(false))
  );
  const [hintsLeft, setHintsLeft] = useState<number>(3); // Track the number of hints available
  const [hintCell, setHintCell] = useState<{
    row: number;
    col: number;
    value: number;
  } | null>(null); // Store the hint cell and its value

  useEffect(() => {
    const conflictMatrix: boolean[][] = Array(9)
      .fill(null)
      .map(() => Array(9).fill(false));

    // Check for conflicts
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) continue;

        // Check row conflicts
        for (let i = 0; i < 9; i++) {
          if (i !== col && board[row][i] === board[row][col]) {
            conflictMatrix[row][col] = true;
            conflictMatrix[row][i] = true;
          }
        }

        // Check column conflicts
        for (let i = 0; i < 9; i++) {
          if (i !== row && board[i][col] === board[row][col]) {
            conflictMatrix[row][col] = true;
            conflictMatrix[i][col] = true;
          }
        }

        // Check 3x3 grid conflicts
        const gridRow = Math.floor(row / 3) * 3;
        const gridCol = Math.floor(col / 3) * 3;
        for (let i = gridRow; i < gridRow + 3; i++) {
          for (let j = gridCol; j < gridCol + 3; j++) {
            if ((i !== row || j !== col) && board[i][j] === board[row][col]) {
              conflictMatrix[row][col] = true;
              conflictMatrix[i][j] = true;
            }
          }
        }
      }
    }

    setConflicts(conflictMatrix);
  }, [board]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-9 gap-0 p-4">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              value={cell}
              conflict={conflicts[rowIndex][colIndex]} // Keep conflict highlighting
              handleChange={handleChange}
              isHint={hintCell?.row === rowIndex && hintCell?.col === colIndex} // Highlight if it's a hint
              hintValue={
                hintCell?.row === rowIndex && hintCell?.col === colIndex
                  ? hintCell.value
                  : undefined
              } // Display the hint value
            />
          ))
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={solveBoard}
          className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Solve
        </button>

        <button
          onClick={() =>
            handleHint(board, hintsLeft, setHintCell, setHintsLeft)
          }
          className="px-6 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-700"
          disabled={hintsLeft === 0}
        >
          Get Hint ({hintsLeft})
        </button>
      </div>
    </div>
  );
};

export default SudokuBoard;
