import React, { useState, useCallback } from "react";
import SudokuBoard from "./components/SudokuBoard";
import { isValidBoard } from "./logic/validation";
import { generateSudokuPuzzle } from "./logic/puzzleGenerator";
import { solveSudoku } from "./logic/solver";

const App: React.FC = () => {
  const initializeBoard = () => Array(9).fill(Array(9).fill(0));
  const [board, setBoard] = useState<number[][]>(initializeBoard);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleChange = useCallback(
    (row: number, col: number, value: string) => {
      const newBoard = board.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((cell, colIndex) =>
              colIndex === col ? (value ? parseInt(value) : 0) : cell
            )
          : r
      );
      setBoard(newBoard);
    },
    [board]
  );

  const solveBoard = useCallback(() => {
    const boardCopy = [...board];
    solveSudoku(boardCopy);
    setBoard(boardCopy);
  }, [board]);

  const handleCheckSolution = useCallback(() => {
    setIsValid(isValidBoard(board));
  }, [board]);

  const handleGeneratePuzzle = useCallback(() => {
    const generatedBoard = generateSudokuPuzzle(difficulty);
    setBoard(generatedBoard);
  }, [difficulty]);

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

      <SudokuBoard
        board={board}
        handleChange={handleChange}
        solveBoard={solveBoard}
      />
    </div>
  );
};

export default App;
