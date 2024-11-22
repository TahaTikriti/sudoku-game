import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import { getConflictMatrix } from "../logic/conflictChecker";

interface SudokuBoardProps {
  board: number[][]; // Current state of the board
  handleChange: (row: number, col: number, value: string) => void;
  initialBoard: number[][]; // Store initial, uneditable values
  hintCell: { row: number; col: number; value: number } | null; // Pass hint cell from parent
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  handleChange,
  initialBoard,
  hintCell,
}) => {
  const [conflicts, setConflicts] = useState<boolean[][]>(
    Array(9).fill(Array(9).fill(false))
  );

  useEffect(() => {
    setConflicts(getConflictMatrix(board));
  }, [board]);

  return (
    <div className="grid grid-cols-9 gap-0 p-4 bg-gray-200 rounded-lg shadow-md">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            value={cell}
            conflict={conflicts[rowIndex][colIndex]}
            handleChange={handleChange}
            isHint={hintCell?.row === rowIndex && hintCell?.col === colIndex}
            hintValue={
              hintCell?.row === rowIndex && hintCell?.col === colIndex
                ? hintCell.value
                : undefined
            }
            editable={initialBoard[rowIndex][colIndex] === 0}
          />
        ))
      )}
    </div>
  );
};

export default SudokuBoard;
