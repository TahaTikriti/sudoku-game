export const generateSudokuPuzzle = (difficulty: string): number[][] => {
  // Step 1: Generate a fully solved board
  const solvedBoard = generateSolvedBoard();

  // Step 2: Remove numbers based on difficulty, ensuring a unique solution
  const puzzleBoard = removeNumbersWithUniqueSolution(solvedBoard, difficulty);

  return puzzleBoard;
};

const generateSolvedBoard = (): number[][] => {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));
  fillBoard(board); // Fill board with a valid solution using backtracking
  return board;
};

const fillBoard = (board: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let num of nums) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0; // Backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
};

const isValidMove = (board: number[][], row: number, col: number, num: number): boolean => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const gridRow = Math.floor(row / 3) * 3;
  const gridCol = Math.floor(col / 3) * 3;
  for (let i = gridRow; i < gridRow + 3; i++) {
    for (let j = gridCol; j < gridCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }
  return true;
};

const removeNumbersWithUniqueSolution = (board: number[][], difficulty: string): number[][] => {
  const newBoard = board.map(row => [...row]); // Clone board
  let cellsToRemove = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 40 : 50;

  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (newBoard[row][col] !== 0) {
      const temp = newBoard[row][col];
      newBoard[row][col] = 0;

      // Check if the puzzle has a unique solution after removal
      if (!hasUniqueSolution(newBoard)) {
        newBoard[row][col] = temp; // Restore if it doesn't have a unique solution
      } else {
        cellsToRemove--;
      }
    }
  }

  return newBoard;
};

const hasUniqueSolution = (board: number[][]): boolean => {
  let solutionCount = 0;

  const solve = (board: number[][]): boolean => {
    let emptyCell = findEmptyCell(board);
    if (!emptyCell) return true;

    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
      if (isValidMove(board, row, col, num)) {
        board[row][col] = num;
        if (solve(board)) {
          solutionCount++;
          if (solutionCount > 1) return false;
          board[row][col] = 0; // Backtrack
        }
      }
    }
    return false;
  };

  let boardCopy = board.map(row => [...row]);
  solutionCount = 0;
  solve(boardCopy);
  return solutionCount === 1; // True if exactly one solution exists
};

const findEmptyCell = (board: number[][]): [number, number] | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) return [row, col];
    }
  }
  return null;
};

const shuffle = (array: number[]): number[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
