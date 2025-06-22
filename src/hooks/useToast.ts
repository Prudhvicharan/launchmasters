import { useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
}

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
