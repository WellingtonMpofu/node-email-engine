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

    // Send email using Microsoft Graph API (arrow function)
    sendEmail = async (req, res) => {
        try {
            const accessToken = await this.getAccessToken();
            return res.json({ accessToken });
            const {
                recipients,
                ccRecipients,
                bccRecipients,
                subject,
                message,
                templateId
            } = req.body;

            const emailTemplate = emailTemplatesLookup[templateId];

            // Prepare recipients
            const toRecipients = recipients.map(email => ({
                emailAddress: { address: email.trim() }
            }));

            const ccRecipientsList = ccRecipients ? ccRecipients.map(email => ({
                emailAddress: { address: email.trim() }
            })) : [];

            const bccRecipientsList = bccRecipients ? bccRecipients.map(email => ({
                emailAddress: { address: email.trim() }
            })) : [];

            // Send email via Graph API
            const graphResponse = await axios.post(
                `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(process.env.OUTLOOK_USER)}/sendMail`,
                {
                    message: {
                        subject: subject,
                        body: {
                            contentType: 'HTML',
                            content: emailTemplate(message)
                        },
                        toRecipients: toRecipients,
                        ccRecipients: ccRecipientsList,
                        bccRecipients: bccRecipientsList
                    },
                    saveToSentItems: true
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Email sent successfully via Graph API');
            
            if (res) {
                res.status(200).json({ success: true, message: 'Email sent successfully' });
            }
            
            return graphResponse.data;

        } catch (error) {
            console.error('Email sending failed:', error.response?.data || error.message);
            
            if (res) {
                res.status(500).json({ 
                    success: false, 
                    error: error.response?.data?.error?.message || error.message 
                });
            }
            
            throw error;
        }
    }
}

// Create and export singleton instance
export const outlookEmailService = new OutlookEmailService();