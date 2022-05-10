const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const defaultImg = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/files/profile-images/default.png' : '';

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
		img: {
			type: String,
			default: defaultImg,
		},
		password: {
			type: String,
			required: [true, 'Please provide password'],
			minlength: 6,
		},
		passwordToken: {
			type: String,
		},
		passwordTokenExpirationDate: {
			type: Date,
		},
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
