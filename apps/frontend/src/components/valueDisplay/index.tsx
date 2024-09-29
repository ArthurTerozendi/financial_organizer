import { FC } from "react";

interface ValueDisplayProps {
  value: number;
  type: "Credit" | "Debit";
}

const ValueDisplay: FC<ValueDisplayProps> = ({ value, type }) => {
  return (
    <div
      className={`flex gap-1 ${type === "Credit" ? "text-green-500" : "text-red-500"}`}
    >
      <span>{type === "Credit" ? "+" : "-"}</span>
      <span>R$</span>
      <span>{value}</span>
    </div>
  );
};

export default ValueDisplay;
