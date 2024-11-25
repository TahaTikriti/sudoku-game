import React, { useState, useCallback, useEffect } from "react";
import SudokuBoard from "./components/SudokuBoard";
import { isValidBoard } from "./logic/validation";
import { generateSudokuPuzzle } from "./logic/puzzleGenerator";
import { solveSudoku } from "./logic/solver";
import { handleHint } from "./logic/hintLogic";

const App: React.FC = () => {
  const initializeBoard = () => Array(9).fill(Array(9).fill(0));

  const [board, setBoard] = useState<number[][]>(initializeBoard);
  const [initialBoard, setInitialBoard] = useState<number[][]>(initializeBoard);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const [hintCell, setHintCell] = useState<{
    row: number;
    col: number;
    value: number;
  } | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Timer Control
  const startTimer = useCallback(() => {
    setTimeElapsed(0);
    setIsTimerRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning) {
      timer = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const formattedTime = `${Math.floor(timeElapsed / 60)
    .toString()
    .padStart(2, "0")}:${(timeElapsed % 60).toString().padStart(2, "0")}`;

  // Board Progress and Completion Handling
  useEffect(() => {
    const filledCells = board.flat().filter((cell) => cell !== 0).length;
    const progressValue = Math.round((filledCells / 81) * 100);
    setProgress(progressValue);

    const allCellsFilled = filledCells === 81;
    const noConflicts = isValidBoard(board);

    if (allCellsFilled && noConflicts) {
      stopTimer(); // Stop timer on success
      setShowSuccess(true);
    }
  }, [board, stopTimer]);

  // Puzzle Generation
  const handleGeneratePuzzle = useCallback(() => {
    const generatedBoard = generateSudokuPuzzle(difficulty);
    setBoard(generatedBoard);
    setInitialBoard(generatedBoard);
    setShowSuccess(false); // Reset success state for new puzzle
    setErrorMessage(null); // Clear error message on new puzzle generation
    startTimer(); // Start the timer
  }, [difficulty, startTimer]);

  // Board Updates
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

      if (!isValidBoard(newBoard)) {
        setErrorMessage(
          "There are conflicts in the board. Fix them before proceeding."
        );
      } else {
        setErrorMessage(null);
      }
    },
    [board]
  );

  const handleSolve = () => {
    const solvedBoard = solveSudoku(board, setErrorMessage); // Pass the current board and error handler

    if (solvedBoard) {
      setBoard(solvedBoard); // Update board state with solved board
      setShowSuccess(true); // Show success message
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Sudoku Game</h1>

      <div className="mt-4 text-xl font-semibold text-gray-700">
        Time Elapsed: {formattedTime}
      </div>

      {initialBoard.flat().every((cell) => cell === 0) && (
        <div className="mt-4 text-gray-500 text-lg text-center">
          Select a difficulty and click{" "}
          <span className="font-semibold text-blue-500">"Generate Puzzle"</span>{" "}
          to start!
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              🎉 Congratulations!
            </h2>
            <p className="text-gray-700">
              You completed the puzzle in {formattedTime}.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg p-6">
        {/* Sudoku Board */}
        <SudokuBoard
          board={board}
          handleChange={handleChange}
          initialBoard={initialBoard}
          hintCell={hintCell}
        />

        {/* Control Panel */}
        <div className="flex flex-col items-center ml-0 md:ml-6 mt-6 md:mt-0 space-y-4">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button
            onClick={handleGeneratePuzzle}
            className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
          >
            Generate Puzzle
          </button>

          <button
            onClick={handleSolve}
            className="w-full p-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg"
            disabled={!!errorMessage} // Disable if there's an error
          >
            Solve Puzzle
          </button>
          <button
            onClick={() =>
              handleHint(board, hintsLeft, setHintCell, setHintsLeft)
            }
            className="w-full p-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg"
            disabled={hintsLeft === 0 || !!errorMessage} // Disable if no hints or error
          >
            Get Hint ({hintsLeft})
          </button>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 text-red-600 font-semibold">
              <strong>Error:</strong> {errorMessage}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-4 w-full max-w-sm">
            <div className="relative w-full bg-gray-200 rounded h-6">
              <div
                className="absolute top-0 left-0 bg-blue-500 h-6 rounded transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-center text-gray-700 font-semibold mt-1">
              {progress}% Completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
