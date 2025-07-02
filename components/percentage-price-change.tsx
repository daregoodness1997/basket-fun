// components/PriceChange.tsx
import React from "react";

interface PriceChangeProps {
  change: number | null; // Percentage change
}

const PriceChange: React.FC<PriceChangeProps> = ({ change }) => {
  if (change === null || change === undefined) {
    return (
      <span className="font-medium text-right text-muted-foreground">N/A</span>
    );
  }

  const isPositive = change >= 0;
  const formattedChange = `${isPositive ? "+" : ""}${change.toFixed(2)}%`;

  return (
    <span
      className={`font-medium text-right ${
        isPositive ? "text-green-600" : "text-red-600"
      }`}
    >
      {formattedChange}
    </span>
  );
};

export default PriceChange;
