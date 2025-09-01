// const impalaLogo = require('./assets/images/impalaLogo.svg')
export const customerEmailTemplate = (message) => {
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
            padding: 25px 20px;
            background-color: #f8f9fa;
            font-size: 14px;
            color: #666666;
        }
        
        .footer-columns {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            margin-bottom: 2px;
        }
        
        .footer-column {
            width: 100%;
            padding: 0 10px;
            margin-bottom: 20px;
        }
        
        .footer-title {
            font-weight: bold;
            margin-bottom: 12px;
            color: #333333;
            text-transform: uppercase;
            font-size: 15px;
            letter-spacing: 0.5px;
        }
        
        .footer-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-list li {
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .footer-list a {
            color: #666666;
            text-decoration: none;
            transition: color 0.2s ease;
        }
        
        .footer-list a:hover {
            color: green;
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
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
                padding: 30px 25px;
            }
        }
        
        @media screen and (min-width: 600px) {
            .footer-columns {
                flex-direction: row;
                justify-content: space-between;

            }
            .footer-column {
                width: 45%;
            }
            
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
                <p>Best regards,<br>The Impala Team</p>
            </div>
        </div>
        
        <!-- Footer Section -->
        <footer class="footer">
            <div class="footer-columns">
                <div class="footer-column">
                    <div class="footer-title">OUR SERVICES</div>
                    <ul class="footer-list">
                        <li><a href="https://impala.co.zw/self-drive" target="_blank">Self Drive Rentals</a></li>
                        <li><a href="https://impala.co.zw/chauffeur" target="_blank">Chauffeur Driven Rentals</a></li>
                        <li><a href="https://impala.co.zw/airport-transfers" target="_blank">Airport Transfers</a></li>
                        <li><a href="https://impala.co.zw/shuttle-services" target="_blank">Shuttle Services</a></li>
                    </ul>
                </div>
                
                <div class="footer-column">
                    <div class="footer-title">GET IN TOUCH WITH US</div>
                    <ul class="footer-list">
                        <li>Harare: +263 77 238 2946</li>
                        <li>Bulawayo: +263 71 284 0076</li>
                        <li>Vic Falls: +263 71 938 2946</li>
                        <li>Email: info@impala.co.zw</li>
                        <li>Customer Care: customercare@impala.co.zw</li>
                    </ul>
                </div>
            </div>
            
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

