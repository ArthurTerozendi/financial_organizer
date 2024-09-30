import { FC } from "react";

interface TagBadgeProps {
  tagName?: string;
  tagColor?: string;
}

const TagBadge: FC<TagBadgeProps> = ({ tagName, tagColor }) => {

  if (!tagName) {
    return <div style={{ width: "100px" }}></div>;
  }

  return (
    <div
      className="p-1 rounded-lg flex flex-row items-center justify-center text-neutral-200"
      style={{ backgroundColor: tagColor ?? "#2F3B51", minWidth: "100px" }}
    >
      {tagName}
    </div>
  );
};

export default TagBadge;
