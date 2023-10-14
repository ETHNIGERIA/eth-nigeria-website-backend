const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv/config');

const db = require('./config/db');
const port = process.env.PORT;
const api = process.env.API;
const secret = process.env.SECRET;

// routes
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const eventRouter = require('./routes/event');

const app = express();

db();
// console.log('db initialized');

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Set up sessions
app.use(
    session({
      secret: secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days 
      },
    })
);

app.use(api+'/auth', authRouter);
app.use(api+'/user', userRouter);
app.use(api+'/event', eventRouter);


const startServer = () => {
    try {
        app.listen(port, () => {
            console.log(`server listening on port ${port}`);
        });
    } catch (e) {
        console.log(`ERR: server not started\ ERR: ${e}`);
        process.exit();
    }
};

startServer();