import nodemailer from "nodemailer"
import { ClientSecretCredential } from "@azure/identity"
class EmailService {
    constructor() {
      this.transporter = null;
      this.accessToken = null;
      this.tokenExpiry = null;
    }
  
    async getAccessToken() {
      // Check if we have a valid token
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry - 300000) {
        return this.accessToken;
      }
  
      try {
        const credential = new ClientSecretCredential(
          process.env.OUTLOOK_TENANT_ID,
          process.env.OUTLOOK_CLIENT_ID,
          process.env.OUTLOOK_CLIENT_SECRET
        );
  
        const tokenResponse = await credential.getToken('https://outlook.office365.com/.default');
        
        this.accessToken = tokenResponse.token;
        this.tokenExpiry = tokenResponse.expiresOnTimestamp;
        
        return this.accessToken;
      } catch (error) {
        console.error('Failed to get access token:', error);
        throw error;
      }
    }
  
    async createTransporter() {
      try {
        const accessToken = await this.getAccessToken();
  
        const transporter = nodemailer.createTransport({
          host: 'smtp.office365.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            type: 'OAuth2',
            user: process.env.OUTLOOK_USER,
            accessToken: accessToken,
            clientId: process.env.OUTLOOK_CLIENT_ID,
            clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
            tenantId: process.env.OUTLOOK_TENANT_ID,
            refreshToken: '' // Not needed for client credentials flow
          },
          tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
          }
        });
  
        // Verify transporter configuration
        await transporter.verify();
        console.log('SMTP transporter configured successfully');
        
        return transporter;
      } catch (error) {
        console.error('Failed to create transporter:', error);
        throw error;
      }
    }
  
    async sendEmail(emailData) {
      try {
        if (!this.transporter) {
          this.transporter = await this.createTransporter();
        }
  
        const mailOptions = {
          from: process.env.OUTLOOK_USER,
          to: emailData.to,
          subject: emailData.subject,
          text: emailData.text,
          headers: {
            'X-Mailer': 'NodeMailer with OUTLOOK AD',
            'X-Priority': '3'
          }
        };
  
        const result = await this.transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId, response: result.response };
      } catch (error) {
        console.error('Error sending email:', error);
        
        // If it's an authentication error, try to refresh the token
        if (error.responseCode === 535 || error.responseCode === 534) {
          console.log('Authentication failed, refreshing token...');
          this.accessToken = null;
          this.tokenExpiry = null;
          this.transporter = await this.createTransporter();
          
          // Retry once
          const retryResult = await this.transporter.sendMail({
            from: process.env.OUTLOOK_USER,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
            html: emailData.html
          });
          
          console.log('Email sent successfully after retry:', retryResult.messageId);
          return { success: true, messageId: retryResult.messageId, response: retryResult.response };
        }
        
        throw error;
      }
    }
  
  }


export const emailController = {
  async sendOutlookEmail(req, res) {
    try {
      const { to, subject, text } = req.body;

      if (!to || !subject || (!text)) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: to, subject, and text or html'
        });
      }

      const result = await new EmailService().sendEmail({
        to,
        subject,
        text
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
        details: error.message
      });
    }
  }
}
