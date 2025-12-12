import React, { useState, createContext, useContext, useCallback } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle, Info, Loader2 } from 'lucide-react';

// Tipos de notificación
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

interface NotificationContextType {
    showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
    showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

// Iconos por tipo
const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

// Colores por tipo
const colors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColors = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
};

// Componente Toast
const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
    const Icon = icons[toast.type];

    React.useEffect(() => {
        if (toast.duration) {
            const timer = setTimeout(onClose, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.duration, onClose]);

    return (
        <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${colors[toast.type]} animate-in slide-in-from-right-5 fade-in duration-300`}>
            <Icon size={20} className={iconColors[toast.type]} />
            <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{toast.title}</p>
                {toast.message && (
                    <p className="text-xs opacity-80 mt-0.5">{toast.message}</p>
                )}
            </div>
            <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
                <X size={14} />
            </button>
        </div>
    );
};

// Modal de Confirmación
const ConfirmModal: React.FC<{
    options: ConfirmOptions | null;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ options, onConfirm, onCancel }) => {
    if (!options) return null;

    const typeColors = {
        danger: { bg: 'bg-red-50', icon: 'text-red-500', button: 'bg-red-600 hover:bg-red-700' },
        warning: { bg: 'bg-amber-50', icon: 'text-amber-500', button: 'bg-amber-600 hover:bg-amber-700' },
        info: { bg: 'bg-blue-50', icon: 'text-blue-500', button: 'bg-blue-600 hover:bg-blue-700' },
    };

    const colors = typeColors[options.type || 'warning'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header con icono */}
                <div className={`${colors.bg} p-6 text-center`}>
                    <div className={`w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4`}>
                        <AlertTriangle size={32} className={colors.icon} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800">{options.title}</h3>
                </div>

                {/* Contenido */}
                <div className="p-6">
                    <p className="text-sm text-slate-600 text-center leading-relaxed">
                        {options.message}
                    </p>
                </div>

                {/* Botones */}
                <div className="flex gap-3 p-4 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                        {options.cancelText || 'Cancelar'}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-3 px-4 text-white rounded-xl font-bold text-sm transition-colors ${colors.button}`}
                    >
                        {options.confirmText || 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Provider
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);
    const [confirmResolve, setConfirmResolve] = useState<((value: boolean) => void) | null>(null);

    const showToast = useCallback((type: ToastType, title: string, message?: string, duration: number = 4000) => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, type, title, message, duration }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise(resolve => {
            setConfirmOptions(options);
            setConfirmResolve(() => resolve);
        });
    }, []);

    const handleConfirm = useCallback(() => {
        confirmResolve?.(true);
        setConfirmOptions(null);
        setConfirmResolve(null);
    }, [confirmResolve]);

    const handleCancel = useCallback(() => {
        confirmResolve?.(false);
        setConfirmOptions(null);
        setConfirmResolve(null);
    }, [confirmResolve]);

    return (
        <NotificationContext.Provider value={{ showToast, showConfirm }}>
            {children}

            {/* Container de Toasts */}
            <div className="fixed top-4 right-4 z-[90] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
                    </div>
                ))}
            </div>

            {/* Modal de Confirmación */}
            <ConfirmModal
                options={confirmOptions}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </NotificationContext.Provider>
    );
};
