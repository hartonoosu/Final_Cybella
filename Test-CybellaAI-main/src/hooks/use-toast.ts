
import { toast as sonnerToast } from "sonner";

type ToastActionElement = React.ReactElement;

export type ToastVariants = "default" | "destructive" | "warning";

export interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariants;
  action?: ToastActionElement;
}

export const toast = ({ title, description, variant, action }: ToastProps) => {
  sonnerToast(title as string, {
    description,
    action,
    className: variant,
  });
};

export const useToast = () => {
  return {
    toast,
  };
};
