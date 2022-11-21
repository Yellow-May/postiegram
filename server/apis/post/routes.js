const postRouter = require('express').Router();

const authMiddleware = require('../auth/middleware');
const {
	CREATE_POST,
	DELETE_POST,
	GET_POSTS,
	GET_POST,
	UPDATE_POST_TOGGLE,
} = require('./controllers');

postRouter.use(authMiddleware);

postRouter.route('/').get(GET_POSTS).post(CREATE_POST);

postRouter.route('/:post_id').get(GET_POST).delete(DELETE_POST);

postRouter.patch('/:post_id/toggle', UPDATE_POST_TOGGLE);

module.exports = postRouter;
