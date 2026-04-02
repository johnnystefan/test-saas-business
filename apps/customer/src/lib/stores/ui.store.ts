import { create } from 'zustand';

type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface UiState {
  toasts: Toast[];
}

interface UiActions {
  addToast: (params: { message: string; variant: ToastVariant }) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>()((set) => ({
  toasts: [],
  addToast: ({ message, variant }) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message, variant }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));
