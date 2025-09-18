import nodemailer from 'nodemailer';
import ical, { ICalCalendarMethod } from 'ical-generator';
import "dotenv/config";
import { emailTemplatesLookup } from '../constants.mjs';
// import { sendEmailWithOAuth2 } from './outlookController.mjs';

// create a nodemailer gmailTransporter
const gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})

// create a nodemailer gmailTransporter
const outlookTransporter = nodemailer.createTransport({
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

export const sendEmail = async (req, res) => {
    try {
        const {
            recipients,
            ccRecipients,
            bccRecipients,
            subject,
            message,
            templateId
        } = req.body

        const emailTemplate = emailTemplatesLookup[templateId]

        // email options
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: recipients,
            cc: ccRecipients,
            bcc: bccRecipients,
            subject,
            // html: getEmailTemplate("Wellington", "$200.00", 190430, "2024-09-34", "34-44-02", "Description Here", "$200.00")
            html: emailTemplate(message),
        }

        // send the email
        await gmailTransporter.sendMail(mailOptions)
        res.status(200).send('Email sent successfully')
    }
    catch (error) {
        res.status(500).send(error.message)
    }
}


export const sendEmailWithAttachments = async (req, res) => {
    try {
        const attachments = req.files
        if (attachments.length === 0) {
            return res.status(400).json({ error: "No email attachments found" })
        }

        const emailDetails = JSON.parse(req.body.emailDetails)
        const {
            recipients,
            ccRecipients,
            bccRecipients,
            subject,
            message,
            templateId
        } = emailDetails

        // Format attachments properly for Nodemailer
        const formattedAttachments = attachments.map(file => ({
            filename: file.originalname,
            content: file.buffer, // Use buffer instead of path
            contentType: file.mimetype,
        }))

        const emailTemplate = emailTemplatesLookup[templateId]

        // email options
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: recipients,
            cc: ccRecipients,
            bcc: bccRecipients,
            subject,
            text: message,
            html: emailTemplate(message),
            attachments: formattedAttachments
        }

        // send the email
        await gmailTransporter.sendMail(mailOptions)
        res.status(200).send('Email sent successfully')
    }
    catch (error) {
        res.status(500).send(error.message)
    }
}

export const sendCalendarEvent = async (req, res) => {
    try {

        const { eventDetails, email, templateId } = req.body;

        const emailTemplate = emailTemplatesLookup[templateId]

        // Create calendar event
        const calendar = ical({
            name: 'Event Invitation',
        })

        // A method is required for outlook to display event as an invitation
        calendar.method(ICalCalendarMethod.REQUEST);

        // Add event to calendar
        calendar.createEvent({
            start: new Date(eventDetails.start),
            end: new Date(eventDetails.end),
            summary: eventDetails.title,
            description: eventDetails.description,
            location: eventDetails.location,
            url: eventDetails.url,
            organizer: {
                name: eventDetails.organizer.name,
                email: eventDetails.organizer.email
            },
            attendees: eventDetails.attendees.map(attendee => ({
                name: attendee.name,
                email: attendee.email,
                rsvp: true,
                role: 'REQ-PARTICIPANT'
            })),
            alarms: [
                {
                    type: 'display',
                    trigger: 600 // 10 minutes before
                }
            ]
        });

        // Email options
        const mailOptions = {
            from: `"${eventDetails.organizerName}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Invitation: ${eventDetails.title}`,
            // text: `You've been invited to ${eventDetails.title}`,
            html: emailTemplate(`You've been invited to ${eventDetails.title}. Download The attachment below and add the event to your calendar.`),
            icalEvent: {
                filename: 'invite.ics',
                method: 'REQUEST',
                content: calendar.toString()
            },
            headers: {
                'X-Mailer': 'CalendarInviteService'
            }
        };

        // Send email
        await gmailTransporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Calendar invite sent successfully' });

    } catch (err) {
        console.error('Failed to send:', err);
        res.status(500).json({ error: err.message });
    }
}

// export const sendMicrosoftEmail = async (req, res) => {
//     try {
//         const {
//             recipients,
//             subject,
//             message
//         } = req.body

//         await sendEmailWithOAuth2({...req.body});
//         res.status(200).send('Email sent successfully')
//     }
//     catch (error) {
//         console.error("Error sending email via Outlook:", error);
//         res.status(500).send(error.message)
//     }
// }