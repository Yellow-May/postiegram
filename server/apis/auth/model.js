const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
	{
		refreshToken: {
			type: String,
			required: true,
		},
		browserId: {
			type: String,
			required: true,
		},
		userAgent: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Token', TokenSchema);
