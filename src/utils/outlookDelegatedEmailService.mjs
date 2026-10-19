import axios from 'axios';
import 'dotenv/config';
import { emailTemplatesLookup } from '../constants.mjs';

const GRAPH_SCOPES = 'offline_access openid profile email User.Read Mail.Send';

export class OutlookDelegatedEmailService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.refreshToken = process.env.OUTLOOK_REFRESH_TOKEN || null;
  }

  isAuthenticated = () => {
    return Boolean(this.refreshToken || process.env.OUTLOOK_REFRESH_TOKEN);
  };

  normalizeRecipients = (emails) => {
    if (!emails) return [];

    const emailList = Array.isArray(emails)
      ? emails
      : String(emails)
          .split(',')
          .map((email) => email.trim())
          .filter(Boolean);

    return emailList.map((email) => ({
      emailAddress: { address: email }
    }));
  };

  getAuthBaseUrl = () => {
    const tenant = process.env.OUTLOOK_AUTH_TENANT || 'common';
    return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0`;
  };

  getAuthorizationUrl = () => {
    const clientId = process.env.OUTLOOK_CLIENT_ID;
    const redirectUri = process.env.OUTLOOK_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      throw new Error('Missing OUTLOOK_CLIENT_ID or OUTLOOK_REDIRECT_URI');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      response_mode: 'query',
      scope: GRAPH_SCOPES,
      prompt: 'select_account'
    });

    return `${this.getAuthBaseUrl()}/authorize?${params.toString()}`;
  };

  exchangeCodeForTokens = async (code) => {
    if (!code) {
      throw new Error('Missing authorization code');
    }

    const clientId = process.env.OUTLOOK_CLIENT_ID;
    const clientSecret = process.env.OUTLOOK_CLIENT_SECRET;
    const redirectUri = process.env.OUTLOOK_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET, or OUTLOOK_REDIRECT_URI');
    }

    const response = await axios.post(
      `${this.getAuthBaseUrl()}/token`,
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        scope: GRAPH_SCOPES
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    this.accessToken = response.data.access_token;
    this.refreshToken = response.data.refresh_token || this.refreshToken;
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      scope: response.data.scope,
      tokenType: response.data.token_type
    };
  };

  getAccessTokenFromRefreshToken = async (overrideRefreshToken) => {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    const refreshToken = overrideRefreshToken || this.refreshToken || process.env.OUTLOOK_REFRESH_TOKEN;

    if (!refreshToken) {
      throw new Error('Missing refresh token. Complete OAuth flow first.');
    }

    const clientId = process.env.OUTLOOK_CLIENT_ID;
    const clientSecret = process.env.OUTLOOK_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Missing OUTLOOK_CLIENT_ID or OUTLOOK_CLIENT_SECRET');
    }

    const response = await axios.post(
      `${this.getAuthBaseUrl()}/token`,
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        scope: GRAPH_SCOPES
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    this.accessToken = response.data.access_token;
    this.refreshToken = response.data.refresh_token || refreshToken;
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

    return this.accessToken;
  };

  sendEmailAsCurrentUser = async ({
    recipients,
    ccRecipients,
    bccRecipients,
    subject,
    message,
    messageHeader,
    templateId = 3,
    saveToSentItems = true,
    refreshToken
  }) => {
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

    const accessToken = await this.getAccessTokenFromRefreshToken(refreshToken);

    await axios.post(
      'https://graph.microsoft.com/v1.0/me/sendMail',
      {
        message: {
          subject,
          body: {
            contentType: 'HTML',
            content: emailTemplate(message, messageHeader)
          },
          toRecipients,
          ccRecipients: ccRecipientsList,
          bccRecipients: bccRecipientsList
        },
        saveToSentItems
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      message: 'Email sent successfully with delegated permissions'
    };
  };
}

export const outlookDelegatedEmailService = new OutlookDelegatedEmailService();
