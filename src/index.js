const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const schedule = require('node-schedule');
const fetch = require('node-fetch');
const qs = require('qs');

const { notFound, error } = require('./middlewares/error');
const { AppResponse } = require('./common');
const {
  newsSubmission,
  refreshTokenNotification,
} = require('./libs/nodemailer');
const { db } = require('./libs/firebase');
const catchAsync = require('./common/catchAsync');
const { auth } = require('./middlewares/auth');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

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
  const tokenRef = db.collection('tokens');
  const snapshot = await tokenRef.get();
  const tokens = [];
  snapshot.docs.forEach((doc) => {
    tokens.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  if (tokens.length) {
    const { expiredAt } = tokens[0];
    if (new Date(expiredAt * 1000) < new Date()) {
      try {
        const link =
          'https://accounts.google.com/o/oauth2/v2/auth?' +
          qs.stringify({
            client_id: process.env.GOOGLE_CLIENT_ID,
            redirect_uri: process.env.REDIRECT_URI,
            scope: 'https://www.googleapis.com/auth/drive',
            response_type: 'code',
            access_type: 'offline',
          });

        await tokenRef.doc(tokens[0].id).delete();
        await refreshTokenNotification({ link });
      } catch (e) {
        console.log(e);
      }
    }
  }
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

app.use(notFound);
app.use(error);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
