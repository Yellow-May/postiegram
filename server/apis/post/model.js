const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Media name not provided'],
	},
	url: {
		type: String,
		required: [true, 'Media url not provided'],
	},
	public_id: {
		type: String,
		required: [true, 'Media Cloudinary public_id not provided'],
	},
});

const LikesSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

const PostSchema = new mongoose.Schema(
	{
		creator_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
			required: [true, "User's _id required"],
		},
		caption: {
			type: String,
			trim: true,
			required: [true, 'Please provide post caption'],
		},
		media: {
			type: [MediaSchema],
			required: [true, 'Please provide 1 or more media'],
		},
		likes: {
			type: [LikesSchema],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
