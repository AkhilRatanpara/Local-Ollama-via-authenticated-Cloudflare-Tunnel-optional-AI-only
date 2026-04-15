"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
}

interface ToastContextProps {
    toast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextProps>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const toast = useCallback((type: ToastType, title: string, message?: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, title, message }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertCircle className="w-5 h-5 text-orange-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };

    const bgStyles = {
        success: "border-green-200 bg-green-50/90",
        error: "border-red-200 bg-red-50/90",
        warning: "border-orange-200 bg-orange-50/90",
        info: "border-blue-200 bg-blue-50/90"
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[200] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className={`pointer-events-auto p-4 rounded-2xl border shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md flex items-start gap-3 min-w-[280px] max-w-sm ${bgStyles[t.type]}`}
                        >
                            <div className="flex-shrink-0 mt-0.5">{icons[t.type]}</div>
                            <div className="flex-1">
                                <h4 className={`text-sm font-bold ${
                                    t.type === 'success' ? 'text-green-900' :
                                    t.type === 'error' ? 'text-red-900' :
                                    t.type === 'warning' ? 'text-orange-900' :
                                    'text-blue-900'
                                }`}>{t.title}</h4>
                                {t.message && (
                                    <p className="text-xs font-medium mt-1 opacity-80 text-slate-700">{t.message}</p>
                                )}
                            </div>
                            <button 
                                onClick={() => removeToast(t.id)} 
                                className="flex-shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors text-slate-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
