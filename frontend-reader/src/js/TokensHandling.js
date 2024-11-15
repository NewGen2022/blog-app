import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new Error('Please log in again!');
    const {
        data: { accessToken },
    } = await axios.post('http://localhost:2020/api/auth/refresh', {
        token: refreshToken,
    });
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
};

const isTokenExpired = (token) => {
    if (!token) return true;
    const { exp } = jwtDecode(token);
    return exp < Math.floor(Date.now() / 1000);
};

const checkAndRefreshToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!accessToken || !refreshToken || isTokenExpired(accessToken)) {
        return await refreshAccessToken(refreshToken);
    }
    return accessToken;
};

export { checkAndRefreshToken, isTokenExpired, refreshAccessToken };
