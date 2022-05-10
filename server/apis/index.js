const apiRouter = require('express').Router();
const authRouter = require('./auth/routes');
const userRouter = require('./user/routes');

apiRouter.use('/', authRouter);
apiRouter.use('/user', userRouter);

module.exports = apiRouter;
