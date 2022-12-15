const userRouter = require('express').Router();

const authMiddleware = require('../auth/middleware');
const {
	CHECK_AVAILABLE_USERNAME,
	GET_USERS,
	GET_USER,
	UPDATE_USER_PROFILE,
	TOGGLE_FOLLOW,
} = require('./controllers');

userRouter.route('/confirm-username').post(CHECK_AVAILABLE_USERNAME);

userRouter.use(authMiddleware);
userRouter.route('/').get(GET_USERS);
userRouter.route('/toggle-follow').patch(TOGGLE_FOLLOW);
userRouter.route('/update-profile').patch(UPDATE_USER_PROFILE);
userRouter.route('/:username').get(GET_USER);

module.exports = userRouter;
