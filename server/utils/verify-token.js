const jwt = require('jsonwebtoken');
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

module.exports.verifyRefreshToken = token => {
	const { id, username, role, profile, followers, following } = jwt.verify(token, REFRESH_SECRET);
	return { id, username, role, profile, followers, following };
};

module.exports.verifyAccessToken = token => {
	const { id, username, role, profile, followers, following } = jwt.verify(token, ACCESS_SECRET);
	return { id, username, role, profile, followers, following };
};
