const router = require('express').Router();
const fetch = require('node-fetch');

const catchAsync = require('../common/catchAsync');
const { AppResponse } = require('../common');
const { getQueryParams } = require('../utils');

router.get(
  '/callback',
  catchAsync(async (req, res) => {
    const { code, scope } = getQueryParams(req.query);
    fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        scope,
        redirect_uri: 'http://localhost:5000/google/callback',
        grant_type: 'authorization_code',
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        res.json(new AppResponse(data));
      });
  }),
);

module.exports = router;
