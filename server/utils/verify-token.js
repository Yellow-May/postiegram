const jwt = require('jsonwebtoken');
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

module.exports.verifyRefreshToken = token => {
	const payload = jwt.verify(token, REFRESH_SECRET);
	return payload;
};

module.exports.verifyAccessToken = token => {
	const payload = jwt.verify(token, ACCESS_SECRET);
	return payload;
};
