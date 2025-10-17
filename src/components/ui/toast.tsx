import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { cn } from '@/utils';
import type { Toast as ToastType } from './use-toast';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300); // Match animation duration
  };

  const variantStyles = {
    success: {
      bg: 'bg-success-green dark:bg-success-green',
      icon: <FaCheckCircle className="w-5 h-5 text-white" />,
    },
    error: {
      bg: 'bg-red-500 dark:bg-red-600',
      icon: <FaExclamationCircle className="w-5 h-5 text-white" />,
    },
    info: {
      bg: 'bg-blue-500 dark:bg-blue-600',
      icon: <FaInfoCircle className="w-5 h-5 text-white" />,
    },
  };

  const { bg, icon } = variantStyles[toast.variant];

  return (
    <div
      className={cn(
        'flex items-start gap-3 min-w-[300px] max-w-[420px] p-4 rounded-lg shadow-lg',
        'transition-all duration-300 ease-out',
        bg,
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">{icon}</div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.description && (
          <p className="text-sm text-white/90">{toast.description}</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
        aria-label="Close notification"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  );
};
