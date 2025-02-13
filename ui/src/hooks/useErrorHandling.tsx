import { useState } from 'react';

interface BackendError {
    error: string;
}

const useErrorHandling = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Function to set the error message
    const handleError = (error: unknown) => {
        if (error && (error as any).response) {
            const err = error as { response: { data: BackendError } };
            setErrorMessage(err.response.data.error || 'An error occurred. Please try again.');
        } else {
            setErrorMessage('An unexpected error occurred.');
        }
    };

    // Function to clear the error message
    const clearError = () => {
        setErrorMessage(null);
    };

    return { errorMessage, handleError, clearError };
};

export default useErrorHandling;