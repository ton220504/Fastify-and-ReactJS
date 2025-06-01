const nodemailer = require('nodemailer');

async function sendOtpEmail(to, otp) {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Bean Mobile_Fastify" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Mã OTP khôi phục mật khẩu",
      text: `Mã OTP của bạn là: ${otp}`,
    });

    console.log("Gửi email thành công tới:", to);

  } catch (error) {
    console.error("Lỗi gửi email:", error); // 🛠 IN RA CHI TIẾT
    throw error; // Để server trả về lỗi 500 cho client biết
  }
}

module.exports = sendOtpEmail;
