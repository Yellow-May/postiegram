const jwt = require('jsonwebtoken');
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

module.exports.verifyRefreshToken = token => {
	const { email, username, id, img, role } = jwt.verify(token, REFRESH_SECRET);
	return { email, username, id, img, role };
};

module.exports.verifyAccessToken = token => {
	const { email, username, id, img, role } = jwt.verify(token, ACCESS_SECRET);
	return { email, username, id, img, role };
};
