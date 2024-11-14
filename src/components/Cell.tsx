// components/Cell.tsx
import React from "react";

interface CellProps {
    row: number;
    col: number;
    value: number;
    conflict: boolean;
    handleChange: (row: number, col: number, value: string) => void;
}

const Cell: React.FC<CellProps> = ({
    row,
    col,
    value,
    conflict,
    handleChange,
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
            value={value || ""}
            onChange={(e) => handleChange(row, col, e.target.value)}
            className={`w-14 h-14 text-center ${conflict ? "bg-red-500" : "bg-white"} focus:outline-none ${getBorderClass()}`}
        />
    );
};

export default Cell;
