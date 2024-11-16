import { useLocation } from 'react-router-dom';
import AuthErrors from './AuthErrors';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Header from '../Header';

const Login = () => {
    const location = useLocation();
    const isRegisteredMsg = location.state?.msg;

    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

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

            navigate('/');
        } catch (err) {
            if (err.response) {
                if (err.response.data.error) {
                    setErrors([
                        {
                            msg: err.response.data.error,
                        },
                    ]);
                } else {
                    setErrors([
                        {
                            msg: 'An error occurred during log in.',
                        },
                    ]);
                }
            } else {
                setErrors([{ msg: 'Network error or server not reachable.' }]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    return (
        <>
            <Header />

            {isRegisteredMsg && <div>{isRegisteredMsg}</div>}

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
        </>
    );
};

export default Login;
