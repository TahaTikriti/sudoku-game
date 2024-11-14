import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";

const SudokuBoard: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(
    Array(9).fill(Array(9).fill(0))
  );
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setBoard(generateValidBoard());
  }, []);

  const generateValidBoard = () => {
    const newBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Math.random() > 0.75) {
          let num;
          let attempts = 0;
          do {
            num = Math.floor(Math.random() * 9) + 1;
            attempts++;
          } while (!isValidPlacement(newBoard, i, j, num) && attempts < 10);
          newBoard[i][j] = num;
        }
      }
    }
    return newBoard;
  };

  const isValidPlacement = (
    board: number[][],
    row: number,
    col: number,
    value: number
  ) => {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === value && i !== col) return false;
      if (board[i][col] === value && i !== row) return false;
      if (
        board[startRow + Math.floor(i / 3)][startCol + (i % 3)] === value &&
        (startRow + Math.floor(i / 3) !== row || startCol + (i % 3) !== col)
      )
        return false;
    }
    return true;
  };

  const handleChange = (row: number, col: number, value: string) => {
    if (/^[1-9]?$/.test(value)) {
      const updatedBoard = board.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((cell, colIndex) =>
              colIndex === col ? parseInt(value) || 0 : cell
            )
          : r
      );
      setBoard(updatedBoard);
      setIsComplete(false);
    }
  };

  const checkCompletion = () => {
    const complete = board.every((row) =>
      row.every((cell) => cell >= 1 && cell <= 9)
    );
    setIsComplete(complete);
    alert(
      complete
        ? "Congratulations! The board is complete."
        : "The board is incomplete. Ensure all cells are filled."
    );
  };

  const getCellClass = (row: number, col: number) => {
    const value = board[row][col];
    return value && !isValidPlacement(board, row, col, value)
      ? "bg-red-200"
      : "";
  };

  const getBorderClass = (rowIndex: number, colIndex: number) => {
    const isTopBorder = rowIndex % 3 === 0;
    const isLeftBorder = colIndex % 3 === 0;
    const isBottomBorder = (rowIndex + 1) % 3 === 0;
    const isRightBorder = (colIndex + 1) % 3 === 0;
    let borderClass = "border border-gray-400";
    if (isTopBorder) borderClass += " border-t-2 border-t-black";
    if (isLeftBorder) borderClass += " border-l-2 border-l-black";
    if (isBottomBorder) borderClass += " border-b-2 border-b-black";
    if (isRightBorder) borderClass += " border-r-2 border-r-black";
    return borderClass;
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl font-bold">Sudoku Game</h1>

      <div className="grid grid-cols-9 p-4">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              value={cell || ""}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              className={`w-12 h-12 text-center ${getCellClass(
                rowIndex,
                colIndex
              )} ${getBorderClass(rowIndex, colIndex)} appearance-none`}
            />
          ))
        )}
      </div>

      <button
        onClick={checkCompletion}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Check Solution
      </button>

      {isComplete && (
        <p className="text-green-600 mt-2">The board is complete!</p>
      )}
    </div>
  );
};

export default SudokuBoard;
