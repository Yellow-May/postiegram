const postRouter = require('express').Router();

const authMiddleware = require('../auth/middleware');
const { GET_FOLLOWING_POSTS, CREATE_POST, GET_USER_POSTS } = require('./controllers');

postRouter.use(authMiddleware);

postRouter.route('/').get(GET_FOLLOWING_POSTS).post(CREATE_POST);

postRouter.get('/:username', GET_USER_POSTS);

module.exports = postRouter;
