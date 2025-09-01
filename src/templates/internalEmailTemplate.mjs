// const impalaLogo = require('./assets/images/impalaLogo.svg')
export const internalEmailTemplate = (message) => {
    return (
        `
                <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style type="text/css">
        /* Base styles */
        body {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
            line-height: 1.5;
        }
        
        /* Email wrapper */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
        }
        
        /* Header styles */
        .header {
            padding: 20px 15px;
            text-align: center;
            background-color: #ffffff;
            border-bottom: 1px solid green;
        }
        
        .logo {
            width: 180px;
            height: auto;
            max-width: 100%;
        }
        
        .logo-link {
            display: inline-block;
            text-decoration: none;
        }
        
        /* Content styles */
        .content {
            padding: 20px 25px;
        }
        
        .content-inner {
            padding: 0 5px;
        }
        
        h3 {
            color: #222222;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 600;
        }
        
        p {
            margin-bottom: 15px;
            font-size: 15x;
            line-height: 1.4;
        }
        
        /* Footer styles */
        .footer {
            padding: 20px 20px;
            background-color: #f8f9fa;
            font-size: 14px;
            color: #666666;
        }
        
        .footer-bottom {
            text-align: center;
            font-size: 13px;
        }
        
        .footer-bottom p {
            margin-bottom: 8px;
        }
        
        .footer-bottom a {
            color: #666666;
            text-decoration: none;
            margin: 0 5px;
        }
        
        .footer-bottom a:hover {
            text-decoration: underline;
        }
        
        /* Responsive adjustments */
        @media screen and (min-width: 480px) {
            .header {
                padding: 25px 20px;
            }
            
            .logo {
                width: 200px;
            }
            
            .content {
                padding: 25px 30px;
            }
            
            .footer {
                padding: 20px 25px;
            }
        }
        
        @media screen and (min-width: 600px) {
            
            .content-inner {
                padding: 0 10px;
            }
            
            h3 {
                font-size: 18px;
            }
            
            p {
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header Section -->
        <header class="header">
            <a href="https://impala.co.zw" class="logo-link">
                <img src="https://impala.co.zw/wp-content/uploads/2021/05/logo-dark.png" alt="Impala Car Rental Logo" class="logo" />
            </a>
        </header>
        
        <!-- Main Content Section -->
        <div class="content">
            <div class="content-inner">
                <h3>Hello there!</h3>
                <p>${message}</p>
                <p>Best regards,<br>Admin Team</p>
            </div>
        </div>
        
        <!-- Footer Section -->
        <footer class="footer">
            <div class="footer-bottom">
                <p>&copy; 2025 Impala Car Rental. All rights reserved.</p>
                <p>
                    <a href="https://impala.co.zw/privacy">Privacy Policy</a> |
                    <a href="https://impala.co.zw/terms">Terms of Service</a>
                </p>
            </div>
        </footer>
    </div>
</body>
</html>

    `
    )

}

