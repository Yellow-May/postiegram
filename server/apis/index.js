const apiRouter = require('express').Router();
const authRouter = require('./auth/routes');
const postRouter = require('./post/routes');
const userRouter = require('./user/routes');

apiRouter.use('/', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/posts', postRouter);

module.exports = apiRouter;
