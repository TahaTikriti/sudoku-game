import React, { useState, useCallback, useEffect } from "react";
import SudokuBoard from "./components/SudokuBoard";
import ControlPanel from "./components/ControlPanel";
import { isValidBoard } from "./logic/validation";
import { generateSudokuPuzzle } from "./logic/puzzleGenerator";
import { solveSudoku } from "./logic/solver";
import { handleHint } from "./logic/hintLogic";
import ResetModal from "./components/dialogs/ResetModal";
import SuccessModal from "./components/dialogs/SucessModal";

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
  const [showResetModal, setShowResetModal] = useState(false); // Tracks modal visibility
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
    const solvedBoard = solveSudoku(board, setErrorMessage);

    if (solvedBoard) {
      setBoard(solvedBoard);
      setShowSuccess(true);
    }
  };
const handleResetBoard = () => {
  setBoard(initializeBoard()); // Clear the board
  setInitialBoard(initializeBoard()); // Reset the initial board
  setErrorMessage(null); // Clear any error messages
  setHintCell(null); // Clear any hint highlights
  setHintsLeft(3); // Reset hints
  setProgress(0); // Reset progress bar
  setTimeElapsed(0); // Reset timer
  setShowResetModal(false); // Close the modal
  stopTimer(); // Stop the timer
};
const onResetBoard = () => {
  setShowResetModal(true); // Show the modal when reset is requested
};

// Function to handle image upload
  const handleUploadImage = (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
  
      // Send the image to your backend (replace with actual API endpoint)
      fetch("http://localhost:5000/ocr", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle OCR result (display text, etc.)
          console.log(data.text);
        })
        .catch((error) => {
          setErrorMessage("Error uploading image for OCR");
          console.error(error);
        });
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

      {showSuccess && (
        <SuccessModal
          timeElapsed={formattedTime}
          onClose={() => setShowSuccess(false)}
        />
      )}

      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between bg-white shadow-md rounded-lg p-6">
        <SudokuBoard
          board={board}
          handleChange={handleChange}
          initialBoard={initialBoard}
          hintCell={hintCell}
        />
        <ControlPanel
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          onGeneratePuzzle={handleGeneratePuzzle}
          onSolvePuzzle={handleSolve}
          onGetHint={() =>
            handleHint(board, hintsLeft, setHintCell, setHintsLeft)
          }
          hintsLeft={hintsLeft}
          errorMessage={errorMessage}
          progress={progress}
          onResetBoard={onResetBoard} // Pass reset function
          onUploadImage={handleUploadImage} // Pass the function
        />
      </div>
      {showResetModal && (
        <ResetModal
          onConfirm={handleResetBoard}
          onCancel={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
};

export default App;
