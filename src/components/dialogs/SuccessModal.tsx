import React from "react";

interface SuccessModalProps {
  timeElapsed: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  timeElapsed,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          🎉 Congratulations!
        </h2>
        <p className="text-gray-700">
          You completed the puzzle in {timeElapsed}.
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
