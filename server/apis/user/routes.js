const userRouter = require('express').Router();

const authMiddleware = require('../auth/middleware');
const {
	CHECK_AVAILABLE_USERNAME,
	GET_SINGLE_USER,
	GET_ALL_USERS,
	FOLLOW_USER,
	UNFOLLOW_USER,
	GET_FOLLOWERS,
	GET_FOLLOWING,
} = require('./controllers');

userRouter.get('/', authMiddleware, GET_ALL_USERS);

userRouter.post('/confirm-username', CHECK_AVAILABLE_USERNAME);

userRouter.post('/follow', authMiddleware, FOLLOW_USER);

userRouter.post('/unfollow', authMiddleware, UNFOLLOW_USER);

userRouter.get('/followers', authMiddleware, GET_FOLLOWERS);

userRouter.get('/following', authMiddleware, GET_FOLLOWING);

userRouter.get('/:username', authMiddleware, GET_SINGLE_USER);

module.exports = userRouter;
