import { isValidBoard } from './validation';

// Main function to solve Sudoku puzzle
export const solveSudoku = (
  board: number[][],
  onError: (error: string) => void
): number[][] | null => {
  // Check if the board is initially valid
  if (!isValidBoard(board)) {
    onError("The board is invalid. Please check your input.");
    return null;
  }

  // Attempt to solve the board with backtracking
  const boardCopy = board.map(row => [...row]); // Create a safe copy
  const isSolved = solveHelper(boardCopy);

  if (!isSolved) {
    onError("The board is unsolvable. Please adjust your inputs.");
    return null;
  }

  return boardCopy; // Return solved board
};

// Helper function to implement backtracking algorithm
const solveHelper = (board: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) { // Find an empty cell
        for (let num = 1; num <= 9; num++) {
          if (isPlacementValid(board, row, col, num)) {
            board[row][col] = num; // Try placing the number
            if (solveHelper(board)) return true; // Recursively solve
            board[row][col] = 0; // Backtrack
          }
        }
        return false; // No valid number found
      }
    }
  }
  return true; // Solved
};

// Helper function: Check if placing a number is valid
const isPlacementValid = (board: number[][], row: number, col: number, num: number): boolean => {
  // Check row and column
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }

  // Check 3x3 grid
  const gridRow = Math.floor(row / 3) * 3;
  const gridCol = Math.floor(col / 3) * 3;
  for (let i = gridRow; i < gridRow + 3; i++) {
    for (let j = gridCol; j < gridCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }

  return true; // Valid placement
};
