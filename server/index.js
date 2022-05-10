/* eslint-disable no-console */
require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

// start server
const PORT = process.env.PORT;
const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		app.listen(PORT, () => console.log(`Server started at ${PORT}`));
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

start();
