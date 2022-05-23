const { StatusCodes } = require('http-status-codes');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('./model');
const { UnAcceptableError } = require('../../utils/custom-errors');

module.exports.GET_ALL_USERS = async (_req, res) => {
	const raw_users = await UserModel.find({ role: 2001 })
		.select('username profile followers following')
		.sort({ createdAt: 'desc' })
		.exec();
	const users = await Promise.all(
		raw_users.map(user => ({
			username: user.username,
			full_name: user.profile.full_name,
			bio: user.profile.bio,
			profile_pic: user.profile.profile_pic.url,
			followers: user.followers.map(e => ({ user_id: e.user_id, since: e.createdAt })),
			following: user.following.map(e => ({ id: e._id, user_id: e.user_id, since: e.createdAt })),
		}))
	);

	res.status(StatusCodes.OK).json({ users, nBits: users.length });
};

module.exports.GET_SINGLE_USER = async (req, res) => {
	const username = req.params.username;
	const raw_user = await UserModel.find({ username, role: 2001 }).select('username profile').exec();
	const user = {
		username: raw_user.username,
		full_name: raw_user.profile.full_name,
		bio: raw_user.profile.bio,
		profile_pic: raw_user.profile.profile_pic.url,
		followers: raw_user.followers.map(e => ({ user_id: e.user_id, since: e.createdAt })),
		following: raw_user.following.map(e => ({ id: e._id, user_id: e.user_id, since: e.createdAt })),
	};

	res.status(StatusCodes.OK).json({ user });
};

module.exports.CHECK_AVAILABLE_USERNAME = async (req, res) => {
	const { username } = req.body;

	const usernameUsed = await UserModel.findOne({ username });
	if (usernameUsed) throw new UnAcceptableError('Username has been used');

	res.status(StatusCodes.OK).json({ message: 'Username is available' });
};

module.exports.FOLLOW_USER = async (req, res) => {
	const { id } = req.user;
	const { user_id } = req.body;
	const _id = uuidv4();

	const user = await UserModel.findById(id);
	user.following.unshift({ _id, user_id });
	await user.save();

	const followed_user = await UserModel.findById(user_id);
	followed_user.followers.unshift({ _id, user_id: id });
	await followed_user.save();

	res.status(StatusCodes.CREATED).json({ message: 'Followed user' });
};

module.exports.UNFOLLOW_USER = async (req, res) => {
	const { id } = req.user;
	const { _id, user_id } = req.body;

	const user = await UserModel.findById(id);
	user.following.id(_id).remove();
	await user.save();

	const followed_user = await UserModel.findById(user_id);
	followed_user.followers.id(_id).remove();
	await followed_user.save();

	res.status(StatusCodes.CREATED).json({ message: 'Unfollowed user' });
};

module.exports.GET_FOLLOWERS = async (req, res) => {
	const { followers: raw_followers } = req.user;

	const followers = await Promise.all(
		raw_followers.map(async e => {
			const { username, profile } = await UserModel.findById(e.user_id).select('username profile');
			return {
				user_id: e.user_id,
				username,
				full_name: profile.full_name,
				profile_pic: profile.profile_pic.url,
			};
		})
	);

	res.status(StatusCodes.OK).json({ followers, nBits: followers.length });
};

module.exports.GET_FOLLOWING = async (req, res) => {
	const { following: raw_following } = req.user;

	const following = await Promise.all(
		raw_following.map(async e => {
			const { username, profile } = await UserModel.findById(e.user_id).select('username profile');
			return {
				id: e.id,
				user_id: e.user_id,
				username,
				full_name: profile.full_name,
				profile_pic: profile.profile_pic.url,
			};
		})
	);

	res.status(StatusCodes.OK).json({ following, nBits: following.length });
};
