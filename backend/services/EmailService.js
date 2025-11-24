const nodeMailer = require('nodemailer');

const transporter =nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})
const sendEmail = async (to, subject, text) => {
    try{
        const mailOptions= {
            from:`your email service <${process.env.EMAIL_USER}>`,
            to:to,
            subject:subject,
            html:html

        }
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    }catch(err){
        console.error("Error sending email", err);
    }
}
module.exports = {sendEmail};