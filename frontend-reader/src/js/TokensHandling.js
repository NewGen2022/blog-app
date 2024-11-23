import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new Error('Please log in again!');

    try {
        const {
            data: { accessToken },
        } = await axios.post('http://localhost:2020/api/auth/token', {
            token: refreshToken,
        });

        localStorage.setItem('accessToken', accessToken);

        return accessToken;
    } catch (err) {
        throw new Error('Failed to refresh access token. Please log in again.');
    }
};

const isTokenExpired = (token) => {
    if (!token) return true;
    const { exp } = jwtDecode(token);
    return exp < Math.floor(Date.now() / 1000);
};

export { isTokenExpired, refreshAccessToken };
