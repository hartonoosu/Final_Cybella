import React, { useEffect, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, Bell, CheckCircle, Info, XCircle } from "lucide-react";

const animatedAlertVariants = cva(
  "fixed top-4 right-4 z-[100] w-80 rounded-lg shadow-lg border p-4 transition-all duration-1000 flex items-center gap-3",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-blue-400 text-white border-blue-700",
        success: "bg-gradient-to-r from-white to-gray-100 text-gray-800 border-gray-200",
        warning: "bg-gradient-to-r from-amber-600 to-amber-400 text-white border-amber-700",
        error: "bg-gradient-to-r from-red-600 to-red-400 text-white border-red-700",
        info: "bg-gradient-to-r from-therapeutic-dark to-therapeutic-calm text-white border-therapeutic-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type AnimatedAlertProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof animatedAlertVariants> & {
    title?: React.ReactNode;
    message: string;
    onClose?: () => void;
    autoClose?: boolean;
    duration?: number;
  };

export function AnimatedAlert({
  className,
  variant,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 8000,
  ...props
}: AnimatedAlertProps) {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [gradientPosition, setGradientPosition] = useState(0);

  useEffect(() => {
    // Animation for gradient
    const gradientInterval = setInterval(() => {
      setGradientPosition((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 80);

    // Auto close timer
    let closeTimer: ReturnType<typeof setTimeout>;
    if (autoClose) {
      closeTimer = setTimeout(() => {
        setOpacity(0);
        setTimeout(() => {
          setVisible(false);
          if (onClose) onClose();
        }, 500);
      }, duration);
    }

    return () => {
      clearInterval(gradientInterval);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [autoClose, duration, onClose]);

  if (!visible) return null;

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "warning":
        return <AlertCircle className="h-5 w-5" />;
      case "error":
        return <XCircle className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const style = {
    opacity,
    backgroundPosition: `${gradientPosition}% 50%`,
    backgroundSize: "200% 100%",
    transition: "opacity 0.5s ease, transform 0.5s ease",
    transform: opacity === 1 ? "translateY(0)" : "translateY(-20px)",
  };

  return (
    <div
      className={cn(animatedAlertVariants({ variant }), "animate-fade-in", className)}
      style={style}
      role="alert"
      {...props}
    >
      <div className="shrink-0">{getIcon()}</div>
      <div className="flex-1">
        {title && <h4 className="font-medium">{title}</h4>}
        <p className="text-sm opacity-90">{message}</p>
      </div>
      <button
        onClick={() => {
          setOpacity(0);
          setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
          }, 500);
        }}
        className="shrink-0 rounded-full p-1 transition-colors hover:bg-black/10"
        aria-label="Close"
      >
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
}