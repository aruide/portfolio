import { useState, useEffect } from 'react';

const TOAST_LIMIT = 1;

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
}

interface ToastItem extends ToastProps {
  id: string;
  dismiss: () => void;
}

interface ToastState {
  toasts: ToastItem[];
}

type StateUpdater = ((state: ToastState) => ToastState) | Partial<ToastState>;

let count = 0;
function generateId(): string {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastStore = {
  state: { toasts: [] as ToastItem[] },
  listeners: [] as Array<(state: ToastState) => void>,

  getState: (): ToastState => toastStore.state,

  setState: (nextState: StateUpdater): void => {
    if (typeof nextState === 'function') {
      toastStore.state = nextState(toastStore.state);
    } else {
      toastStore.state = { ...toastStore.state, ...nextState };
    }
    toastStore.listeners.forEach((listener) => listener(toastStore.state));
  },

  subscribe: (listener: (state: ToastState) => void): (() => void) => {
    toastStore.listeners.push(listener);
    return () => {
      toastStore.listeners = toastStore.listeners.filter((l) => l !== listener);
    };
  },
};

export const toast = (props: Omit<ToastProps, 'id'>) => {
  const id = generateId();

  const update = (newProps: Partial<ToastProps>) =>
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...newProps } : t)),
    }));

  const dismiss = () =>
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => t.id !== id),
    }));

  toastStore.setState((state) => ({
    ...state,
    toasts: [{ ...props, id, dismiss }, ...state.toasts].slice(0, TOAST_LIMIT),
  }));

  return { id, dismiss, update };
};

export function useToast() {
  const [state, setState] = useState<ToastState>(toastStore.getState());

  useEffect(() => {
    return toastStore.subscribe((newState) => setState(newState));
  }, []);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    state.toasts.forEach((t) => {
      if (t.duration === Infinity) return;

      const timeout = setTimeout(() => {
        t.dismiss();
      }, t.duration ?? 5000);

      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [state.toasts]);

  return { toast, toasts: state.toasts };
}
