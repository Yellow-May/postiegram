const jwt = require('jsonwebtoken');
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const createAccessToken = payload => {
	return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '10s' });
};

const createRefreshToken = payload => {
	return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30s' });
};

const createTokens = payload => {
	return {
		accessToken: createAccessToken(payload),
		refreshToken: createRefreshToken(payload),
	};
};

module.exports = {
	createAccessToken,
	createRefreshToken,
	createTokens,
};
