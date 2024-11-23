const express = require('express');
const router = express.Router();
const {
    getAllPosts,
    getAllDraftPosts,
    getPost,
    createPost,
    updatePost,
    updatePostStatus,
    deletePost,
} = require('../controllers/postsAdmin');

router.get('/all', getAllPosts); // get all published posts
router.get('/draft', getAllDraftPosts);
router.get('/:postId', getPost); // Get a single post by ID (both draft and published)

router.post('/', createPost);

router.put('/:postId', updatePost); // Update an existing post (both draft and published)
router.put('/:postId/status', updatePostStatus);

router.delete('/:postId', deletePost);

module.exports = router;
