import { useState, useEffect } from 'react';

const useAlert = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 5000);

            return () => clearTimeout(timer); // Cleanup on unmount
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 5000);

            return () => clearTimeout(timer); // Cleanup on unmount
        }
    }, [errorMessage]);

    return { successMessage, setSuccessMessage, errorMessage, setErrorMessage };
};

export default useAlert;
