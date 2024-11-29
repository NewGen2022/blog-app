const {
    getAllPostsDB,
    createPostDB,
    createCommentDB,
    getCommentsDB,
} = require('../db/queries');

const getAllPosts = async (req, res) => {
    try {
        const posts = await getAllPostsDB();
        res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({
            message: 'Error fetching posts',
            error: err.message,
        });
    }
};

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

const addComment = async (req, res) => {
    const { content, authorId, postId } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Missing comment content' });
    }
    if (!authorId) {
        return res.status(400).json({ message: 'Missing author ID' });
    }
    if (!postId) {
        return res.status(400).json({ message: 'Missing post ID' });
    }

    try {
        await createCommentDB(content, authorId, postId);

        res.status(201).json({ message: 'Comment added successfully' });
    } catch (err) {
        res.status(500).json({
            message: 'Error adding comment',
            error: err.message,
        });
    }
};

const getComments = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await getCommentsDB(postId);
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({
            message: 'Error getting comments',
            error: err.message,
        });
    }
};

const updatePost = () => {};
const updatePostStatus = () => {};
const deletePost = () => {};
const deleteComment = () => {};

module.exports = {
    getAllPosts,
    getAllDraftPosts,
    getPost,
    createPost,
    addComment,
    getComments,
    updatePost,
    updatePostStatus,
    deletePost,
    deleteComment,
};
