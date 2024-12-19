const {
    getAllPostsDB,
    createPostDB,
    createCommentDB,
    createTagDB,
    getCommentsDB,
    getPostDB,
    getTagsDB,
    updatePostDB,
    updatePostStatusDB,
    deletePostDB,
    deleteCommentDB,
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

const getAllDraftPosts = async (req, res) => {
    try {
        const posts = await getAllPostsDB('DRAFT');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching posts',
            error: err.message,
        });
    }
};

const getPost = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await getPostDB(postId);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({
            message: 'Error getting post',
            error: err.message,
        });
    }
};

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
    const { content, authorId } = req.body;
    const { postId } = req.params;

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

const createTag = async (req, res) => {
    const { tagName } = req.body;

    if (!tagName || tagName.trim() === '') {
        return res.status(400).json({ message: 'Tag name is required' });
    }

    try {
        await createTagDB(tagName);
        res.status(201).json({ message: 'Tag added successfully' });
    } catch (err) {
        if (err.message === 'This tag already exists') {
            return res.status(400).json({
                message: 'This tag already exists',
            });
        }

        res.status(500).json({
            message: 'Error creating tag',
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

const getTags = async (req, res) => {
    try {
        const tags = await getTagsDB();
        res.status(200).json(tags);
    } catch (err) {
        console.error('Error fetching tags:', err);
        res.status(500).send('Server Error');
    }
};

const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { name, content } = req.body;

    try {
        await updatePostDB(postId, name, content);
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
        res.status(500).json({
            message: 'Error updating post',
            error: err.message,
        });
    }
};

const updatePostStatus = async (req, res) => {
    const { postId } = req.params;
    const { postStatus } = req.body;

    try {
        await updatePostStatusDB(postId, postStatus);
        res.status(200).json({ message: 'Post status updated successfully' });
    } catch (err) {
        res.status(500).json({
            message: 'Error updating post status',
            error: err.message,
        });
    }
};

const deletePost = async (req, res) => {
    const { postId } = req.params;

    try {
        await deletePostDB(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting post',
            error: err.message,
        });
    }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        await deleteCommentDB(commentId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting comment',
            error: err.message,
        });
    }
};

module.exports = {
    getAllPosts,
    getAllDraftPosts,
    getPost,
    createPost,
    createTag,
    addComment,
    getComments,
    getTags,
    updatePost,
    updatePostStatus,
    deletePost,
    deleteComment,
};
