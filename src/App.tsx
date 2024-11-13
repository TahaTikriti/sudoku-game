import React from 'react';
import SudokuBoard from './SudokuBoard';

const App: React.FC = () => {
  return (
    <div className="bg-gradient-to-t from-blue-900 to-blue-300 min-h-screen">
      <div className="text-center mt-4 p-2">
      <SudokuBoard />
      </div>
    </div>
  );
};

export default App;
