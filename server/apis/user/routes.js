const userRouter = require('express').Router();

const { StatusCodes } = require('http-status-codes');
const { UnAcceptableError } = require('../../utils/custom-errors');
const UserModel = require('./model');
const authMiddleware = require('../auth/middleware');

userRouter.get('/', authMiddleware, async (_req, res) => {
	const users = await UserModel.find({ role: 2001 })
		.select('email username img')
		.sort({ createdAt: 'desc' })
		.exec();

	res.status(StatusCodes.OK).json({ users, nBits: users.length });
});

userRouter.get('/:id', async (req, res) => {
	const _id = req.params.id;
	const user = await UserModel.find({ _id, role: 2001 }).select('email username img');

	res.status(StatusCodes.OK).json({ user });
});

userRouter.get('/me', async (req, res) => {
	const user = req.user;
	res.status(StatusCodes.OK).json({ user });
});

userRouter.post('/confirm-username', async (req, res) => {
	const { username } = req.body;

	const usernameUsed = await UserModel.findOne({ username });
	if (usernameUsed) throw new UnAcceptableError('Username has been used');

	res.status(StatusCodes.OK).json({ message: 'Username is available' });
});

module.exports = userRouter;
