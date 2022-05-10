const { StatusCodes } = require('http-status-codes');

// custom api errror constructor
class CustomAPIError extends Error {
	constructor(message) {
		super(message);
	}
}

// bad request error
class BadRequestError extends CustomAPIError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

// 404 not found error
class NotFoundError extends CustomAPIError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.NOT_FOUND;
	}
}

// unauthorized error
class UnAuthorizedError extends CustomAPIError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.UNAUTHORIZED;
	}
}

// unacceptable error
class UnAcceptableError extends CustomAPIError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.NOT_ACCEPTABLE;
	}
}

module.exports = {
	CustomAPIError,
	BadRequestError,
	NotFoundError,
	UnAuthorizedError,
	UnAcceptableError,
};
