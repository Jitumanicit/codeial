const nodeMailer = require('../config/nodemailer');

//this is another way of exporting a methode
exports.newComment = (comment) => {
    console.log('Inside new comment mailer');
    nodeMailer.transporter.sendMail({
        from: 'jitumani.b@mobisofttech.co.in',
        to: 'jitumanicit@gmail.com',
        subject: "New comment publish",
        html: '<h1>Yup, your comment is now published</h1>'
    }, (err, info) => {
        if(err){
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Mail sent', info);
        return;
    });
}