const prisma = require('./prismaClient');

// CREATE QUERIES
const registerUser = async (username, password, role = 'AUTHOR') => {
    try {
        const user = await prisma.user.create({
            data: {
                username: username,
                password: password,
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
