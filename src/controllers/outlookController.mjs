import { outlookEmailService } from '../utils/outlookEmailService.mjs';
import { outlookDelegatedEmailService } from '../utils/outlookDelegatedEmailService.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env');

const persistRefreshToken = async (refreshToken) => {
  if (!refreshToken) return;

  const existingEnv = await readFile(envPath, 'utf8');
  const refreshTokenLine = `OUTLOOK_REFRESH_TOKEN=${refreshToken}`;

  const updatedEnv = existingEnv.includes('OUTLOOK_REFRESH_TOKEN=')
    ? existingEnv.replace(/^OUTLOOK_REFRESH_TOKEN=.*$/m, refreshTokenLine)
    : `${existingEnv.trimEnd()}\n${refreshTokenLine}\n`;

  await writeFile(envPath, updatedEnv, 'utf8');
};


export const emailController = {
  startOutlookOAuth(req, res) {
    try {
      const authorizationUrl = outlookDelegatedEmailService.getAuthorizationUrl();
      return res.redirect(authorizationUrl);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to start OAuth flow',
        details: error.message
      });
    }
  },

  getOutlookAuthStatus(req, res) {
    return res.json({
      success: true,
      authenticated: outlookDelegatedEmailService.isAuthenticated(),
      message: outlookDelegatedEmailService.isAuthenticated()
        ? 'Outlook delegated auth is available for sending.'
        : 'Not authenticated. Open /api/v1/email/outlook/connect in a browser first.'
    });
  },

  getOutlookOAuthUrl(req, res) {
    try {
      const authorizationUrl = outlookDelegatedEmailService.getAuthorizationUrl();

      res.json({
        success: true,
        authorizationUrl
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create OAuth URL',
        details: error.message
      });
    }
  },

  async exchangeOutlookCode(req, res) {
    try {
      const code = req.query.code || req.body?.code;
      const tokenResult = await outlookDelegatedEmailService.exchangeCodeForTokens(code);
      await persistRefreshToken(tokenResult.refreshToken);

      return res.status(200).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 24px;">
            <h2>Outlook authentication successful</h2>
            <p>You can now send email from Postman using:</p>
            <pre>POST /api/v1/email/send/microsoft/delegated</pre>
            <p>Refresh token was saved to <code>src/.env</code>.</p>
            <p>You can close this browser tab.</p>
          </body>
        </html>
      `);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to exchange OAuth code',
        details: error.response?.data?.error_description || error.response?.data?.error || error.message
      });
    }
  },

  async sendOutlookEmail(req, res) {
    try {
      const {
        to,
        recipients,
        ccRecipients,
        bccRecipients,
        subject,
        text,
        message,
        messageHeader,
        templateId
      } = req.body;

      const recipientList = recipients || to;
      const bodyMessage = message || text;

      if (!recipientList || !subject || !bodyMessage) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: recipients (or to), subject, and message (or text)'
        });
      }

      const result = await outlookEmailService.sendEmail({
        recipients: recipientList,
        ccRecipients,
        bccRecipients,
        subject,
        message: bodyMessage,
        messageHeader,
        templateId
      });

      res.json({
        success: true,
        message: 'Email sent successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in sendEmail controller:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send email',
        details: error.response?.data?.error?.message || error.message
      });
    }
  },

  async sendOutlookEmailDelegated(req, res) {
    try {
      const {
        to,
        recipients,
        ccRecipients,
        bccRecipients,
        subject,
        text,
        message,
        messageHeader,
        templateId,
        refreshToken
      } = req.body;

      const recipientList = recipients || to;
      const bodyMessage = message || text;

      if (!recipientList || !subject || !bodyMessage) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: recipients (or to), subject, and message (or text)'
        });
      }

      const result = await outlookDelegatedEmailService.sendEmailAsCurrentUser({
        recipients: recipientList,
        ccRecipients,
        bccRecipients,
        subject,
        message: bodyMessage,
        messageHeader,
        templateId,
        refreshToken
      });

      res.json({
        success: true,
        message: 'Email sent successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in sendOutlookEmailDelegated controller:', error.response?.data || error.message);

      res.status(500).json({
        success: false,
        error: 'Failed to send email',
        details: error.response?.data?.error?.message || error.response?.data?.error_description || error.message,
        hint: error.message?.includes('Missing refresh token')
          ? 'Authenticate first by opening /api/v1/email/outlook/connect in a browser.'
          : undefined
      });
    }
  }
}
