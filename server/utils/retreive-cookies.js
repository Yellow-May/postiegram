const REFRESH_COOKIE_NAME = process.env.REFRESH_COOKIE_NAME;
const BROWSER_COOKIE_NAME = process.env.BROWSER_COOKIE_NAME;

module.exports = req => {
	const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
	const browserId = req.cookies[BROWSER_COOKIE_NAME];

	return {
		refreshToken,
		browserId,
	};
};
