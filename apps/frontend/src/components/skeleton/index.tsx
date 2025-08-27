import { FC } from "react";
import Skeleton from "@mui/material/Skeleton";

interface SkeletonProps {
  variant?: "text" | "rectangular" | "circular";
  width?: number | string;
  height?: number | string;
  className?: string;
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

interface ChartSkeletonProps {
  width?: number;
  height?: number;
}

export const SkeletonLoader: FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  className = "",
}) => {
  return (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      className={`bg-gray-600 ${className}`}
      animation="wave"
    />
  );
};

export const TableSkeleton: FC<TableSkeletonProps> = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="flex gap-4 mb-4">
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonLoader
            key={`header-${index}`}
            variant="rectangular"
            width={120}
            height={24}
            className="flex-1"
          />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 mb-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonLoader
              key={`cell-${rowIndex}-${colIndex}`}
              variant="rectangular"
              width={120}
              height={20}
              className="flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: FC<ChartSkeletonProps> = ({ width = 400, height = 200 }) => {
  return (
    <div className="flex justify-center items-center">
      <SkeletonLoader
        variant="rectangular"
        width={width}
        height={height}
        className="rounded-lg"
      />
    </div>
  );
};

export const TransactionCardSkeleton: FC = () => {
  return (
    <div className="flex flex-row gap-4 justify-between items-center p-3 border-b border-gray-700">
      <SkeletonLoader variant="text" width={200} height={20} />
      <SkeletonLoader variant="rectangular" width={80} height={24} className="rounded-full" />
      <SkeletonLoader variant="text" width={100} height={20} />
      <SkeletonLoader variant="text" width={60} height={20} />
    </div>
  );
};

export const DashboardSkeleton: FC = () => {
  return (
    <div className="flex w-full h-full flex-col gap-6">
      <div className="flex justify-evenly flex-col lg:flex-row gap-6">
        <ChartSkeleton width={400} height={200} />
        <div className="flex flex-col gap-4 bg-md-gray rounded-lg p-4 max-h-[50vh] overflow-y-auto">
          <SkeletonLoader variant="text" width={150} height={24} />
          {Array.from({ length: 5 }).map((_, index) => (
            <TransactionCardSkeleton key={index} />
          ))}
        </div>
      </div>
      <ChartSkeleton width={400} height={200} />
    </div>
  );
};
