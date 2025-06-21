import * as React from "react";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";
import { Progress } from "@/components/ui/progress";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: "default" | "primary" | "secondary" | "accent";
  variant?: "border" | "dots" | "pulse" | "lottie";
  animationData?: any; // For Lottie animation data
  label?: string;
}

export function Spinner({
  size = "md",
  color = "primary",
  variant = "border",
  label,
  className,
  animationData,
  ...props
}: SpinnerProps) {
  // Size mappings
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  // Color mappings
  const colorClasses = {
    default: "text-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-blue-500",
  };

  // Border variant
  if (variant === "border") {
    return (
      <div
        className={cn("flex flex-col items-center justify-center", className)}
        role="status"
        aria-label={label || "Loading"}
        {...props}
      >
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-t-transparent",
            sizeClasses[size],
            {
              "border-foreground/20 border-t-transparent": color === "default",
              "border-primary/20 border-t-primary": color === "primary",
              "border-secondary/20 border-t-secondary": color === "secondary",
              "border-blue-300/30 border-t-blue-500": color === "accent",
            }
          )}
        />
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }

  // Dots variant
  if (variant === "dots") {
    return (
      <div
        className={cn("flex items-center justify-center gap-1", className)}
        role="status"
        aria-label={label || "Loading"}
        {...props}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "animate-pulse rounded-full",
              {
                "h-1.5 w-1.5": size === "sm",
                "h-2.5 w-2.5": size === "md",
                "h-3.5 w-3.5": size === "lg",
              },
              colorClasses[color]
            )}
            style={{
              animationDelay: `${i * 150}ms`,
            }}
          />
        ))}
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }
  // Lottie variant
  if (variant === "lottie" && animationData) {
    return (
      <div
        className={cn("flex flex-col items-center justify-center", className)}
        role="status"
        aria-label={label || "Loading"}
        {...props}
      >
        <div
          className={cn({
            "h-16 w-16": size === "sm",
            "h-32 w-32": size === "md",
            "h-48 w-48": size === "lg",
          })}
        >
          <Lottie animationData={animationData} loop={true} />
        </div>
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }

  // Pulse variant (default fallback)
  return (
    <div
      className={cn("flex flex-col items-center justify-center", className)}
      role="status"
      aria-label={label || "Loading"}
      {...props}
    >
      <div
        className={cn(
          "animate-pulse rounded-full",
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}

export function AnimatedProgress({
  className
}: {
  className?: string;
}) {
  const [progress, setProgress] = React.useState(0);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          return 0;
        }
        return Math.min(prevProgress + 2, 100);
      });
    }, 50);
    
    return () => clearTimeout(timer);
  }, [progress]);
  
  return (
    <div className={cn("w-full max-w-xs", className)}>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

export function LottieSpinner({ 
  animationData, 
  size = "md",
  message,
  className,
  showProgressBar = false
}: { 
  animationData: any;
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
  showProgressBar?: boolean;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Spinner 
        variant="lottie" 
        size={size} 
        animationData={animationData}
      />
      {showProgressBar && (
        <div className="mt-4 w-full max-w-xs">
          <AnimatedProgress />
        </div>
      )}
      {message && !showProgressBar && <p className="text-muted-foreground text-sm mt-4">{message}</p>}
    </div>
  );
}

export function PageSpinner({ 
  message = "Loading...",
  animationData,
  showProgressBar = true
}: { 
  message?: string;
  animationData?: any;
  showProgressBar?: boolean;
}) {
  // If animation data is provided, use the Lottie spinner
  if (animationData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full fixed inset-0 z-50 bg-background">
        <LottieSpinner 
          animationData={animationData} 
          size="lg" 
          message={message}
          showProgressBar={showProgressBar} 
        />
      </div>
    );
  }
    // Fallback to the regular spinner with progress bar
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full fixed inset-0 z-50 bg-background space-y-4">
      <Spinner size="lg" color="accent" />
      {showProgressBar ? (
        <div className="mt-4 w-full max-w-xs">
          <AnimatedProgress />
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">{message}</p>
      )}
    </div>
  );
}
