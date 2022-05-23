const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const defaultImg =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:5000/files/profile-images/default.png'
		: 'https://ymay-postiegram.herokuapp.com/files/profile-images/default.png';

const ProfileSchema = new mongoose.Schema({
	full_name: {
		type: String,
		trim: true,
		required: [true, 'Please provide your full name'],
	},
	bio: {
		type: String,
		trim: true,
		default: 'Nothing to see here',
	},
	profile_pic: {
		type: new mongoose.Schema({
			name: String,
			url: String,
			public_id: String,
		}),
		default: {
			name: 'default_profile_pic',
			url: defaultImg,
			public_id: '',
		},
	},
});

const RelationSchema = new mongoose.Schema(
	{
		_id: String,
		user_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true, _id: false }
);

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			trim: true,
			required: [true, 'Please provide an email'],
			validate: {
				validator: val => validator.isEmail(val),
				message: props => `${props.value} is not a valid email`,
			},
			unique: true,
		},
		username: {
			type: String,
			trim: true,
			min: 3,
			required: [true, 'Please provide a username'],
			unique: true,
		},
		role: {
			type: Number,
			enum: {
				values: [2001, 1998],
				message: '{VALUE} is not supported',
			},
			default: 2001,
		},
		profile: {
			type: ProfileSchema,
			required: [true, 'Please provide profile info'],
		},
		password: {
			type: String,
			required: [true, 'Please provide password'],
			minlength: 6,
		},
		passwordToken: String,
		passwordTokenExpirationDate: Date,
		followers: [RelationSchema],
		following: [RelationSchema],
	},
	{ timestamps: true }
);

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) next();

	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(this.password, salt);
		this.password = hash;

		next();
	} catch (error) {
		next(error);
	}
});

UserSchema.methods.comparePassword = async function (password) {
	const comparison = await bcrypt.compare(password, this.password);
	return comparison;
};

module.exports = mongoose.model('User', UserSchema);
