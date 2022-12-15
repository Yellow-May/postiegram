const { v4: uuidV4 } = require('uuid');
const { StatusCodes } = require('http-status-codes');
const UserModel = require('../user/model');
const TokenModel = require('./model');
const {
	BadRequestError,
	UnAcceptableError,
	UnAuthorizedError,
} = require('../../utils/custom-errors');
const {
	createTokens,
	createAccessToken,
} = require('../../utils/create-tokens');
const { verifyRefreshToken } = require('../../utils/verify-token');
const attachCookie = require('../../utils/attach-cookies');
const retreiveCookies = require('../../utils/retreive-cookies');

module.exports.REGISTER_USER = async (req, res) => {
	const { email, username, full_name, password, profile_pic } = req.body;
	if (!email || !username || !full_name || !password || !profile_pic)
		throw new BadRequestError('Please provide all credentials');

	const user = await UserModel.create({
		email,
		username,
		password,
		profile: { full_name, profile_pic },
	});

	const { accessToken, refreshToken } = createTokens({ _id: user._id });
	const userAgent = req.headers['user-agent'];
	const browserId = uuidV4();

	await TokenModel.create({
		refreshToken,
		userAgent,
		browserId,
		user: user._id,
	});

	attachCookie(res, { refreshToken, browserId });
	res.status(StatusCodes.CREATED).json({
		message: 'You have successfully registered',
		user: {
			_id: user._id,
			username,
			role: user.role,
			profile: user.profile,
		},
		token: accessToken,
	});
};

module.exports.LOGIN_USER = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		throw new BadRequestError('Please provide all credentials');

	const user = await UserModel.findOne({ email });
	if (!user) throw new UnAcceptableError('No user with such email');

	const isCorrect = await user.comparePassword(password);
	if (!isCorrect) throw new UnAcceptableError('Incorrect password');

	const { accessToken, refreshToken } = createTokens({ _id: user._id });
	const userAgent = req.headers['user-agent'];
	const cookie = retreiveCookies(req);
	const browserId = uuidV4();

	if (cookie.browserId) {
		await TokenModel.findOneAndUpdate(
			{ browserId: cookie.browserId, user: user._id },
			{ $set: { refreshToken } }
		);
		attachCookie(res, { refreshToken, browserId: cookie.browserId });
	} else {
		// await TokenModel.deleteMany({ user: user._id });
		await TokenModel.create({
			refreshToken,
			userAgent,
			browserId,
			user: user._id,
		});
		attachCookie(res, { refreshToken, browserId });
	}

	res.status(StatusCodes.OK).json({
		message: 'You have logged in',
		user: {
			_id: user._id,
			username: user.username,
			role: user.role,
			profile: user.profile,
		},
		token: accessToken,
	});
};

module.exports.LOGOUT_USER = async (req, res) => {
	const { refreshToken, browserId } = retreiveCookies(req);
	await TokenModel.findOneAndUpdate(
		{ refreshToken, browserId },
		{ $set: { refreshToken: '' } }
	);

	attachCookie(res, { refreshToken: ' ', browserId });
	res.status(StatusCodes.OK).json({ message: 'You have been logged out' });
};

module.exports.REFRESH_TOKEN = async (req, res) => {
	const { refreshToken } = retreiveCookies(req);
	if (!refreshToken) throw new UnAuthorizedError('Session expired');

	const { _id } = verifyRefreshToken(refreshToken);
	const accessToken = createAccessToken({ _id });
	const user = await UserModel.findById(_id).select('username role profile');

	res.status(200).json({ user, token: accessToken });
};
