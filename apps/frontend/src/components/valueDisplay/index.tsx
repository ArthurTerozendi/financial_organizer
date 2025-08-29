import { FC } from "react";

interface ValueDisplayProps {
  value: number;
  type: "Credit" | "Debit";
}

const ValueDisplay: FC<ValueDisplayProps> = ({ value, type }) => {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return (
    <div
      className={`flex items-center gap-1 text-sm font-medium transition-all duration-200 ${
        type === "Credit" 
          ? "text-green-400 group-hover:text-green-300" 
          : "text-red-400 group-hover:text-red-300"
      }`}
    >
      <span className="text-xs">{type === "Credit" ? "+" : "-"}</span>
      <span className="truncate">{formattedValue}</span>
    </div>
  );
};

export default ValueDisplay;
