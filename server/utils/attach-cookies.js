const REFRESH_COOKIE_NAME = process.env.REFRESH_COOKIE_NAME;
const BROWSER_COOKIE_NAME = process.env.BROWSER_COOKIE_NAME;

module.exports = (res, payload) => {
	res.cookie(BROWSER_COOKIE_NAME, payload.browserId, {
		maxAge: 1000 * 60 * 60 * 24 * 90,
		httpOnly: true,
		secure: process.env.NODE_ENV === 'development' ? false : true,
	});
	res.cookie(REFRESH_COOKIE_NAME, payload.refreshToken, {
		maxAge: payload.refreshToken === ' ' ? 1 : 1000 * 60 * 60 * 24 * 2,
		httpOnly: true,
		secure: process.env.NODE_ENV === 'development' ? false : true,
	});
};
