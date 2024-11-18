// FILE: logic/hintLogic.ts
export const getValidHintValue = (board: number[][], row: number, col: number): number | null => {
  const usedValues = new Set<number>();

  // Check the row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] !== 0) usedValues.add(board[row][i]);
  }

  // Check the column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] !== 0) usedValues.add(board[i][col]);
  }

  // Check the 3x3 grid
  const gridRow = Math.floor(row / 3) * 3;
  const gridCol = Math.floor(col / 3) * 3;
  for (let i = gridRow; i < gridRow + 3; i++) {
    for (let j = gridCol; j < gridCol + 3; j++) {
      if (board[i][j] !== 0) usedValues.add(board[i][j]);
    }
  }

  // Find the first valid number that isn't used in the row, column, or grid
  for (let num = 1; num <= 9; num++) {
    if (!usedValues.has(num)) {
      return num;
    }
  }

  return null; // No valid number found, though this shouldn't happen
};

export const handleHint = (
  board: number[][],
  hintsLeft: number,
  setHintCell: (hint: { row: number; col: number; value: number } | null) => void,
  setHintsLeft: (hintsLeft: number) => void
) => {
  if (hintsLeft > 0) {
    // Create an array of all cell positions and shuffle it
    const cells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        cells.push({ row, col });
      }
    }
    cells.sort(() => Math.random() - 0.5); // Shuffle the array

    // Find the first empty cell in the shuffled array
    for (const { row, col } of cells) {
      if (board[row][col] === 0) {
        const validHint = getValidHintValue(board, row, col);
        if (validHint !== null) {
          setHintCell({ row, col, value: validHint }); // Set the hint cell with value
          setHintsLeft(hintsLeft - 1);

          // Reset the hint cell after 3 seconds
          setTimeout(() => {
            setHintCell(null);
          }, 3000);

          return;
        }
      }
    }
  }
};