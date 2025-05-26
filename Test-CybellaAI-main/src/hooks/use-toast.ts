
import { toast as sonnerToast } from "sonner";

type ToastActionElement = React.ReactElement;

export type ToastVariants = "default" | "destructive" | "warning";

export interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariants;
  action?: ToastActionElement;
  duration?: number;
}

export const toast = ({ title, description, variant, action, duration }: ToastProps) => {
  sonnerToast(title as string, {
    description,
    action,
    className: variant,
    duration: duration ?? 2000,
  });
};

export const useToast = () => {
  return {
    toast,
  };
};
