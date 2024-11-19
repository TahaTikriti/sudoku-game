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
    if (row % 3 === 0 && row !== 0) borderClass += " border-t-4 border-t-black";
    if (col % 3 === 0 && col !== 0) borderClass += " border-l-4 border-l-black";
    if (row === 8) borderClass += " border-b";
    if (col === 8) borderClass += " border-r";
    return borderClass;
  };

  return (
    <input
      type="number"
      min="1"
      max="9"
      value={isHint ? hintValue || "" : value || ""}
      onChange={(e) => editable && handleChange(row, col, e.target.value)} // Handle change if editable
      className={`w-14 h-14 text-center
        ${conflict ? "bg-red-500" : value ? "bg-gray-300" : "bg-white"}
        focus:outline-none
        ${getBorderClass()}
                ${
                  isHint
                    ? "bg-yellow-200 transition-all duration-300 ease-in-out"
                    : ""
                }

      `}
      disabled={!editable} // Disable if not editable
    />
  );
};

export default Cell;
