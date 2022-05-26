const { StatusCodes } = require('http-status-codes');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('./model');
const PostModel = require('../post/model');
const { UnAcceptableError } = require('../../utils/custom-errors');

module.exports.GET_ALL_USERS = async (_req, res) => {
	const raw_users = await UserModel.find({ role: 2001 })
		.select('username profile followers following')
		.sort({ createdAt: 'desc' })
		.exec();
	const users = await Promise.all(
		raw_users.map(async user => ({
			id: user._id,
			username: user.username,
			profile: user.profile,
			posts: (await PostModel.find({ creator_id: user._id })).length,
			followers: user.followers.length,
			following: user.following.length,
		}))
	);

	res.status(StatusCodes.OK).json({ users, nBits: users.length });
};

module.exports.GET_SINGLE_USER = async (req, res) => {
	const { _id: id } = req.user;

	const requesting_user = await UserModel.findById(id).select('username following followers');
	const username = req.params.username;
	const raw_user = await UserModel.findOne({ username, role: 2001 });
	const isFollowing = requesting_user.following.find(e => raw_user.followers.id(e._id));
	const isFollower = requesting_user.followers.find(e => raw_user.following.id(e._id)) ? true : false;

	const user = {
		id: raw_user._id,
		username: raw_user.username,
		profile: raw_user.profile,
		posts: (await PostModel.find({ creator_id: raw_user._id })).length,
		followers: raw_user.followers.length,
		following: raw_user.following.length,
	};

	if (requesting_user.username !== username) {
		user.isFollowing = isFollowing;
		user.isFollower = isFollower;
	}

	res.status(StatusCodes.OK).json({ user });
};

module.exports.CHECK_AVAILABLE_USERNAME = async (req, res) => {
	const { username } = req.body;

	const usernameUsed = await UserModel.findOne({ username });
	if (usernameUsed) throw new UnAcceptableError('Username has been used');

	res.status(StatusCodes.OK).json({ message: 'Username is available' });
};

module.exports.FOLLOW_USER = async (req, res) => {
	const { _id: id } = req.user;
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
	const { _id: id } = req.user;
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
	const { _id: id } = req.user;
	const { username } = req.params;

	const requesting_user = await UserModel.findById(id).select('username following');
	const user = await UserModel.findOne({ username }).select('followers');
	const followers = await Promise.all(
		user.followers.map(async e => {
			const {
				username,
				profile,
				followers: eFollowers,
			} = await UserModel.findById(e.user_id).select('username profile followers');
			return {
				user_id: e.user_id,
				username,
				full_name: profile.full_name,
				profile_pic: profile.profile_pic.url,
				isFollowing: requesting_user.following.find(e => eFollowers.id(e._id)),
			};
		})
	);

	res.status(StatusCodes.OK).json({ followers, nBits: followers.length });
};

module.exports.GET_FOLLOWING = async (req, res) => {
	const { _id: id } = req.user;
	const { username } = req.params;

	const requesting_user = await UserModel.findById(id).select('username followers');
	const user = await UserModel.findOne({ username }).select('following');
	const following = await Promise.all(
		user.following.map(async e => {
			const {
				username,
				profile,
				following: eFollowing,
			} = await UserModel.findById(e.user_id).select('username profile following');
			return {
				id: e.id,
				user_id: e.user_id,
				username,
				full_name: profile.full_name,
				profile_pic: profile.profile_pic.url,
				isFollower: requesting_user.followers.find(e => eFollowing.id(e._id)) ? true : false,
			};
		})
	);

	res.status(StatusCodes.OK).json({ following, nBits: following.length });
};

module.exports.CHANGE_PROFILE_PIC = async (req, res) => {
	const { _id: id } = req.user;
	const { profile_pic } = req.body;

	const user = await UserModel.findByIdAndUpdate(
		id,
		{ $set: { 'profile.profile_pic': profile_pic } },
		{ new: true, runValidators: true }
	);
	res.status(StatusCodes.OK).json({ message: 'Profile picture updated', user });
};
