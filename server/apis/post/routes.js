const postRouter = require('express').Router();

const authMiddleware = require('../auth/middleware');
const {
	GET_FOLLOWING_POSTS,
	CREATE_POST,
	GET_USER_POSTS,
	DELETE_POST,
	TOGGLE_LIKE,
	GET_SINGLE_POST,
	TOGGLE_BOOKMARK,
} = require('./controllers');

postRouter.use(authMiddleware);

postRouter.route('/').get(GET_FOLLOWING_POSTS).post(CREATE_POST);

postRouter.get('/:username', GET_USER_POSTS);

postRouter.get('/:username/:post_id', GET_SINGLE_POST);

postRouter.delete('/:post_id', DELETE_POST);

postRouter.patch('/:post_id/like', TOGGLE_LIKE);

postRouter.patch('/:post_id/bookmark', TOGGLE_BOOKMARK);

module.exports = postRouter;
