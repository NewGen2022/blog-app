const prisma = require('./prismaClient');
const bcrypt = require('bcryptjs');

// CREATE QUERIES
const registerDB = async (username, password, role = 'COMMENTATOR') => {
    try {
        // Password hashing
        const hashedPassword = await bcrypt.hash(password, 12);

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
            throw new Error('Error adding user to DB. Username already exists');
        }

        throw new Error('Failed to register user in DB. Please try again!');
    }
};

const createRefreshTokenDB = async (refreshToken, userId) => {
    try {
        const refreshTokenExpiration = new Date();
        refreshTokenExpiration.setDate(refreshTokenExpiration.getDate() + 7); // Set expiration for 7 days

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                expiresAt: refreshTokenExpiration,
                userId: userId,
            },
        });
    } catch (err) {
        console.error('Error saving refresh token:', err);
        throw new Error('Error saving refresh token to database');
    }
};

// GET QUERIES
const getUserByUsernameDB = async (username) => {
    try {
        return await prisma.user.findUnique({
            where: { username: username },
        });
    } catch (err) {
        console.error('Error fetching user by username:', err);
        throw new Error('Error fetching user data');
    }
};

const getRefreshTokenDB = async (refreshToken) => {
    return await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
    });
};

// DELETE QUERIES
const deleteRefreshTokenDB = async (refreshToken) => {
    return await prisma.refreshToken.delete({
        where: { token: refreshToken },
    });
};

module.exports = {
    registerDB,
    getUserByUsernameDB,
    getRefreshTokenDB,
    createRefreshTokenDB,
    deleteRefreshTokenDB,
};
