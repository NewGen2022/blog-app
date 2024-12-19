import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                setUser({
                    id: decodedToken.id,
                    username: decodedToken.name,
                    role: decodedToken.role,
                });
            } catch (err) {
                console.error('Error decoding token:', err);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    return { user, loading };
};

export default useAuth;
