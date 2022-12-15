const { StatusCodes } = require('http-status-codes');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('./model');
const PostModel = require('../post/model');
const {
	UnAcceptableError,
	NotFoundError,
} = require('../../utils/custom-errors');

// nEw
module.exports.GET_USERS = async (req, res) => {
	const { _id, username } = req.user;
	const { bots, followers, following, q, user_id } = req.query;

	const query = {};

	if (user_id) {
		if (followers) query['following.user_id'] = { $in: user_id };
		if (following) query['followers.user_id'] = { $in: user_id };
	}
	if (bots) {
		query.role = 1001;
		query['followers.user_id'] = { $ne: _id };
	}
	if (q) {
		query['$and'] = [
			{ username: { $ne: username } },
			{
				$or: [
					{ username: { $regex: new RegExp(q), $options: 'i' } },
					{ 'profile.full_name': { $regex: new RegExp(q), $options: 'i' } },
				],
			},
		];
	}

	const users = await UserModel.find(query)
		.select('username role profile followers following')
		.exec();

	return res.status(StatusCodes.OK).json({ users, nBits: users.length });
};

module.exports.GET_USER = async (req, res) => {
	const { username } = req.params;

	const user = await UserModel.findOne({ username })
		.select('username role profile followers following')
		.exec();
	if (!user) throw new NotFoundError('User not found');

	const total_posts = await PostModel.find({ creator_id: user._id }).count();

	return res.status(StatusCodes.OK).json({ ...user?._doc, total_posts });
};

module.exports.CHECK_AVAILABLE_USERNAME = async (req, res) => {
	const { username } = req.query;

	const usernameUsed = await UserModel.findOne({ username });
	if (usernameUsed) throw new UnAcceptableError('Username has been used');

	res.status(StatusCodes.OK).json({ message: 'Username is available' });
};

module.exports.UPDATE_USER_PROFILE = async (req, res) => {
	const { _id } = req.user;
	const updates = req.body;

	const query = {};
	const updatesKeys = Object.keys(updates);

	updatesKeys.forEach(key => {
		query[`profile.${key}`] = updates[key];
	});

	await UserModel.findByIdAndUpdate(
		_id,
		{ $set: query },
		{ new: true, runValidators: true }
	);

	res.status(StatusCodes.OK).json({ message: 'User Profile updated' });
};

module.exports.TOGGLE_FOLLOW = async (req, res) => {
	const { _id } = req.user;
	const { follow, unfollow } = req.query;
	const { follow_id, user_id } = req.body;

	const user = await UserModel.findById(_id);
	const followed_user = await UserModel.findById(user_id);

	if (unfollow) {
		user.following.id(follow_id).remove();
		followed_user.followers.id(follow_id).remove();
		await PostModel.updateMany(
			{ creator_id: user_id },
			{ $pull: { subscribers: { user_id: _id } } }
		);
	}

	if (follow) {
		const follow_id = uuidv4();
		user.following.unshift({ _id: follow_id, user_id });
		followed_user.followers.unshift({ _id: follow_id, user_id: _id });
		await PostModel.updateMany(
			{ creator_id: user_id },
			{ $push: { subscribers: { user_id: _id } } }
		);
	}

	await user.save();
	await followed_user.save();

	res
		.status(StatusCodes.OK)
		.json({ message: follow ? 'Followed user' : 'Unfollowed user' });
};
