const router = require('express').Router();
const fetch = require('node-fetch');
const {} = require('firebase-admin/firestore');

const catchAsync = require('../common/catchAsync');
const { db } = require('../libs/firebase');
const { AppResponse } = require('../common');
const { getQueryParams } = require('../utils');

router.get(
  '/',
  catchAsync(async (req, res) => {
    const { ward, province, district, action, published } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let query = db.collection('properties');
    if (ward) {
      query = query.where('ward', '==', parseInt(ward, 10));
    }
    if (province) {
      query = query.where('province', '==', parseInt(province, 10));
    }
    if (district) {
      query = query.where('district', '==', parseInt(district, 10));
    }
    if (action) {
      query = query.where('action', '==', parseInt(action, 10));
    }
    if (published) {
      query = query.where('published', '==', published === 'true');
    }

    query = query.orderBy('createdAt', 'desc');
    const snapshot = await query.limit(limit).offset(skip).get();

    // Not very optimized but haven't figured out nicer ways to implement
    const total = (await query.get()).size;

    const news = [];
    snapshot.forEach((doc) => {
      news.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    const resp = new AppResponse({
      news,
      total,
      page,
      limit,
    });
    res.send(resp);
  }),
);

module.exports = router;
