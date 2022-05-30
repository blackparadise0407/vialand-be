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
        : 'vialand.com@gmail.com',
    subject: 'Xác nhận đăng tin',
    text: `
    Khách hàng vừa đăng 1 tin mới: ${name}
    Bấm vào ${link} này để kiểm duyệt nội dung
    `,
    html: `<p>Khách hàng vừa đăng 1 tin mới: <b>${name}</b></p>
    <p>Bấm vào <a href="${link}">link</a> này để kiểm duyệt nội dung</p>
    `,
  });

// Refresh token notification
const refreshTokenNotification = async ({ link }) =>
  await transporter.sendMail({
    from: 'no-reply@vialand.vn',
    to:
      process.env.NODE_ENV === 'development'
        ? 'blackparadise0407@gmail.com'
        : process.env.RECEIVER,
    subject: 'Refresh token',
    text: `
    Token đã hết hạn, vui lòng bấm vào <a href="${link}">link</a> để gia hạn token
    `,
    html: `
    <p>Token đã hết hạn, vui lòng bấm vào <a href="${link}">link</a> để gia hạn token</p>
    `,
  });

const fileUploadNotification = async () => {
  await transporter.sendMail({
    from: 'no-reply@vialand.vn',
    to:
      process.env.NODE_ENV === 'development'
        ? 'blackparadise0407@gmail.com'
        : process.env.RECEIVER,
    subject: 'Thông báo upload tập tin',
    text: `
    Có người dùng đã upload tập tin lên hệ thống
    `,
    html: `
    <p>Có người dùng đã upload tập tin lên hệ thống</p>
    `,
  });
};

module.exports = {
  transporter,
  newsSubmission,
  refreshTokenNotification,
  fileUploadNotification,
};
