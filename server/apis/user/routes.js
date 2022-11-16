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
	CHANGE_PROFILE_PIC,
	SEARCH_USERS,
	GET_BOT_USERS,
} = require('./controllers');

userRouter.get('/', authMiddleware, GET_ALL_USERS);
userRouter.get('/search', authMiddleware, SEARCH_USERS);
userRouter.get('/bots', authMiddleware, GET_BOT_USERS);

userRouter.post('/confirm-username', CHECK_AVAILABLE_USERNAME);
userRouter.patch('/follow', authMiddleware, FOLLOW_USER);
userRouter.patch('/unfollow', authMiddleware, UNFOLLOW_USER);
userRouter.patch('/update-profile-pic', authMiddleware, CHANGE_PROFILE_PIC);

userRouter.get('/:username', authMiddleware, GET_SINGLE_USER);
userRouter.get('/:username/followers', authMiddleware, GET_FOLLOWERS);
userRouter.get('/:username/following', authMiddleware, GET_FOLLOWING);

module.exports = userRouter;
