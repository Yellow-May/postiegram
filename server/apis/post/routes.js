const postRouter = require('express').Router();

const authMiddleware = require('../auth/middleware');
const {
	GET_FOLLOWING_POSTS,
	CREATE_POST,
	GET_USER_POSTS,
	DELETE_POST,
	TOGGLE_LIKE,
	GET_SINGLE_POST,
} = require('./controllers');

postRouter.use(authMiddleware);

postRouter.route('/').get(GET_FOLLOWING_POSTS).post(CREATE_POST);

postRouter.route('/like').post(TOGGLE_LIKE);

postRouter.get('/:username', GET_USER_POSTS);

postRouter.get('/:username/:post_id', GET_SINGLE_POST);

postRouter.delete('/:post_id', DELETE_POST);

module.exports = postRouter;
