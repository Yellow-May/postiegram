const apiRouter = require('express').Router();
const authRouter = require('./auth/routes');
const postRouter = require('./post/routes');
const userRouter = require('./user/routes');

apiRouter.use('/', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/post', postRouter);

module.exports = apiRouter;
