const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const schedule = require('node-schedule');
const fetch = require('node-fetch');

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

if (process.env.NODE_ENV !== 'development') {
  schedule.scheduleJob('*/14 * * * *', function () {
    fetch('https://vialand.herokuapp.com/ping')
      .then((res) => res.text())
      .then((data) => console.log(data))
      .catch((e) => console.log(e));
  });
}

app.get('/ping', (req, res) => {
  res.send('pong').status(200);
});

app.use('/auth', auth, require('./routes/auth'));
app.use('/google', require('./routes/google'));
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
