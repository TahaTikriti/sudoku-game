import React, { useState, useCallback , useEffect} from "react";
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
  const [isValid, setIsValid] = useState<boolean>(true);
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const [hintCell, setHintCell] = useState<{
    row: number;
    col: number;
    value: number;
  } | null>(null);
  const [isSolutionChecked, setIsSolutionChecked] = useState(false);


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

 


 const handleGeneratePuzzle = useCallback(() => {
   const generatedBoard = generateSudokuPuzzle(difficulty);
   setBoard(generatedBoard);
   setInitialBoard(generatedBoard);
   startTimer(); // Start the timer when a new puzzle is generated
 }, [difficulty]);
 

  
const [timeElapsed, setTimeElapsed] = useState(0);
const [isTimerRunning, setIsTimerRunning] = useState(false);

useEffect(() => {
  let timer: NodeJS.Timeout;
  if (isTimerRunning) {
    timer = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
  }
  return () => clearInterval(timer);
}, [isTimerRunning]);

const startTimer = () => {
  setTimeElapsed(0);
  setIsTimerRunning(true);
};

const stopTimer = () => {
  setIsTimerRunning(false);
};
const formattedTime = `${Math.floor(timeElapsed / 60)
  .toString()
  .padStart(2, "0")}:${(timeElapsed % 60).toString().padStart(2, "0")}`;
  const calculateProgress = () => {
    const filledCells = board.flat().filter((cell) => cell !== 0).length;
    return Math.round((filledCells / 81) * 100);
  };


const [progress, setProgress] = useState<number>(calculateProgress());

useEffect(() => {
  setProgress(calculateProgress());
}, [board]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Sudoku Game</h1>
      <div className="mt-4 text-xl font-semibold text-gray-700">
        Time Elapsed: {formattedTime}
      </div>

      {initialBoard.flat().every((cell) => cell === 0) && (
        <div className="mt-4 text-gray-500 text-lg">
          Select a difficulty and click{" "}
          <span className="font-semibold">"Generate Puzzle"</span> to start the
          game!
        </div>
      )}

      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg p-6">
        {/* Sudoku Board */}
        <SudokuBoard
          board={board}
          handleChange={handleChange}
          initialBoard={initialBoard}
          hintCell={hintCell} // Pass hint cell to the board
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
            onClick={solveBoard}
            className="w-full p-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg"
          >
            Solve Puzzle
          </button>
          <button
            onClick={() =>
              handleHint(board, hintsLeft, setHintCell, setHintsLeft)
            }
            className="w-full p-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg"
            disabled={hintsLeft === 0}
          >
            Get Hint ({hintsLeft})
          </button>

          <div className="mt-4 flex items-center space-x-2">
            <div className="w-full bg-gray-200 rounded h-6">
              <div
                className="bg-blue-500 h-6 rounded"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-gray-700 font-semibold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
