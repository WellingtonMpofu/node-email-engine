import axios from 'axios';
import "dotenv/config";
import { emailTemplatesLookup } from '../constants.mjs'

export class OutlookEmailService {
    constructor() {
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    // Get access token using client credentials flow (arrow function)
    getAccessToken = async () => {
        if (this.accessToken && this.tokenExpiry > Date.now()) {
            return this.accessToken;
        }

        try {
            const tokenUrl = `https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID}/oauth2/v2.0/token`;

            const response = await axios.post(tokenUrl,
                new URLSearchParams({
                    client_id: process.env.OUTLOOK_CLIENT_ID,
                    client_secret: process.env.OUTLOOK_CLIENT_SECRET,
                    scope: 'https://graph.microsoft.com/.default',
                    grant_type: 'client_credentials'
                }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
            return this.accessToken;

        } catch (error) {
            console.error('❌ Token acquisition failed:', error.response?.data || error.message);
            throw error;
        }
    }

    normalizeRecipients = (emails) => {
        if (!emails) return [];

        const emailList = Array.isArray(emails)
            ? emails
            : String(emails)
                .split(',')
                .map(email => email.trim())
                .filter(Boolean);

        return emailList.map(email => ({
            emailAddress: { address: email }
        }));
    }

    // Send email using Microsoft Graph API
    sendEmail = async ({
        recipients,
        ccRecipients,
        bccRecipients,
        subject,
        message,
        messageHeader,
        templateId = 3,
        saveToSentItems = true
    }) => {
        try {
            const accessToken = await this.getAccessToken();
            const emailTemplate = emailTemplatesLookup[templateId];

            if (!emailTemplate) {
                throw new Error(`Invalid templateId: ${templateId}`);
            }

            const toRecipients = this.normalizeRecipients(recipients);
            const ccRecipientsList = this.normalizeRecipients(ccRecipients);
            const bccRecipientsList = this.normalizeRecipients(bccRecipients);

            if (toRecipients.length === 0) {
                throw new Error('At least one recipient is required');
            }

            if (!subject) {
                throw new Error('Email subject is required');
            }

            if (!message) {
                throw new Error('Email message is required');
            }

            // Send email via Graph API
            await axios.post(
                `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(process.env.OUTLOOK_USER)}/sendMail`,
                {
                    message: {
                        subject: subject,
                        body: {
                            contentType: 'HTML',
                            content: emailTemplate(message, messageHeader)
                        },
                        toRecipients: toRecipients,
                        ccRecipients: ccRecipientsList,
                        bccRecipients: bccRecipientsList
                    },
                    saveToSentItems
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Email sent successfully via Graph API');

            return {
                success: true,
                message: 'Email sent successfully'
            };

        } catch (error) {
            console.error('Email sending failed:', error.response?.data || error.message);

            throw error;
        }
    }
}

// Create and export singleton instance
export const outlookEmailService = new OutlookEmailService();