const Imap = require('imap');
const fs = require('fs');

module.exports.imap = new Imap({
  user: 'blackparadise0407@gmail.com',
  password: 'lhurwbzmuuijkclo',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: {
    servername: 'imap.gmail.com',
    // ca: [fs.readFileSync('C:\\Windows\\system32\\localhost.pem', 'utf-8')],
  },
});
