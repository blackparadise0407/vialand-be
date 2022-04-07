const admin = require('firebase-admin');
const { initializeApp } = require('firebase-admin/app');

const serviceAccount = {
  type: 'service_account',
  project_id: 'vialand-82e83',
  private_key_id: process.env.FBSA_PRIVATE_KEY_ID,
  private_key: process.env.FBSA_PRIVATE_KEY,
  client_email: process.env.FBSA_CLIENT_EMAIL,
  client_id: process.env.FBSA_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mqaiz%40vialand-82e83.iam.gserviceaccount.com',
};

const app = initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

const db = admin.firestore();

module.exports = {
  app,
  db,
};
