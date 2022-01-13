const express = require('express');
const postController = require('../controllers/post');
const router = express.Router();
const { verifyToken } = require('../midware/authMidWare');

const use = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post('/posts/new', verifyToken, use(postController.createPost));
router.get('/posts/:id', use(postController.getPost));
router.delete('/posts/:id', verifyToken, use(postController.deletePost));
router.put('/posts/:id', verifyToken, use(postController.updatePost));
router.get('/posts', use(postController.all));


module.exports = router;