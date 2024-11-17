// components/SudokuBoard.tsx
import React, { useState, useEffect } from "react";
import Cell from "./Cell";

interface SudokuBoardProps {
  board: number[][];
  handleChange: (row: number, col: number, value: string) => void;
  solveBoard: () => void; // Add prop for solving the board
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  handleChange,
  solveBoard,
}) => {
  const [conflicts, setConflicts] = useState<boolean[][]>(
    Array(9).fill(Array(9).fill(false))
  );

  useEffect(() => {
    const conflictMatrix: boolean[][] = Array(9)
      .fill(null)
      .map(() => Array(9).fill(false)); // Reinitialize each row as an array of false

    // Check for conflicts dynamically
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) continue; // Skip empty cells

        // Check row conflicts
        for (let i = 0; i < 9; i++) {
          if (i !== col && board[row][i] === board[row][col]) {
            conflictMatrix[row][col] = true;
            conflictMatrix[row][i] = true; // Mark the conflicting cell
          }
        }

        // Check column conflicts
        for (let i = 0; i < 9; i++) {
          if (i !== row && board[i][col] === board[row][col]) {
            conflictMatrix[row][col] = true;
            conflictMatrix[i][col] = true; // Mark the conflicting cell
          }
        }

        // Check 3x3 grid conflicts
        const gridRow = Math.floor(row / 3) * 3;
        const gridCol = Math.floor(col / 3) * 3;
        for (let i = gridRow; i < gridRow + 3; i++) {
          for (let j = gridCol; j < gridCol + 3; j++) {
            if ((i !== row || j !== col) && board[i][j] === board[row][col]) {
              conflictMatrix[row][col] = true;
              conflictMatrix[i][j] = true; // Mark the conflicting cell
            }
          }
        }
      }
    }

    setConflicts(conflictMatrix); // Set the conflicts state
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
              conflict={conflicts[rowIndex][colIndex]} // Pass conflict status to each cell
              handleChange={handleChange}
            />
          ))
        )}
      </div>

      {/* Solve Button */}
      <div className="flex justify-center">
        <button
          onClick={solveBoard} // Call the solveBoard function when the button is clicked
          className="px-6 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Solve
        </button>
      </div>
    </div>
  );
};

export default SudokuBoard;
