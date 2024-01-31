import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";

const sendEmail = async (email, subject, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            service: process.env.MAIL_SERVICE,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        transporter.use('compile', hbs({
            viewEngine: {
                extname: '.handlebars',
                layoutsDir: 'src/templates/',
                defaultLayout: 'resetPassword',
            },
            viewPath: 'src/templates',
            extName: '.handlebars',
        }));

        const mail = {
            from: process.env.USER,
            to: email,
            subject: subject,
            template: 'resetPassword',
            context: {
                email: email,
                otp: otp
            }
        }
        await transporter.sendMail(mail);

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

export default sendEmail;


