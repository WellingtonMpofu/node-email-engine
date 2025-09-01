const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const PORT = process.env.PORT || 3000;

// Step 1: Generate authorization URL
router.get('/auth/outlook', (req, res) => {
    const authUrl = `https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID}/oauth2/v2.0/authorize?` +
        `client_id=${process.env.OUTLOOK_CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(process.env.OUTLOOK_REDIRECT_URI)}` +
        `&scope=openid%20offline_access%20https%3A%2F%2Foutlook.office.com%2FSMTP.Send` +
        `&prompt=consent`;
    
    res.redirect(authUrl);
});

// Step 2: Handle callback and get refresh token
router.get('/auth/callback', async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.status(400).send('No authorization code received');
        }

        // Exchange code for tokens
        const tokenResponse = await axios.post(
            `https://login.microsoftonline.com/${process.env.OUTLOOK_TENANT_ID}/oauth2/v2.0/token`,
            new URLSearchParams({
                client_id: process.env.OUTLOOK_CLIENT_ID,
                client_secret: process.env.OUTLOOK_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
                grant_type: 'authorization_code',
                scope: 'openid offline_access https://outlook.office.com/SMTP.Send'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, refresh_token, expires_in } = tokenResponse.data;
        
        console.log('✅ Success! Tokens received:');
        console.log('Access Token:', access_token.substring(0, 20) + '...');
        console.log('Refresh Token:', refresh_token);
        console.log('Expires in:', expires_in, 'seconds');
        
        // Save the refresh token to your .env file or database
        // THIS IS YOUR OUTLOOK_REFRESH_TOKEN VALUE
        console.log('\n📝 Add this to your .env file:');
        console.log(`OUTLOOK_REFRESH_TOKEN=${refresh_token}`);
        
        res.send(`
            <h1>Authentication Successful!</h1>
            <p>Refresh token has been generated. Add it to your .env file:</p>
            <code>OUTLOOK_REFRESH_TOKEN=${refresh_token}</code>
            <p>You can now close this window and use the email sending functionality.</p>
        `);

    } catch (error) {
        console.error('❌ Token exchange error:', error.response?.data || error.message);
        res.status(500).send(`
            <h1>Error</h1>
            <pre>${JSON.stringify(error.response?.data || error.message, null, 2)}</pre>
        `);
    }
});

// Step 3: Test email sending after getting refresh token
router.get('/test-email', async (req, res) => {
    try {
        if (!process.env.OUTLOOK_REFRESH_TOKEN) {
            return res.send(`
                <h1>No refresh token set</h1>
                <p>Please visit <a href="/auth/outlook">/auth/outlook</a> first to get a refresh token</p>
            `);
        }

        const emailResult = await sendEmailWithOAuth2();
        res.send(`<h1>Email sent successfully!</h1><pre>${JSON.stringify(emailResult, null, 2)}</pre>`);
    } catch (error) {
        res.status(500).send(`<h1>Error sending email:</h1><pre>${error.message}</pre>`);
    }
});

// Email sending function
async function sendEmailWithOAuth2() {
    const { OutlookOAuth2 } = require('./outlook-oauth'); // Your OAuth2 class
    
    const outlookAuth = new OutlookOAuth2();
    const transporter = await outlookAuth.createTransporter();
    
    const mailOptions = {
        from: process.env.OUTLOOK_USER,
        to: process.env.OUTLOOK_USER, // Send to yourself for testing
        subject: 'Test Email with OAuth2',
        text: 'This is a test email sent using OAuth2 authentication!',
        html: '<b>This is a test email sent using OAuth2 authentication!</b>'
    };

    return await transporter.sendMail(mailOptions);
}

router.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔗 Start OAuth2 flow: http://localhost:${PORT}/auth/outlook`);
    console.log(`📧 Test email: http://localhost:${PORT}/test-email`);
});