import { FC } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: FC<EmptyStateProps> = ({
  title = "Nothing here yet",
  description = "There is no data to display.",
  action,
}) => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="flex flex-col items-center text-center gap-3 bg-md-gray/40 rounded-lg p-6 border border-neutral-700">
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-neutral-400 max-w-md">{description}</div>
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </div>
  );
};

export default EmptyState;


