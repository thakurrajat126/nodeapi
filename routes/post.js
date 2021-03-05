const express = require('express');
const postController = require('../controllers/post.js');
const validator = require('../helpers/validator')
const {authRequired} = require('../controllers/auth'); 
 

const postRouter = express.Router();

postRouter.get('/post/getpost',postController.getPosts);
postRouter.get('/post/getmyposts',authRequired,postController.getPostsByRequestingUser);
postRouter.get('/post/by/:userId',authRequired,postController.getPostsByUser);
postRouter.post('/post/addpost',authRequired,postController.createPost);
postRouter.delete('/post/delete/:postId',authRequired,postController.deletePost);
postRouter.post('/post/update/:postId',authRequired,postController.updatePost);


module.exports = {postRouter};