import React from "react";

interface ResetModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ResetModal: React.FC<ResetModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          ⚠️ Reset Confirmation
        </h2>
        <p className="text-gray-700">
          Are you sure you want to reset the board? All progress will be lost.
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Yes, Reset
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;
