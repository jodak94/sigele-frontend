import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle, WarningCircle, X } from '@phosphor-icons/react';

type ToastType = 'success' | 'error';

interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

interface ToastContextValue {
    success: (message: string) => void;
    error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const remove = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const add = useCallback((type: ToastType, message: string) => {
        const id = ++nextId;
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => remove(id), 4000);
    }, [remove]);

    const success = useCallback((message: string) => add('success', message), [add]);
    const error = useCallback((message: string) => add('error', message), [add]);

    return (
        <ToastContext.Provider value={{ success, error }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-bold pointer-events-auto animate-slide-in max-w-sm ${
                            toast.type === 'success'
                                ? 'bg-gray-900 text-white'
                                : 'bg-red-600 text-white'
                        }`}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle size={18} weight="fill" className="shrink-0 text-green-400" />
                        ) : (
                            <WarningCircle size={18} weight="fill" className="shrink-0 text-red-200" />
                        )}
                        <span className="flex-1">{toast.message}</span>
                        <button
                            onClick={() => remove(toast.id)}
                            className="opacity-60 hover:opacity-100 shrink-0"
                        >
                            <X size={14} weight="bold" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
}
