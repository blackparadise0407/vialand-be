const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GOOGLE_SMTP_EMAIL,
    pass: process.env.GOOGLE_SMTP_PASSWORD,
  },
});

// News submission email
const newsSubmission = async ({ name, link }) =>
  await transporter.sendMail({
    from: 'no-reply@vialand.vn',
    to:
      process.env.NODE_ENV === 'development'
        ? 'blackparadise0407@gmail.com'
        : 'richardlee.via@gmail.com',
    subject: 'Xác nhận đăng tin',
    text: `
    Khách hàng vừa đăng 1 tin mới: ${name}
    Bấm vào ${link} này để kiểm duyệt nội dung
    `,
    html: `<p>Khách hàng vừa đăng 1 tin mới: <b>${name}</b></p>
    <p>Bấm vào <a href="${link}">link</a> này để kiểm duyệt nội dung</p>
    `,
  });

module.exports = {
  transporter,
  newsSubmission,
};
