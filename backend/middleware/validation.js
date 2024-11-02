const { body } = require('express-validator');
const prisma = require('../db/prismaClient');

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

module.exports = { validateRegistration };
