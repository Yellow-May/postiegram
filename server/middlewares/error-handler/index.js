const { StatusCodes } = require('http-status-codes');
const { CustomAPIError } = require('../../utils/custom-errors');

module.exports = (err, _req, res, next) => {
	let errorObj = {
		statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
		message: `There was an internal error, Try again later`,
	};

	if (err instanceof CustomAPIError)
		errorObj = {
			statusCode: err.statusCode,
			message: err.message,
		};

	if (err.code === 11000) {
		const val = err.keyValue.username || err.keyValue.email;
		const key = err.keyValue.username ? 'username' : 'email';
		const message = `${key} ${val} has been used`;
		errorObj = {
			statusCode: StatusCodes.BAD_REQUEST,
			message,
		};
	}

	if (err.name === 'CastError')
		errorObj = {
			statusCode: StatusCodes.BAD_REQUEST,
			message: 'invalid id',
		};

	if (err.name === 'ValidationError') {
		const error = err.errors.status || err.errors.userId;
		errorObj = {
			statusCode: StatusCodes.BAD_REQUEST,
			message: error.message,
		};
	}
	if (err.name === 'JsonWebTokenError') {
		errorObj = {
			statusCode: StatusCodes.UNAUTHORIZED,
			message: err.message,
		};
	}

	const { statusCode, message } = errorObj;
	res.status(statusCode).json({ message, err });
	next();
};
