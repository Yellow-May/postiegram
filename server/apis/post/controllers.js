const { StatusCodes } = require('http-status-codes');
const PostModel = require('./model');
const UserModel = require('../user/model');

// Refactored V2
module.exports.GET_POSTS = async (req, res) => {
	const { _id } = req.user;
	const { username, bookmarked } = req.query;

	let query = {
		subscribers: { $elemMatch: { user_id: _id } },
	};

	if (username) {
		const user = await UserModel.findOne({ username }).select('_id').exec();
		query = { creator_id: user._id };
	}

	if (bookmarked) {
		query = { bookmarks: { $elemMatch: { user_id: _id } } };
	}

	const raw_posts = await PostModel.find(query)
		.sort({ createdAt: 'desc' })
		.exec();

	const posts = await Promise.all(
		raw_posts.map(async post => {
			const { username, profile } = await UserModel.findById(post?.creator_id)
				.select('username profile')
				.exec();
			return { ...post?._doc, creator: { username, profile } };
		})
	);

	return res.status(StatusCodes.OK).json({ posts, nBits: posts.length });
};

module.exports.GET_POST = async (req, res) => {
	const { post_id } = req.params;

	const raw_post = await PostModel.findById(post_id).exec();

	const { username, profile } = await UserModel.findById(raw_post?.creator_id)
		.select('username profile')
		.exec();

	const post = { ...raw_post?._doc, creator: { username, profile } };

	return res.status(StatusCodes.OK).json(post);
};

module.exports.CREATE_POST = async (req, res) => {
	const { _id } = req.user;
	const { caption, media } = req.body;

	const { followers } = await UserModel.findById(_id);

	await PostModel.create({
		creator_id: _id,
		caption,
		media,
		subscribers: followers.map(({ user_id }) => ({ user_id })),
	});

	res.status(StatusCodes.CREATED).json({ message: 'Post created' });
};

module.exports.UPDATE_POST_TOGGLE = async (req, res) => {
	const { _id } = req.user;
	const { post_id } = req.params;
	const { like, bookmark } = req.query;
	const { like_id, bookmark_id } = req.body;

	const post = await PostModel.findById(post_id);

	if (like) {
		if (like_id) post.likes.id(like_id).remove();
		else post.likes.push({ user_id: _id });
	}

	if (bookmark) {
		if (bookmark_id) post.bookmarks.id(bookmark_id).remove();
		else post.bookmarks.push({ user_id: _id });
	}

	await post.save();

	res.status(StatusCodes.OK).json({ message: 'Post updated' });
};

module.exports.DELETE_POST = async (req, res) => {
	const { _id } = req.user;
	const { post_id } = req.params;

	await PostModel.deleteOne({ creator_id: _id, _id: post_id });

	res.status(StatusCodes.OK).json({ message: 'Post deleted' });
};
