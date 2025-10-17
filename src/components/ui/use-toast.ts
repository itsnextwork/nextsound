import { useState, useCallback } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

// Global state for toasts (using a simple closure pattern)
let toasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...toasts]));
};

export const addToast = (options: ToastOptions) => {
  const id = Math.random().toString(36).substring(2, 9);
  const duration = options.duration ?? 3000;

  const toast: Toast = {
    id,
    title: options.title,
    description: options.description,
    variant: options.variant ?? 'info',
    duration,
  };

  toasts = [...toasts, toast];
  notifyListeners();

  // Auto-dismiss after duration
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
};

export const removeToast = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id);
  notifyListeners();
};

export const useToast = () => {
  const [state, setState] = useState<Toast[]>(toasts);

  // Subscribe to toast updates
  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  // Subscribe on mount
  useState(() => {
    const unsubscribe = subscribe(setState);
    return unsubscribe;
  });

  const toast = useCallback((options: ToastOptions) => {
    return addToast(options);
  }, []);

  const dismiss = useCallback((id: string) => {
    removeToast(id);
  }, []);

  return {
    toasts: state,
    toast,
    dismiss,
  };
};
