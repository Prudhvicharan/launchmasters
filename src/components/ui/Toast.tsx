import { useEffect, useState } from "react";
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
}

export function Toast({
  message,
  type = "info",
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: CheckCircleIcon,
    error: ExclamationTriangleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  };

  const styles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  const Icon = icons[type];

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border shadow-lg
        transition-all duration-300 transform
        ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }
        ${styles[type]}
      `}
    >
      <div className="flex items-start">
        <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-3 text-current hover:opacity-70"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
<<<<<<< HEAD

// Toast Provider Hook (optional)
export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{ id: string; props: ToastProps }>
  >([]);

  const showToast = (props: Omit<ToastProps, "onClose">) => {
    const id = Math.random().toString(36);
    setToasts((prev) => [
      ...prev,
      {
        id,
        props: {
          ...props,
          onClose: () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        },
      },
    ]);
  };

  return { toasts, showToast };
}
=======
>>>>>>> main
