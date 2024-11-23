import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../styles/header.css';
import axios from 'axios';

const Header = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                setUser({
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
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();

        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            try {
                await axios.post('http://localhost:2020/api/auth/logout', {
                    refreshToken: refreshToken,
                });

                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                setUser(null);
            } catch (err) {
                console.error('Error logging out:', err);
            }
        } else {
            console.log('No refresh token found');
        }
    };

    return (
        <div id="header">
            <a id="headerLeftPart" href="/">
                Inc&Code
                <img id="headerIcon" src="../../public/quill.png" />
            </a>

            <div id="headerRightPart">
                <div id="headerLoginStatus">
                    {user ? `Welcome, ${user.username}` : 'Not logged in'}
                </div>
                <div id="headerAuthActions">
                    {user ? (
                        <a href="/" id="headerLogout" onClick={handleLogout}>
                            <img
                                src="../../public/logout.png"
                                alt="Logout Icon"
                            />
                            Logout
                        </a>
                    ) : (
                        <>
                            <a href="/auth/login" id="headerLogin">
                                <img
                                    src="../../public/login.png"
                                    alt="Login Icon"
                                />
                                Log In
                            </a>
                            <a href="/auth/register" id="headerRegister">
                                <img
                                    src="../../public/register.png"
                                    alt="Register Icon"
                                />
                                Register
                            </a>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
