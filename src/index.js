const https = require('https');
const { inspect } = require('util');
const Imap = require('imap');
const express = require('express');
const fs = require('fs');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const { notFound, error } = require('./middlewares/error');
const { imap } = require('./libs/imap');
const res = require('express/lib/response');
const { AppError } = require('./common');

const options = {
  key: fs.readFileSync('C:\\Windows\\system32\\localhost-key.pem', 'utf-8'),
  cert: fs.readFileSync('C:\\Windows\\system32\\localhost.pem', 'utf-8'),
};

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(
  cors({
    origin: '*',
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// imap.once('ready', () => {
//   imap.openBox('INBOX', true, function (err, box) {
//     // call function to select the mailbox inbox to fetch new emails from inbox
//     var f = imap.seq.fetch('1:3', {
//       bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
//       struct: true,
//     });

//     f.on('message', function (msg, seqno) {});

//     f.once('error', function (err) {
//       console.log('Fetch error: ' + err);
//     });

//     f.once('end', function () {
//       console.log('Done fetching all messages!');
//       imap.end();
//     });
//   });
// });
// imap.connect();
imap.connect();

app.get('/inbox', (req, res) => {
  imap.once('ready', () => {
    imap.openBox('INBOX', true, (err, box) => {
      if (err) {
        throw err;
      }

      imap.search(['ALL', ['SINCE', 'Mar 20, 2022']], function (err, results) {
        if (err) throw err;
        var f = imap.fetch(results, { bodies: '' });
        f.on('message', function (msg, seqno) {
          console.log('Message #%d', seqno);
          var prefix = '(#' + seqno + ') ';
          msg.on('body', function (stream, info) {
            console.log(prefix + 'Body');
            stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
          });
          msg.once('attributes', function (attrs) {
            console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
          });
          msg.once('end', function () {
            console.log(prefix + 'Finished');
          });
          res.send('Ok');
        });
        f.once('error', function (err) {
          console.log('Fetch error: ' + err);
        });
        f.once('end', function () {
          console.log('Done fetching all messages!');
          imap.end();
        });
      });
    });
  });
});
app.use('/auth', require('./routes/auth'));

app.use(notFound);
app.use(error);

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
https.createServer(options, app).listen(PORT);
