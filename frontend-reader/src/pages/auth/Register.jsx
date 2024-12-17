import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthErrors from './AuthErrors';
import { ClipLoader } from 'react-spinners';
import Header from '../layouts/Header';

const Register = () => {
    const navigate = useNavigate();

    // Redirect if the user is already logged in
    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = ({ target: { name, value } }) => {
        setRegisterData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setErrors([]); // Clear any previous errors

        if (registerData.password !== registerData.confirmPassword) {
            setErrors([{ msg: 'Passwords do not match' }]);
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(
                'http://localhost:2020/api/auth/register',
                {
                    username: registerData.username,
                    password: registerData.password,
                    confirm_password: registerData.confirmPassword,
                }
            );

            navigate('/auth/login', { state: { msg: data.message } });
        } catch (err) {
            const errorMessage =
                err.response?.data?.errors ||
                'An error occurred during registration.';
            setErrors(
                Array.isArray(errorMessage)
                    ? errorMessage
                    : [{ msg: errorMessage }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />

            <form
                id="registerForm"
                className="form"
                onSubmit={handleRegisterSubmit}
            >
                <div id="formHeader">Register</div>

                {errors.length > 0 ? (
                    <AuthErrors errors={errors} />
                ) : (
                    <div id="horizontal-line" />
                )}

                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    value={registerData.username}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={handleChange}
                    required
                />

                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="authBtn" disabled={isLoading}>
                    {isLoading ? (
                        <ClipLoader size={10} color="#36d7b7" />
                    ) : (
                        'Register'
                    )}
                </button>

                <div className="haveAnAccount">
                    Already have an account? <a href="/auth/login">Log In</a>
                </div>
            </form>
        </>
    );
};

export default Register;
