const qs = require('qs');
const { db } = require('../libs/firebase');
const { refreshTokenNotification } = require('../libs/nodemailer');

module.exports.getQueryParams = (query) => {
  return qs.parse(query);
};

module.exports.renewRefreshToken = async () => {
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
};
