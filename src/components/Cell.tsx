// components/Cell.tsx
import React, { useState, useEffect } from "react";

interface CellProps {
    row: number;
    col: number;
    value: number;
    conflict: boolean;
    handleChange: (row: number, col: number, value: string) => void;
    isHint: boolean;
    hintValue?: number; // Add an optional hint value to be shown in the cell
}

const Cell: React.FC<CellProps> = ({
    row,
    col,
    value,
    conflict,
    handleChange,
    isHint,
    hintValue,
}) => {
    const [showHint, setShowHint] = useState(false);

    // Set the hint background for 5 seconds and then remove it
    useEffect(() => {
        if (isHint) {
            setShowHint(true);
            const timeout = setTimeout(() => {
                setShowHint(false);
            }, 5000); // Fade out after 5 seconds
            return () => clearTimeout(timeout); // Clean up timeout if the component unmounts
        }
    }, [isHint]);

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
            value={showHint ? hintValue || "" : value || ""}
            onChange={(e) => handleChange(row, col, e.target.value)}
            className={`w-14 h-14 text-center
                ${conflict ? "bg-red-500 opacity-100" : value ? "bg-gray-300" : "bg-white opacity-90"} 
                focus:outline-none
                ${getBorderClass()}
                ${
                    showHint
                        ? "bg-yellow-200 opacity-100 transition-all duration-300 ease-in-out"
                        : ""
                }
             `}
            onClick={() => handleChange(row, col, "")} // Allow the user to clear the cell by clicking
        />
    );
};

export default Cell;
