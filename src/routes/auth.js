const router = require('express').Router();
const fetch = require('node-fetch');
const qs = require('qs');

const catchAsync = require('../common/catchAsync');
const { db } = require('../libs/firebase');
const { AppResponse } = require('../common');

router.get(
  '/refresh',
  catchAsync(async (_, res) => {
    const tokenRef = db.collection('tokens');
    const snapshot = await tokenRef.get();
    const tokens = [];
    snapshot.forEach((doc) => {
      tokens.push({
        ...doc.data(),
      });
    });

    if (!tokens.length) {
      throw new Error('Vui lòng liên hệ quản trị viên để làm mới token');
    }

    const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: tokens[0]?.value,
        grant_type: 'refresh_token',
      }),
    });
    const data = await response.json();
    res.json(new AppResponse(data));
  }),
);

module.exports = router;
