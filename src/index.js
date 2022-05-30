const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const schedule = require('node-schedule');
const qs = require('qs');

const { notFound, error } = require('./middlewares/error');
const { AppResponse } = require('./common');
const { newsSubmission, fileUploadNotification } = require('./libs/nodemailer');
const catchAsync = require('./common/catchAsync');
const { auth } = require('./middlewares/auth');
const { renewRefreshToken } = require('./utils');
const { db } = require('./libs/firebase');

const app = express();

app.use(morgan('dev'));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(
  cors({
    origin: '*',
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// if (process.env.NODE_ENV !== 'development') {
//   schedule.scheduleJob('*/14 * * * *', function () {
//     fetch('https://vialand.herokuapp.com/ping')
//       .then((res) => res.text())
//       .then((data) => console.log(data))
//       .catch((e) => console.log(e));
//   });
// }

schedule.scheduleJob('0 * * * *', async function () {
  await renewRefreshToken();
});

app.get('/ping', (req, res) => {
  res.send('pong').status(200);
});

app.use('/auth', auth, require('./routes/auth'));
app.use('/google', require('./routes/google'));
app.use('/news', auth, require('./routes/news'));
app.post(
  '/news-submission',
  auth,
  catchAsync(async (req, res) => {
    const { name, link } = req.body;
    await newsSubmission({ name, link });
    res.json(new AppResponse(null, 'Gửi email thành công'));
  }),
);
app.post(
  '/notification',
  auth,
  catchAsync(async (req, res) => {
    await fileUploadNotification();
    res.json(new AppResponse(null, 'Gửi email thành công'));
  }),
);
app.get('/renew', auth, async (_, res, next) => {
  try {
    const link =
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      qs.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URI,
        scope: 'https://www.googleapis.com/auth/drive',
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
      });

    const resp = new AppResponse(link);
    res.json(resp);
  } catch (e) {
    next(e);
  }
});

app.use(notFound);
app.use(error);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
