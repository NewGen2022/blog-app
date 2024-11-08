const { body } = require('express-validator');
const prisma = require('../db/prismaClient');
const jwt = require('jsonwebtoken');

// REGISTRATION FUNCTIONS
const validateRegistration = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters long')
        .custom(async (username) => {
            const isUserExists = await prisma.user.findUnique({
                where: { username: username },
            });

            if (isUserExists) {
                throw new Error('Username already exists');
            }
        }),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .custom((password) => {
            const hasUppercase = /[A-Z]/.test(password);
            const hasLowercase = /[a-z]/.test(password);

            if (!hasUppercase) {
                throw new Error(
                    'Password must contain at least one uppercase letter.'
                );
            }

            if (!hasLowercase) {
                throw new Error(
                    'Password must contain at least one lowercase letter.'
                );
            }

            return true;
        }),

    body('confirm_password').custom((confirm_password, { req }) => {
        if (confirm_password !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
];

// LOGIN FUNCTIONS
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ error: 'Invalid token' });
    }
};

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    });
};

module.exports = {
    validateRegistration,
    authenticateToken,
    generateAccessToken,
};
