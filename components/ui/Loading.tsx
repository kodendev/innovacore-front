import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
  variant?: "spinner" | "dots" | "skeleton";
}

export const Loading = ({
  size = "md",
  text,
  className,
  variant = "spinner",
}: LoadingProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  if (variant === "spinner") {
    return (
      <div
        className={cn("flex flex-col items-center justify-center", className)}
      >
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
            sizeClasses[size]
          )}
        />
        {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div
        className={cn("flex flex-col items-center justify-center", className)}
      >
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-blue-600 rounded-full animate-bounce",
                size === "sm" ? "h-2 w-2" : "h-3 w-3"
              )}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
      </div>
    );
  }

  // Skeleton variant
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-48 w-full" />
        ))}
      </div>
      {text && <p className="mt-4 text-center text-sm text-gray-600">{text}</p>}
    </div>
  );
};
