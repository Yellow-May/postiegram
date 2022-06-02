/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const UserModel = require('../../server/apis/user/model');
const PostModel = require('../../server/apis/post/model');
const usersData = require('./data/users.json');
const postsData = require('./data/posts.json');
const MONGO_URI = process.env.MONGO_URI;

const populateBots = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		const users = await UserModel.insertMany(usersData);

		await Promise.all(
			users.map(async (user, idx) => {
				const { _id: creator_id } = user;
				const { caption, media } = postsData[idx];
				await PostModel.create({ creator_id, caption, media });
			})
		);

		console.info('Bots and Posts successfully populated');
		process.exit(0);
	} catch (error) {
		console.warn({ error });
		process.exit(1);
	}
};

populateBots();
