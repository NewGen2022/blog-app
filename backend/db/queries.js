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

const createPostDB = async (name, content, status, authorId, tags) => {
    try {
        // First, ensure all tags exist, create them if they don't
        const tagObjects = await getTagByNameDB(tags);

        // Create post with tag connections using IDs
        const post = await prisma.post.create({
            data: {
                name: name,
                content: content,
                status: status,
                authorId: authorId,
                postTag: {
                    create: tagObjects.map((tag) => ({
                        tag: {
                            connect: {
                                id: tag.id,
                            },
                        },
                    })),
                },
            },
        });

        return post;
    } catch (err) {
        console.error('Error creating post:', err);
        throw new Error('Error creating post in DB');
    }
};

const createCommentDB = async (content, authorId, postId) => {
    try {
        return await prisma.comment.create({
            data: {
                text: content,
                userId: authorId,
                postId: postId,
            },
        });
    } catch (err) {
        console.error('Error creating comment:', err);
        throw new Error('Error creating comment in DB');
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

const getTagByNameDB = async (tags) => {
    try {
        const tagObjects = await Promise.all(
            tags.map((tag) => {
                return prisma.tag.upsert({
                    where: { name: tag },
                    update: {},
                    create: { name: tag },
                });
            })
        );

        return tagObjects;
    } catch (err) {
        console.error('Error fetching tags:', err);
        throw new Error('Error fetching tags from DB');
    }
};

const getCommentsDB = async (postId) => {
    try {
        return await prisma.comment.findMany({
            where: { postId: postId },
        });
    } catch (err) {
        console.error('Error fetching comments:', err);
        throw new Error('Error fetching comments from DB');
    }
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
    getCommentsDB,
    createRefreshTokenDB,
    createPostDB,
    createCommentDB,
    deleteRefreshTokenDB,
};
