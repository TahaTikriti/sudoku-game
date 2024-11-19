import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import { getConflictMatrix } from "../logic/conflictChecker";
import { handleHint } from "../logic/hintLogic";

interface SudokuBoardProps {
  board: number[][]; // Current state of the board
  handleChange: (row: number, col: number, value: string) => void;
  solveBoard: () => void;
  initialBoard: number[][]; // Store initial, uneditable values
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  handleChange,
  solveBoard,
  initialBoard,
}) => {
  const [conflicts, setConflicts] = useState<boolean[][]>(
    Array(9).fill(Array(9).fill(false))
  );
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const [hintCell, setHintCell] = useState<{
    row: number;
    col: number;
    value: number;
  } | null>(null);

  useEffect(() => {
    setConflicts(getConflictMatrix(board));
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
              conflict={conflicts[rowIndex][colIndex]}
              handleChange={handleChange}
              isHint={hintCell?.row === rowIndex && hintCell?.col === colIndex}
              hintValue={
                hintCell?.row === rowIndex && hintCell?.col === colIndex
                  ? hintCell.value
                  : undefined
              }
              editable={initialBoard[rowIndex][colIndex] === 0} // Only allow editing if initial value is 0
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
