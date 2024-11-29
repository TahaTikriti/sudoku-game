const Cell: React.FC<{
  row: number;
  col: number;
  value: number;
  conflict: boolean;
  handleChange: (row: number, col: number, value: string) => void;
  isHint: boolean;
  hintValue?: number;
  editable: boolean;
}> = ({
  row,
  col,
  value,
  conflict,
  handleChange,
  isHint,
  hintValue,
  editable,
}) => {
  const getBorderClass = () => {
    let borderClass = "border border-gray-400";

    // Apply thicker borders for the 3x3 grid
    if (row % 3 === 0) {
      borderClass += " border-t-4 border-t-black"; // Top border for the first row of each 3x3 grid
    }
    if (col % 3 === 0) {
      borderClass += " border-l-4 border-l-black"; // Left border for the first column of each 3x3 grid
    }

    // Add bottom border for the last row of each 3x3 grid
    if (row === 8) {
      borderClass += " border-b-4 border-b-black"; // Bottom border for the last row
    }

    // Add right border for the last column of each 3x3 grid
    if (col === 8) {
      borderClass += " border-r-4 border-r-black"; // Right border for the last column
    }

    return borderClass;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editable) {
      let newValue = e.target.value;

      // Validate the input: only allow values between 1 and 9 or empty string
      if (
        newValue === "" ||
        (parseInt(newValue) >= 1 && parseInt(newValue) <= 9)
      ) {
        handleChange(row, col, newValue); // Call the parent's handleChange
      }
    }
  };

  return (
    <input
      type="number"
      min="1"
      max="9"
      value={isHint ? hintValue || "" : value || ""}
      onChange={handleInputChange} // Handle input change in the cell
      className={`min-w-[3.5rem] max-w-[5rem] h-14 text-center md:text-center text-2xl font-semibold text-gray-800 
        ${conflict ? "bg-red-500" : value ? "bg-gray-300" : "bg-white"}
        focus:outline-none
        ${getBorderClass()}
        ${isHint ? "bg-yellow-200 transition-all duration-300 ease-in-out" : ""}
      `}
      disabled={!editable} // Disable if not editable
    />
  );
};

export default Cell;
