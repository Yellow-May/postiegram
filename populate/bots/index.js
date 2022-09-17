/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const UserModel = require('../../server/apis/user/model');
const PostModel = require('../../server/apis/post/model');
const usersData = require('./data/users.json');
const postsData = require('./data/posts.json');
const MONGO_URI = process.env.MONGO_URI;

const populatePosts = users => {
	users.forEach((user, idx) => {
		const { _id: creator_id } = user;
		const { caption, media } = postsData[idx];

		setTimeout(async () => {
			const res = await PostModel.create({ creator_id, caption, media });
			console.log({ idx, time: 5000 * (idx + 1) });

			if (res && idx === users.length - 1) {
				console.log('Posts successsfully populated');
				process.exit(0);
			}
		}, 5000 * (idx + 1));
	});
};

const populateBots = async () => {
	try {
		mongoose.connect(MONGO_URI);
		await UserModel.deleteMany({});
		await PostModel.deleteMany({});

		const users = await UserModel.insertMany(usersData);
		console.info('Bots successfully populated');

		populatePosts(users);
	} catch (error) {
		console.warn({ error });
		process.exit(1);
	}
};

populateBots();
