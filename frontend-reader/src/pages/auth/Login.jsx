import { useLocation } from 'react-router-dom';
import AuthErrors from './AuthErrors';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Layout from '../layouts/Layout';

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isRegisteredMsg = location.state?.msg;

    // Check if the user is already logged in
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (accessToken) {
            // Redirect logged-in users away from the login page
            navigate('/', { replace: true });
        }
    }, [accessToken, navigate]);

    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setErrors([]);

        try {
            const response = await axios.post(
                'http://localhost:2020/api/auth/login',
                {
                    username: loginData.username,
                    password: loginData.password,
                }
            );

            const { accessToken, refreshToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            navigate('/', { replace: true });
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || 'An error occurred during login.';
            setErrors([{ msg: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    useEffect(() => {
        if (isRegisteredMsg) {
            setShowSuccessMsg(true);

            // Hide success message after 4 seconds
            const timeout = setTimeout(() => {
                setShowSuccessMsg(false);
            }, 4000);

            return () => clearTimeout(timeout);
        }
    }, [isRegisteredMsg]);

    return (
        <Layout>
            {isRegisteredMsg && showSuccessMsg && (
                <div id="successContainer">
                    <div id="successRegistrationMsg">{isRegisteredMsg}</div>
                    <div id="progressBar"></div>
                </div>
            )}

            <form id="loginForm" className="form" onSubmit={handleLoginSubmit}>
                <div id="formHeader">Login</div>

                {errors.length > 0 ? (
                    <AuthErrors errors={errors} />
                ) : (
                    <div id="horizontal-line"></div>
                )}

                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={loginData.username}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="authBtn" disabled={isLoading}>
                    {isLoading ? (
                        <ClipLoader size={10} color="#36d7b7" />
                    ) : (
                        'Log In'
                    )}
                </button>

                <div className="haveAnAccount">
                    Do not have an account?{' '}
                    <a href="/auth/register">Register</a>
                </div>
            </form>
        </Layout>
    );
};

export default Login;
