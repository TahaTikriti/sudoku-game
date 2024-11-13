import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

const SudokuBoard: React.FC = () => {
    const [board, setBoard] = useState<number[][]>(Array(9).fill(Array(9).fill(0)));

    const handleChange = (row: number, col: number, value: string) => {
        const newBoard = board.map((r, rowIndex) =>
            rowIndex === row
                ? r.map((cell, colIndex) => (colIndex === col ? (value ? parseInt(value) : 0) : cell))
                : r
        );
        setBoard(newBoard);
    };

    const getBorderClass = (rowIndex: number, colIndex: number) => {
        // Adding thicker borders for every 3rd row and column
        const isTopBorder = rowIndex % 3 === 0;
        const isLeftBorder = colIndex % 3 === 0;
        const isBottomBorder = (rowIndex + 1) % 3 === 0;
        const isRightBorder = (colIndex + 1) % 3 === 0;
        let borderClass = "border border-gray-400"; // Default inner border color

        if (isTopBorder) borderClass += " border-t-2 border-t-black"; // Thicker top border for 3rd row
        if (isLeftBorder) borderClass += " border-l-2 border-l-black"; // Thicker left border for 3rd column
        if (isBottomBorder) borderClass += " border-b-2 border-b-black"; // Thicker bottom border for 3rd row
        if (isRightBorder) borderClass += " border-r-2 border-r-black"; // Thicker right border for 3rd column

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
                type="number"
                min="1"
                max="9"
                value={cell || ""}
                onChange={(e) =>
                  handleChange(rowIndex, colIndex, e.target.value)
                }
                className={`w-12 h-12 text-center ${getBorderClass(
                  rowIndex,
                  colIndex
                )} appearance-none`}
              />
            ))
          )}
        </div>
      </div>
    );
};

export default SudokuBoard;
