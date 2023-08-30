const nodemailer = require("nodemailer");
const systemConfig = require(__path_configs + 'system');

const sendEmail = async(options) =>{

let transporter = nodemailer.createTransport({
  host:systemConfig.SMTP_HOST,
  port: systemConfig.SMTP_POST,
  auth: {
    user: systemConfig.SMTP_EMAIL,
    pass:systemConfig.SMTP_PASSWORD
  }
});

  let info = await transporter.sendMail({
    from: `${systemConfig.FORM_NAME} <${systemConfig.FORM_EMAIL}>`,
    to: options.email, 
    subject:options.subject, 
    text: options.message, 
  });
//   console.log("Message sent: %s", info.messageId);
  
}

module.exports = sendEmail