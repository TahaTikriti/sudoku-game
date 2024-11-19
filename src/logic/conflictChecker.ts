export const getConflictMatrix = (board: number[][]): boolean[][] => {
  const conflictMatrix: boolean[][] = Array(9)
    .fill(null)
    .map(() => Array(9).fill(false));

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) continue;

      // Check row conflicts
      for (let i = 0; i < 9; i++) {
        if (i !== col && board[row][i] === board[row][col]) {
          conflictMatrix[row][col] = true;
          conflictMatrix[row][i] = true;
        }
      }

      // Check column conflicts
      for (let i = 0; i < 9; i++) {
        if (i !== row && board[i][col] === board[row][col]) {
          conflictMatrix[row][col] = true;
          conflictMatrix[i][col] = true;
        }
      }

      // Check 3x3 grid conflicts
      const gridRow = Math.floor(row / 3) * 3;
      const gridCol = Math.floor(col / 3) * 3;
      for (let i = gridRow; i < gridRow + 3; i++) {
        for (let j = gridCol; j < gridCol + 3; j++) {
          if ((i !== row || j !== col) && board[i][j] === board[row][col]) {
            conflictMatrix[row][col] = true;
            conflictMatrix[i][j] = true;
          }
        }
      }
    }
  }

  return conflictMatrix;
};
