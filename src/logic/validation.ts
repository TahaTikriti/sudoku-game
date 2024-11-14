// logic/validation.ts

export const isValidBoard = (board: number[][]): boolean => {
  return isValidRows(board) && isValidColumns(board) && isValidGrids(board);
};

const isValidRows = (board: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    const seen = new Set<number>();
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (num && seen.has(num)) return false; // Conflict found in row
      if (num) seen.add(num);
    }
  }
  return true;
};

const isValidColumns = (board: number[][]): boolean => {
  for (let col = 0; col < 9; col++) {
    const seen = new Set<number>();
    for (let row = 0; row < 9; row++) {
      const num = board[row][col];
      if (num && seen.has(num)) return false; // Conflict found in column
      if (num) seen.add(num);
    }
  }
  return true;
};

const isValidGrids = (board: number[][]): boolean => {
  for (let gridRow = 0; gridRow < 9; gridRow += 3) {
    for (let gridCol = 0; gridCol < 9; gridCol += 3) {
      const seen = new Set<number>();
      for (let row = gridRow; row < gridRow + 3; row++) {
        for (let col = gridCol; col < gridCol + 3; col++) {
          const num = board[row][col];
          if (num && seen.has(num)) return false; // Conflict found in 3x3 grid
          if (num) seen.add(num);
        }
      }
    }
  }
  return true;
};
