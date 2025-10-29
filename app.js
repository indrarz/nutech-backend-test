const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');

const auth = require('./router/auth');
const user = require('./router/user');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use('/', auth);
app.use('/profile', user);

module.exports = app;