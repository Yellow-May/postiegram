const { StatusCodes } = require('http-status-codes');

module.exports = (_req, res) => res.status(StatusCodes.NOT_FOUND).json({ message: `Route not found` });
