const prisma = require('./prismaClient');
const bcrypt = require('bcryptjs');

// CREATE QUERIES
const registerUser = async (username, password, role = 'AUTHOR') => {
    try {
        // Password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
                role: role,
            },
        });

        return user;
    } catch (err) {
        console.error('Error creating user:', err);

        if (err.code === 'P2002') {
            throw new Error('Username already exists');
        }

        throw new Error('Failed to register user. Please try again.');
    }
};

module.exports = { registerUser };
