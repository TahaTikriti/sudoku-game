// components/SudokuBoard.tsx
import React, { useState, useEffect } from "react";
import Cell from "./Cell";

interface SudokuBoardProps {
  board: number[][];
  handleChange: (row: number, col: number, value: string) => void;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ board, handleChange }) => {
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
  );
};

export default SudokuBoard;
