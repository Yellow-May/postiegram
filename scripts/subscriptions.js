/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const PostModel = require('../server/apis/post/model');
const UserModel = require('../server/apis/user/model');

// start server
const updateDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		const users = await UserModel.find({
			followers: { $exists: true, $ne: [] },
		}).exec();
		await Promise.all(
			users.map(async user => {
				await PostModel.updateMany(
					{ creator_id: user._id },
					{
						subscribers: user.followers.map(follower => ({
							user_id: follower.user_id,
						})),
					},
					{ new: true, runValidators: true }
				);
			})
		);
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

updateDB();
