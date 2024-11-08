const {
    registerDB,
    getUserByUsernameDB,
    getRefreshTokenDB,
    createRefreshTokenDB,
} = require('../db/queries');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../middleware/auth');

const registerController = async (req, res) => {
    // Handles validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // User registration
        const user = await registerDB(req.body.username, req.body.password);

        // Response
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (err) {
        // Handles different types of errors
        console.error('Registration error:', err);

        if (err.message.includes('Username already exists')) {
            return res.status(409).json({ error: err.message });
        }
        res.status(500).json({
            error: 'Internal server error. Please try again!',
        });
    }
};

const loginController = async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameDB(username);

    if (!user) {
        return res.status(401).json({ error: 'Invalid username' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    try {
        // Generate access and refresh tokens
        const accessToken = generateAccessToken({
            name: username,
            role: user.role,
        });
        const refreshToken = jwt.sign(
            { name: username, role: user.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );
        // Store the refresh token in the database
        await createRefreshTokenDB(refreshToken, user.id);

        res.json({ accessToken, refreshToken });
    } catch (err) {
        console.error('Error saving refresh token:', err);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};

const tokenController = async (req, res) => {
    const { token: refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(403).json({ error: 'Refresh token required' });
    }

    try {
        const storedToken = await getRefreshTokenDB(refreshToken);

        if (!storedToken) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        // Check if the refresh token is expired
        if (storedToken.expiresAt < new Date()) {
            return res.status(403).json({ error: 'Refresh token expired' });
        }

        // Verify the token and generate a new access token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, user) => {
                if (err)
                    return res
                        .status(403)
                        .json({ error: 'Invalid or expired refresh token' });

                const accessToken = generateAccessToken({ name: user.name });
                res.json({ accessToken });
            }
        );
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(500).json({
            error: 'An error occurred during token refresh',
        });
    }
};

module.exports = { registerController, loginController, tokenController };
