const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const schedule = require('node-schedule');

const { notFound, error } = require('./middlewares/error');
const { AppResponse } = require('./common');
const { newsSubmission } = require('./libs/nodemailer');
const catchAsync = require('./common/catchAsync');
const { auth } = require('./middlewares/auth');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

schedule.scheduleJob('*/14 * * * *', function () {
  fetch('https://vialand.herokuapp.com/ping');
});

app.get('/ping', (req, res) => {
  res.send('pong').status(200);
});

app.use('/auth', auth, require('./routes/auth'));
app.post(
  '/news-submission',
  auth,
  catchAsync(async (req, res) => {
    const { name, link } = req.body;
    await newsSubmission({ name, link });
    res.json(new AppResponse(null, 'Gửi email thành công'));
  }),
);

app.use(notFound);
app.use(error);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
