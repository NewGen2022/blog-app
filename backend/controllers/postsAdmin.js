const { createPostDB } = require('../db/queries');

const getAllPosts = () => {};
const getAllDraftPosts = () => {};
const getPost = () => {};

const createPost = async (req, res) => {
    const { name, content, postStatus, authorId, tags } = req.body;

    // Validate required fields
    if (!name || !content || !postStatus || !authorId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure tags is an array
    if (tags && !Array.isArray(tags)) {
        return res.status(400).json({ message: 'Tags must be an array' });
    }

    try {
        const normalizedTags = tags ? tags.map((tag) => tag.toLowerCase()) : [];

        await createPostDB(name, content, postStatus, authorId, normalizedTags);
        res.status(201).json({ message: 'Post created successfully' });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({
            message: 'Failed to create post',
            error: err.message,
        });
    }
};

const updatePost = () => {};
const updatePostStatus = () => {};
const deletePost = () => {};

module.exports = {
    getAllPosts,
    getAllDraftPosts,
    getPost,
    createPost,
    updatePost,
    updatePostStatus,
    deletePost,
};
