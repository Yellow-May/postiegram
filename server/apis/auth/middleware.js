const jwt = require('jsonwebtoken');
const UserModel = require('../user/model');

const authMiddleware = async (req, res, next) => {
	req.user = null;

	// check if Authorization header begins with 'Bearer'
	const allow = req.headers.authorization && req.headers.authorization.startsWith('Bearer');
	if (!allow) return res.status(401).json({ message: 'You are not authorized to access this route' });
	const token = req.headers.authorization.split(' ')[1];

	try {
		const { id, username, role, profile, followers, following } = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		await UserModel.findById(id);

		req.user = { id, username, role, profile, followers, following };
		next();
	} catch (err) {
		return res.status(403).json({ message: 'Token expired' });
	}
};

module.exports = authMiddleware;
