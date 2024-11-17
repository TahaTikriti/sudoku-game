// logic/solver.ts

export const solveSudoku = (board: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) { // Find an empty cell
        for (let num = 1; num <= 9; num++) { // Try numbers 1-9
          if (isValid(board, row, col, num)) {
            board[row][col] = num; // Place the number
            if (solveSudoku(board)) {
              return true; // If the board is solved, return true
            }
            board[row][col] = 0; // Reset if it didn't work
          }
        }
        return false; // If no number works, return false
      }
    }
  }
  return true; // Puzzle is solved
};

// Check if placing `num` at (row, col) is valid
const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
  // Check the row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) {
      return false;
    }
  }

  // Check the column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) {
      return false;
    }
  }

  // Check the 3x3 grid
  const gridRow = Math.floor(row / 3) * 3;
  const gridCol = Math.floor(col / 3) * 3;
  for (let i = gridRow; i < gridRow + 3; i++) {
    for (let j = gridCol; j < gridCol + 3; j++) {
      if (board[i][j] === num) {
        return false;
      }
    }
  }

  return true; // Number is valid
};
