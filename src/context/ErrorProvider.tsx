import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import type { ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import type { Notification } from '../types/models';
import { ErrorContext } from './ErrorContext';
import type { ErrorContextType } from './ErrorContextTypes';

interface NotificationBannerProps {
    notification: Notification;
    onClose: () => void;
}

function NotificationBanner({ notification, onClose }: NotificationBannerProps) {
    if (!notification) return null;

    const getStyles = () => {
        switch (notification.type) {
            case 'error':
                return {
                    container: 'bg-red-50 border-red-200',
                    icon: 'text-red-400',
                    title: 'text-red-800',
                    message: 'text-red-700',
                    button: 'bg-red-50 text-red-500 hover:bg-red-100'
                };
            case 'success':
                return {
                    container: 'bg-green-50 border-green-200',
                    icon: 'text-green-400',
                    title: 'text-green-800',
                    message: 'text-green-700',
                    button: 'bg-green-50 text-green-500 hover:bg-green-100'
                };
            case 'info':
                return {
                    container: 'bg-blue-50 border-blue-200',
                    icon: 'text-blue-400',
                    title: 'text-blue-800',
                    message: 'text-blue-700',
                    button: 'bg-blue-50 text-blue-500 hover:bg-blue-100'
                };
            default:
                return {
                    container: 'bg-gray-50 border-gray-200',
                    icon: 'text-gray-400',
                    title: 'text-gray-800',
                    message: 'text-gray-700',
                    button: 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                };
        }
    };

    const getIcon = (): React.ReactNode => {
        const styles = getStyles();
        switch (notification.type) {
            case 'error':
                return <AlertCircle className={`h-5 w-5 ${styles.icon}`} />;
            case 'success':
                return <CheckCircle className={`h-5 w-5 ${styles.icon}`} />;
            case 'info':
                return <Info className={`h-5 w-5 ${styles.icon}`} />;
            default:
                return <AlertCircle className={`h-5 w-5 ${styles.icon}`} />;
        }
    };

    const styles = getStyles();

    return (
        <div className={`border rounded-md p-4 mb-6 ${styles.container}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="ml-3">
                    <h3 className={`text-sm font-medium ${styles.title}`}>
                        {notification.type === 'error' ? 'Error' :
                            notification.type === 'success' ? 'Success' : 'Information'}
                    </h3>
                    <div className={`mt-2 text-sm ${styles.message}`}>
                        <p>{notification.message}</p>
                    </div>
                </div>
                <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                        <button
                            onClick={onClose}
                            className={`inline-flex rounded-md p-1.5 ${styles.button}`}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ErrorProviderProps {
    children: ReactNode;
}

export default function ErrorProvider({ children }: ErrorProviderProps) {
    const [notification, setNotification] = useState<Notification | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const showError = useCallback((message: string): void => {
        setNotification({ type: 'error', message });
    }, []);

    const showSuccess = useCallback((message: string): void => {
        setNotification({ type: 'success', message });
    }, []);

    const showInfo = useCallback((message: string): void => {
        setNotification({ type: 'info', message });
    }, []);

    const clearNotification = useCallback((): void => {
        setNotification(null);
    }, []);

    const withErrorHandling = useCallback(async <T,>(
        asyncFunction: () => Promise<T>,
        successMessage: string | null = null
    ): Promise<T> => {
        try {
            setLoading(true);
            clearNotification();
            const result = await asyncFunction();
            if (successMessage) {
                showSuccess(successMessage);
            }
            return result;
        } catch (error: unknown) {
            if (
                error &&
                typeof error === 'object' &&
                'message' in error &&
                typeof (error as Record<string, unknown>).message === 'string'
            ) {
                showError((error as { message: string }).message);
            } else {
                showError('An unexpected error occurred');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, [showError, showSuccess, clearNotification]);

    const value: ErrorContextType = useMemo(() => ({
        notification,
        loading,
        showError,
        showSuccess,
        showInfo,
        clearNotification,
        withErrorHandling
    }), [notification, loading, showError, showSuccess, showInfo, clearNotification, withErrorHandling]);

    return (
        <ErrorContext.Provider value={value}>
            <div className="min-h-screen bg-gray-100">
                {children}
                {notification && (
                    <div className="fixed top-4 right-4 max-w-md z-50">
                        <NotificationBanner
                            notification={notification}
                            onClose={clearNotification}
                        />
                    </div>
                )}
            </div>
        </ErrorContext.Provider>
    );
} 