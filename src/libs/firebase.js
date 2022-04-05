const { firestore } = require('firebase-admin');
const admin = require('firebase-admin');
const { initializeApp } = require('firebase-admin/app');

const serviceAccount = require('../../credentials.json');

const app = initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

const db = admin.database();

module.exports = {
  app,
  db,
};
