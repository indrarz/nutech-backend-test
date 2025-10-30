const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const auth = require('./router/auth');
const user = require('./router/user');
const banner = require('./router/banner');
const service = require('./router/service');
const topup = require('./router/topup');
const transaction = require('./router/transaction');
const balance = require('./router/balance');

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
app.use('/banner', banner);
app.use('/services', service);
app.use('/topup', topup);
app.use('/transaction', transaction);
app.use('/balance', balance);

module.exports = app;