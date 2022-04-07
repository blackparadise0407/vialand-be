const router = require('express').Router();
const fetch = require('node-fetch');
const dayjs = require('dayjs');

const catchAsync = require('../common/catchAsync');
const { db } = require('../libs/firebase');
const { AppResponse } = require('../common');
const { getQueryParams } = require('../utils');

router.get(
  '/callback',
  catchAsync(async (req, res) => {
    const { code, scope } = getQueryParams(req.query);
    const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        scope,
        redirect_uri: 'http://localhost:5000/google/callback',
        grant_type: 'authorization_code',
      }),
    });
    const data = await response.json();
    if (data.error) {
      throw data;
    }
    await db.collection('tokens').add({
      value: data.refresh_token,
      expiredAt: dayjs().add(6, 'day').unix(),
    });
    res.json(new AppResponse('Gia hạn token thành công'));
  }),
);

module.exports = router;
