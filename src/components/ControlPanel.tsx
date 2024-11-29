import React from "react";

interface ControlPanelProps {
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  onGeneratePuzzle: () => void;
  onSolvePuzzle: () => void;
  onGetHint: () => void;
  hintsLeft: number;
  errorMessage: string | null;
  progress: number;
  onResetBoard: () => void;
  onUploadImage: (file: File) => void; // Add this prop to handle file upload
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  difficulty,
  setDifficulty,
  onGeneratePuzzle,
  onSolvePuzzle,
  onGetHint,
  hintsLeft,
  errorMessage,
  progress,
  onResetBoard,
  onUploadImage, // Use the prop
}) => {
  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  return (
    <div className="w-full md:w-1/3 flex flex-col items-center space-y-4 p-4 bg-white shadow-md rounded-lg">
      {/* Difficulty Selector */}
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      {/* Generate Puzzle Button */}
      <button
        onClick={onGeneratePuzzle}
        className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
      >
        Generate Puzzle
      </button>

      {/* Solve Puzzle Button */}
      <button
        onClick={onSolvePuzzle}
        className="w-full p-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg"
        disabled={!!errorMessage}
      >
        Solve Puzzle
      </button>

      {/* Get Hint Button */}
      <button
        onClick={onGetHint}
        className="w-full p-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg"
        disabled={hintsLeft === 0 || !!errorMessage}
      >
        Get Hint ({hintsLeft})
      </button>

      {/* Reset Button */}
      <button
        onClick={onResetBoard}
        className="w-full p-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
      >
        Reset Board
      </button>

      {/* Upload Image Button */}
    
        <input
          type="file"
          id="upload-image"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden" // Hide the default input style
        />
        <label
          htmlFor="upload-image"
          className="w-full p-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg cursor-pointer text-center"
        >
          Upload Image for OCR
        </label>
      

      {/* Progress Bar */}
      <div className="w-full">
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

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-600 font-semibold text-center">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
