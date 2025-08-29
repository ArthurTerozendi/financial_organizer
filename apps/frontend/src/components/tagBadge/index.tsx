import { FC } from "react";

interface TagBadgeProps {
  tagName?: string;
  tagColor?: string;
}

const TagBadge: FC<TagBadgeProps> = ({ tagName, tagColor }) => {
  if (!tagName) {
    return (
      <div className="w-full sm:w-[100px] h-6 bg-gray-700/50 rounded-lg flex items-center justify-center">
        <span className="text-xs text-gray-400">Outros</span>
      </div>
    );
  }

  return (
    <div
      className="w-full sm:w-auto px-2 py-1 rounded-lg flex items-center justify-center text-xs font-medium text-white transition-all duration-200 hover:opacity-80 cursor-default"
      style={{ 
        backgroundColor: tagColor ?? "#2F3B51",
        minWidth: "80px",
        maxWidth: "120px"
      }}
      title={tagName}
    >
      <span className="truncate">{tagName}</span>
    </div>
  );
};

export default TagBadge;
