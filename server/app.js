require('express-async-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const helmet = require('helmet');
const path = require('node:path');
const root = require('app-root-path');
const apiRouter = require('./apis');
const { errorHandler, notFoundHandler } = require('./middlewares');

// initialize app
const app = express();

// cors Options
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,
};

// requests middlewares
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(xss());
app.use(cors(corsOptions));
app.use('/files', express.static(path.resolve(root.path, 'files')));
app.use('/api', apiRouter);

// serve static files
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));

	app.get('*', (_req, res) => {
		res.sendFile(path.resolve(root.path, 'client', 'build', 'index.html'));
	});
}

// error and 404 middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
