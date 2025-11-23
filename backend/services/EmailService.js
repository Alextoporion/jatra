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

    }catch(err){
        console.error("Error sending email", err);
    }
}