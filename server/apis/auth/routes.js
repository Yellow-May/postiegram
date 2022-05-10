const authRouter = require('express').Router();
const { REGISTER_USER, LOGIN_USER, LOGOUT_USER, REFRESH_TOKEN } = require('./controllers');

authRouter.post('/register', REGISTER_USER);
authRouter.post('/login', LOGIN_USER);
authRouter.patch('/logout', LOGOUT_USER);
authRouter.get('/refresh', REFRESH_TOKEN);

module.exports = authRouter;
