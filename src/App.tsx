// App.tsx
import React, { useState } from "react";
import SudokuBoard from "./components/SudokuBoard";
import { isValidBoard } from "./logic/validation";
import { generateSudokuPuzzle } from "./logic/puzzleGenerator";

const App: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(
    Array(9).fill(Array(9).fill(0))
  );
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleChange = (row: number, col: number, value: string) => {
    const newBoard = board.map((r, rowIndex) =>
      rowIndex === row
        ? r.map((cell, colIndex) =>
            colIndex === col ? (value ? parseInt(value) : 0) : cell
          )
        : r
    );
    setBoard(newBoard);
  };

  const handleCheckSolution = () => {
    setIsValid(isValidBoard(board));
  };

  const handleGeneratePuzzle = () => {
    const generatedBoard = generateSudokuPuzzle(difficulty);
    setBoard(generatedBoard);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl font-bold">Sudoku Game</h1>

      <div>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="mt-4 p-2 border border-gray-300 rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="mt-4">
        <button
          onClick={handleGeneratePuzzle}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Generate Puzzle
        </button>
        <button
          onClick={handleCheckSolution}
          className="p-2 bg-green-500 text-white rounded ml-4"
        >
          Check Solution
        </button>
      </div>

      <div className={`mt-4 ${isValid ? "text-green-500" : "text-red-500"}`}>
        {isValid ? "Solution is correct!" : "Solution is incorrect!"}
      </div>

      <SudokuBoard board={board} handleChange={handleChange} />
    </div>
  );
};

export default App;
