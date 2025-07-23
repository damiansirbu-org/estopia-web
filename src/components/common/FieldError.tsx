import type { ApiFieldError } from '../../utils/ErrorHandler';

interface FieldErrorProps {
    field: string;
    errors?: ApiFieldError[];
}

export default function FieldError({ field, errors }: FieldErrorProps) {
    if (!errors) return null;
    const error = errors.find(e => e.field === field);
    if (!error) return null;
    return (
        <div className="text-xs text-red-500 mt-1 ml-1 font-mono">{error.message}</div>
    );
} 