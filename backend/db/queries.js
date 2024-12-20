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

const createTagDB = async (tagName) => {
    const [tag] = await getTagByNameDB([tagName]);
    return tag;
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

const getAllPostsDB = async (status = 'PUBLISHED') => {
    try {
        return await prisma.post.findMany({
            where: { status: status },
            include: {
                _count: { select: { comment: true } },
            },
        });
    } catch (err) {
        console.error('Error fetching all posts:', err);
        throw new Error('Error fetching all posts from DB');
    }
};

const getPostDB = async (postId) => {
    try {
        return await prisma.post.findUnique({
            where: { id: postId },
            include: {
                postTag: {
                    include: {
                        tag: true, // Include the tag data in the result
                    },
                },
            },
        });
    } catch (err) {
        console.error('Error fetching post:', err);
        throw new Error('Error fetching post from DB');
    }
};

const getTagsDB = async () => {
    try {
        return await prisma.tag.findMany();
    } catch (err) {
        console.error('Error fetching tags from DB:', err);
        throw new Error('Error fetching tags from DB');
    }
};

// UPDATE QUERIES
const updatePostDB = async (postId, name, content, status, tags) => {
    try {
        const tagObjects = await getTagByNameDB(tags);

        const post = await prisma.post.update({
            where: { id: postId },
            data: {
                name: name,
                content: content,
                status: status,
                updatedAt: new Date(),
                postTag: {
                    deleteMany: {}, // Clear existing tags
                    create: tagObjects.map((tag) => ({
                        tag: {
                            connect: { id: tag.id },
                        },
                    })),
                },
            },
            include: {
                postTag: {
                    include: {
                        tag: true, // Include tags in the response after update
                    },
                },
            },
        });

        return post;
    } catch (err) {
        console.error('Error updating post:', err);
        throw new Error('Error updating post in DB');
    }
};

const updatePostStatusDB = async (postId, status) => {
    return await prisma.post.update({
        where: { id: postId },
        data: { status: status },
    });
};

// DELETE QUERIES
const deleteRefreshTokenDB = async (refreshToken) => {
    return await prisma.refreshToken.delete({
        where: { token: refreshToken },
    });
};

const deletePostDB = async (postId) => {
    try {
        return await prisma.post.delete({
            where: { id: postId },
        });
    } catch (err) {
        console.error('Error deleting post:', err);
        throw new Error('Error deleting post from DB');
    }
};

const deleteCommentDB = async (commentId) => {
    try {
        return await prisma.comment.delete({
            where: { id: commentId },
        });
    } catch (err) {
        console.error('Error deleting comment:', err);
        throw new Error('Error deleting comment from DB');
    }
};

module.exports = {
    registerDB,
    getUserByUsernameDB,
    getRefreshTokenDB,
    getCommentsDB,
    getAllPostsDB,
    getPostDB,
    getTagsDB,
    getTagByNameDB,
    createRefreshTokenDB,
    createPostDB,
    createCommentDB,
    createTagDB,
    updatePostDB,
    updatePostStatusDB,
    deleteRefreshTokenDB,
    deletePostDB,
    deleteCommentDB,
};
