import nodemailer from 'nodemailer';
import "dotenv/config";

// create a nodemailer gmailTransporter
export const gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})

// create a nodemailer outlookTransporter
export const outlookTransporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.OUTLOOK_USER,
        pass: process.env.OUTLOOK_PASSWORD
    },
    tls: {
        ciphers: 'SSLv3',
    }
})

export const getCustomTransporter = (user) => (
    nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),  // 465
        secure: true,                          // true = SSL (required for port 465)
        auth: {
            user,
            pass: process.env.MAIL_PASS,
        },
    })
)

export const getTransporter = (emailType, user) => {
    switch (emailType) {
        case "gmail":
            return gmailTransporter;
        case "outlook":
            return outlookTransporter;
        default:
            return getCustomTransporter(user);
    }
}
