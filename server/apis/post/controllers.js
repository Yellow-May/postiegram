const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const PostModel = require('./model');
const UserModel = require('../user/model');
const { NotFoundError } = require('../../utils/custom-errors');

module.exports.GET_USER_POSTS = async (req, res) => {
	const { username: req_username } = req.user;
	const { username } = req.params;

	const user = await UserModel.findOne({ username });
	if (!user) throw new NotFoundError('User not found');

	const raw_posts = await PostModel.find({ creator_id: user._id })
		.select('_id caption media likes createdAt')
		.sort({ createdAt: 'desc' })
		.exec();
	const posts = await Promise.all(
		raw_posts.map(async post => {
			let like_id;
			const postLikes = await Promise.all(
				post.likes.map(async postLike => {
					const { username, profile } = await UserModel.findById(
						postLike.user_id
					)
						.select('username profile.profile_pic.url')
						.exec();
					if (username === req_username) like_id = postLike._id;
					return { username, profile_pic: profile.profile_pic.url };
				})
			);

			return {
				id: post._id,
				caption: post.caption,
				media: post.media.map(e => ({ id: e._id, url: e.url })),
				created_at: post.createdAt,
				likes: postLikes.filter(e => e.username !== user.username),
				like_id,
			};
		})
	);

	res.status(StatusCodes.OK).json({ posts, nBits: posts.length });
};

module.exports.GET_SINGLE_POST = async (req, res) => {
	const { username: req_username } = req.user;
	const { username, post_id } = req.params;

	const user = await UserModel.findOne({ username });
	if (!user) throw new NotFoundError('User not found');

	const { _id, caption, media, likes, createdAt } = await PostModel.findOne({
		creator_id: user._id,
		_id: post_id,
	})
		.select('_id caption media likes createdAt')
		.sort({ createdAt: 'desc' })
		.exec();

	let like_id;
	const postLikes = await Promise.all(
		likes.map(async postLike => {
			const { username, profile } = await UserModel.findById(postLike.user_id)
				.select('username profile.profile_pic.url')
				.exec();
			if (username === req_username) like_id = postLike._id;
			return { username, profile_pic: profile.profile_pic.url };
		})
	);

	const post = {
		id: _id,
		caption,
		media: media.map(e => ({ id: e._id, url: e.url })),
		createdAt,
		likes: postLikes.filter(e => e.username !== user.username),
		like_id,
	};

	res.status(StatusCodes.OK).json({ post });
};

module.exports.GET_FOLLOWING_POSTS = async (req, res) => {
	const { _id: id } = req.user;

	const user = await UserModel.findById(id).select('following username');
	const ids = user.following.map(e => mongoose.Types.ObjectId(e.user_id));
	const raw_posts = await PostModel.find({ creator_id: { $in: ids } })
		.sort({ createdAt: 'desc' })
		.exec();
	const posts = await Promise.all(
		raw_posts.map(async post => {
			const { _id, creator_id, caption, media, likes, bookmarks, createdAt } =
				post;
			const { username, profile } = await UserModel.findById(creator_id)
				.select('username profile')
				.exec();
			let like_id;
			const postLikes = await Promise.all(
				likes.map(async postLike => {
					const { username, profile } = await UserModel.findById(
						postLike.user_id
					)
						.select('username profile.profile_pic.url')
						.exec();
					if (username === user.username) like_id = postLike._id;
					return { username, profile_pic: profile.profile_pic.url };
				})
			);
			const bookmark_id = bookmarks.find(bookmark =>
				bookmark.user_id.equals(id)
			)?._id;
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
				likes: postLikes.filter(e => e.username !== user.username),
				like_id,
				bookmark_id,
				created_at: createdAt,
			};
		})
	);
	res.status(StatusCodes.OK).json({ posts, nBits: posts.length });
};

module.exports.GET_BOOKMARKED_POSTS = async (req, res) => {
	const { _id: id, username: req_username } = req.user;

	const raw_posts = await PostModel.find({
		bookmarks: { $elemMatch: { user_id: id } },
	})
		.select('_id caption media likes createdAt')
		.sort({ createdAt: 'desc' })
		.exec();

	const posts = await Promise.all(
		raw_posts.map(async post => {
			let like_id;
			const postLikes = await Promise.all(
				post.likes.map(async postLike => {
					const { username, profile } = await UserModel.findById(
						postLike.user_id
					)
						.select('username profile.profile_pic.url')
						.exec();
					if (username === req_username) like_id = postLike._id;
					return { username, profile_pic: profile.profile_pic.url };
				})
			);

			return {
				id: post._id,
				caption: post.caption,
				media: post.media.map(e => ({ id: e._id, url: e.url })),
				created_at: post.createdAt,
				likes: postLikes.filter(e => e.username !== req_username),
				like_id,
			};
		})
	);

	res.status(StatusCodes.OK).json({ posts, nBits: posts.length });
};

module.exports.GET_BOOKMARKED_POST = async (req, res) => {
	const { _id: id, username: req_username } = req.user;
	const { post_id } = req.params;

	const { _id, caption, media, likes, createdAt, bookmarks } =
		await PostModel.findById(post_id)
			.select('_id caption media likes bookmarks createdAt')
			.sort({ createdAt: 'desc' })
			.exec();

	const bookmark_id = bookmarks?.find(bookmark =>
		bookmark.user_id.equals(id)
	)?._id;

	let like_id;
	const postLikes = await Promise.all(
		likes.map(async postLike => {
			const { username, profile } = await UserModel.findById(postLike.user_id)
				.select('username profile.profile_pic.url')
				.exec();
			if (username === req_username) like_id = postLike._id;

			return {
				username,
				profile_pic: profile.profile_pic.url,
			};
		})
	);

	const post = {
		id: _id,
		caption,
		media: media.map(e => ({ id: e._id, url: e.url })),
		createdAt,
		likes: postLikes,
		like_id,
		bookmark_id,
	};

	res.status(StatusCodes.OK).json({ post });
};

module.exports.CREATE_POST = async (req, res) => {
	const { _id: id } = req.user;
	const { caption, media } = req.body;

	await PostModel.create({ creator_id: id, caption, media });
	res
		.status(StatusCodes.CREATED)
		.json({ message: 'Post successfully created' });
};

module.exports.DELETE_POST = async (req, res) => {
	const { _id: id } = req.user;
	const { post_id } = req.params;

	await PostModel.deleteOne({ creator_id: id, _id: post_id });
	res.status(StatusCodes.OK).json({ message: 'Post deleted' });
};

module.exports.TOGGLE_LIKE = async (req, res) => {
	const { _id: id } = req.user;
	const { post_id } = req.params;
	const { like_id } = req.body;

	const post = await PostModel.findById(post_id);
	if (like_id) post.likes.id(like_id).remove();
	else post.likes.push({ user_id: id });
	await post.save();

	res
		.status(StatusCodes.OK)
		.json({ message: like_id ? 'Unliked post' : 'Liked post' });
};

module.exports.TOGGLE_BOOKMARK = async (req, res) => {
	const { _id: id } = req.user;
	const { post_id } = req.params;
	const { bookmark_id } = req.body;

	const post = await PostModel.findById(post_id);
	if (bookmark_id) post.bookmarks.id(bookmark_id).remove();
	else post.bookmarks.push({ user_id: id });
	await post.save();

	res
		.status(StatusCodes.OK)
		.json({ message: bookmark_id ? 'Post unbookmarked' : 'Post bookmarked' });
};
