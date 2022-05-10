const { v4: uuidV4 } = require('uuid');
const { StatusCodes } = require('http-status-codes');
const UserModel = require('../user/model');
const TokenModel = require('./model');
const {
	BadRequestError,
	UnAcceptableError,
	UnAuthorizedError,
} = require('../../utils/custom-errors');
const { createTokens, createAccessToken } = require('../../utils/create-tokens');
const { verifyRefreshToken } = require('../../utils/verify-token');
const attachCookie = require('../../utils/attach-cookies');
const retreiveCookies = require('../../utils/retreive-cookies');

module.exports.REGISTER_USER = async (req, res) => {
	const { email, username, password } = req.body;
	if (!email || !username || !password) throw new BadRequestError('Please provide all credentials');

	const user = await UserModel.create({ email, username, password });
	const userData = { id: user._id, email, username, img: user.img, role: user.role };
	const { accessToken, refreshToken } = createTokens(userData);
	const userAgent = req.headers['user-agent'];
	const browserId = uuidV4();

	await TokenModel.create({ refreshToken, userAgent, browserId, user: user._id });

	attachCookie(res, { refreshToken, browserId }, 1000 * 30);
	res.status(StatusCodes.CREATED).json({
		message: 'You have successfully registered',
		user: userData,
		token: accessToken,
	});
};

module.exports.LOGIN_USER = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) throw new BadRequestError('Please provide all credentials');

	const user = await UserModel.findOne({ email });
	if (!user) throw new UnAcceptableError('No user with such email');

	const isCorrect = await user.comparePassword(password);
	if (!isCorrect) throw new UnAcceptableError('Incorrect password');

	const userData = { id: user._id, email, username: user.username, img: user.img, role: user.role };
	const { accessToken, refreshToken } = createTokens(userData);
	const userAgent = req.headers['user-agent'];
	const cookie = retreiveCookies(req);
	const browserId = uuidV4();

	if (cookie.browserId) {
		await TokenModel.findOneAndUpdate(
			{ browserId: cookie.browserId, user: user._id },
			{ $set: { refreshToken } }
		);
		attachCookie(res, { refreshToken, browserId: cookie.browserId }, 1000 * 30);
	} else {
		// await TokenModel.deleteMany({ user: user._id });
		await TokenModel.create({ refreshToken, userAgent, browserId, user: user._id });
		attachCookie(res, { refreshToken, browserId }, 1000 * 30);
	}

	res.status(StatusCodes.OK).json({
		message: 'You have logged in',
		user: userData,
		token: accessToken,
	});
};

module.exports.LOGOUT_USER = async (req, res) => {
	const { refreshToken, browserId } = retreiveCookies(req);
	await TokenModel.findOneAndUpdate({ refreshToken, browserId }, { $set: { refreshToken: '' } });

	attachCookie(res, { refreshToken: '', browserId }, 1);
	res.status(StatusCodes.OK).json({ message: 'You have been logged out' });
};

module.exports.REFRESH_TOKEN = async (req, res) => {
	const { refreshToken } = retreiveCookies(req);
	if (!refreshToken) throw new UnAuthorizedError('Session expired');

	const userData = verifyRefreshToken(refreshToken);
	const accessToken = createAccessToken(userData);

	res.status(200).json({ user: userData, token: accessToken });
};
