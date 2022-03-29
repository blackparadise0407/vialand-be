const router = require('express').Router();
const fetch = require('node-fetch');

const catchAsync = require('../common/catchAsync');
const { AppResponse } = require('../common');

router.get(
  '/refresh',
  catchAsync(async (req, res) => {
    fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        res.json(new AppResponse(data));
      });
  }),
);

module.exports = router;
