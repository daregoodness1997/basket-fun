// components/PriceChange.tsx
import React from "react";

interface PriceChangeProps {
    change: number; // Percentage change
}

const PriceChange: React.FC<PriceChangeProps> = ({ change }) => {
    const isPositive = change >= 0;
    const formattedChange = `${isPositive ? "+" : ""}${change.toFixed(2)}%`;

    return (
        <span
            className={`font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
            }`}
        >
            {formattedChange}
        </span>
    );
};

export default PriceChange;
