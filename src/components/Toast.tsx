import { X } from "lucide-react";
import { useEffect } from "react";

type ToastProps = {
  message: string | null;
  onClose: () => void;
};

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onClose, 3600);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="toast" role="status">
      <span>{message}</span>
      <button type="button" onClick={onClose} title="Dismiss">
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
