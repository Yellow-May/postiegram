const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const PostModel = require('./model');
const UserModel = require('../user/model');

module.exports.GET_MY_POSTS = async (req, res) => {
	const { id } = req.user;

	const raw_posts = await PostModel.find({ creator_id: id })
		.select('_id caption media createdAt')
		.sort({ createdAt: 'desc' })
		.exec();
	const posts = raw_posts.map(post => ({
		id: post._id,
		caption: post.caption,
		media: post.media.map(e => ({ id: e._id, url: e.url })),
		created_at: post.createdAt,
	}));

	res.status(StatusCodes.OK).json({ posts, nBits: posts.length });
};

module.exports.GET_FOLLOWING_POSTS = async (req, res) => {
	const { following } = req.user;

	const ids = following.map(e => mongoose.Types.ObjectId(e.user_id));
	const raw_posts = await PostModel.find({ creator_id: { $in: ids } })
		.sort({ createdAt: 'desc' })
		.exec();
	const posts = await Promise.all(
		raw_posts.map(async post => {
			const { _id, creator_id, caption, media, createdAt } = post;
			const { username, profile } = await UserModel.findById(creator_id).select('username profile').exec();
			return {
				id: _id,
				creator: {
					id: creator_id,
					username,
					full_name: profile.full_name,
					profile_pic: profile.profile_pic.url,
				},
				caption,
				media: media.map(e => ({ url: e.url })),
				created_at: createdAt,
			};
		})
	);
	res.status(StatusCodes.OK).json({ posts, nBits: posts.length });
};

module.exports.CREATE_POST = async (req, res) => {
	const { id } = req.user;
	const { caption, media } = req.body;

	await PostModel.create({ creator_id: id, caption, media });
	res.status(StatusCodes.CREATED).json({ message: 'Post successfully created' });
};
