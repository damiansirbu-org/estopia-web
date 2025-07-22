import type { Notification } from '../types/models';

export interface ErrorContextType {
    notification: Notification | null;
    loading: boolean;
    showError: (message: string) => void;
    showSuccess: (message: string) => void;
    showInfo: (message: string) => void;
    clearNotification: () => void;
    withErrorHandling: <T>(asyncFunction: () => Promise<T>, successMessage?: string | null) => Promise<T>;
} 