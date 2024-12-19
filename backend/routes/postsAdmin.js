const express = require('express');
const router = express.Router();
const {
    getAllPosts,
    getAllDraftPosts,
    getPost,
    createPost,
    createTag,
    updatePost,
    updatePostStatus,
    deletePost,
    getComments,
    getTags,
    addComment,
    deleteComment,
} = require('../controllers/postsAdmin');

router.get('/all', getAllPosts); // get all published posts
router.get('/draft', getAllDraftPosts);
router.get('/tags', getTags);
router.get('/:postId', getPost); // Get a single post by ID (both draft and published)
router.get('/:postId/comments', getComments);

router.post('/', createPost);
router.post('/tag', createTag);
router.post('/:postId/comment', addComment);

router.put('/:postId/status', updatePostStatus); // Only admin can update post status
router.put('/:postId', updatePost); // Update an existing post (both draft and published)

router.delete('/:postId/comment/:commentId', deleteComment); // Only admin can delete comments
router.delete('/:postId', deletePost);

module.exports = router;
