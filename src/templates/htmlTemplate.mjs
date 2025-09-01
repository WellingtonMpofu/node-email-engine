
export const getEmailTemplate = (name, total, invoice_id, due_date, date, description, amount) => (
    //     `
    //     <!DOCTYPE html>
    // <html>
    // <head>
    //     <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    //     <meta http-equiv="X-UA-Compatible" content="IE=edge">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title></title>

    //     <!--[if !mso]><!-->
    //     <style type="text/css">
    //         @import url('https://fonts.mailersend.com/css?family=Inter:400,600');
    //     </style>
    //     <!--<![endif]-->

    //     <style type="text/css" rel="stylesheet" media="all">
    //         @media only screen and (max-width: 640px) {
    //             .ms-header {
    //                 display: none !important;
    //             }
    //             .ms-content {
    //                 width: 100% !important;
    //                 border-radius: 0;
    //             }
    //             .ms-content-body {
    //                 padding: 30px !important;
    //             }
    //             .ms-footer {
    //                 width: 100% !important;
    //             }
    //             .mobile-wide {
    //                 width: 100% !important;
    //             }
    //             .info-lg {
    //                 padding: 30px;
    //             }
    //         }
    //     </style>
    //     <!--[if mso]>
    //     <style type="text/css">
    //     body { font-family: Arial, Helvetica, sans-serif!important  !important; }
    //     td { font-family: Arial, Helvetica, sans-serif!important  !important; }
    //     td * { font-family: Arial, Helvetica, sans-serif!important  !important; }
    //     td p { font-family: Arial, Helvetica, sans-serif!important  !important; }
    //     td a { font-family: Arial, Helvetica, sans-serif!important  !important; }
    //     td span { font-family: Arial, Helvetica, sans-serif!important  !important; }
    //     td div { font-family: Arial, Helvetica, sans-serif!important  !important; }
    //     td ul li { font-family: Arial, Helvetica, sans-serif!important  !important; }
    //     td ol li { font-family: Arial, Helvetica, sans-serif!important  !important; }
    //     td blockquote { font-family: Arial, Helvetica, sans-serif!important  !important; }
    //     th * { font-family: Arial, Helvetica, sans-serif!important  !important; }
    //     </style>
    //     <![endif]-->
    // </head>
    // <body style="font-family:'Inter', Helvetica, Arial, sans-serif; width: 100% !important; height: 100%; margin: 0; padding: 0; -webkit-text-size-adjust: none; background-color: #f4f7fa; color: #4a5566;" >

    // <div class="preheader" style="display:none !important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;" ></div>

    // <table class="ms-body" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;background-color:#f4f7fa;width:100%;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
    //     <tr>
    //         <td align="center" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >

    //             <table class="ms-container" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >
    //                 <tr>
    //                     <td align="center" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >

    //                         <table class="ms-header" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;" >
    //                             <tr>
    //                                 <td height="40" style="font-size:0px;line-height:0px;word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;" >
    //                                     &nbsp;
    //                                 </td>
    //                             </tr>
    //                         </table>

    //                     </td>
    //                 </tr>
    //                 <tr>
    //                     <td align="center" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >

    //                         <table class="ms-content" width="640" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;width:640px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;background-color:#FFFFFF;border-radius:6px;box-shadow:0 3px 6px 0 rgba(0,0,0,.05);" >
    //                             <tr>
    //                                 <td class="ms-content-body" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding-top:40px;padding-bottom:40px;padding-right:50px;padding-left:50px;" >

    //                                     <p class="logo" style="margin-right:0;margin-left:0;line-height:28px;font-weight:600;font-size:21px;color:#111111;text-align:center;margin-top:0;margin-bottom:40px;" ><span style="color:#0052e2;font-family:Arial, Helvetica, sans-serif;font-size:30px;vertical-align:bottom;" >❖&nbsp;</span>Company</p>

    //                                     <h1 style="margin-top:0;color:#111111;font-size:24px;line-height:36px;font-weight:600;margin-bottom:24px;" >Hi ${name},</h1>
    //                                     <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;" >
    //                                         <tr>
    //                                             <td class="info" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding-top:20px;padding-bottom:20px;padding-right:20px;padding-left:20px;border-radius:4px;background-color:#f4f7fa;" >

    //                                                 <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;" >
    //                                                     <tr>
    //                                                         <td style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >
    //                                                             <strong style="font-weight:600;" >Amount Due:</strong> ${total}}
    //                                                         </td>
    //                                                     </tr>
    //                                                     <tr>
    //                                                         <td style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >
    //                                                             <strong style="font-weight:600;" >Due By:</strong> ${due_date}
    //                                                         </td>
    //                                                     </tr>
    //                                                 </table>

    //                                             </td>
    //                                         </tr>
    //                                     </table>

    //                                     <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;" >
    //                                         <tr>
    //                                             <td style="padding-top:20px;padding-bottom:20px;padding-right:0;padding-left:0;word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >

    //                                                 <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;" >
    //                                                     <tr>
    //                                                         <td valign="middle" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >
    //                                                             <h3 style="margin-top:0;color:#111111;font-size:18px;line-height:26px;font-weight:600;margin-bottom:24px;" >${invoice_id}</h3>
    //                                                         </td>
    //                                                         <td align="right" valign="middle" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >
    //                                                             <h3 style="margin-top:0;color:#111111;font-size:18px;line-height:26px;font-weight:600;margin-bottom:24px;" >${date}</h3>
    //                                                         </td>
    //                                                     </tr>
    //                                                 </table>

    //                                                 <table class="table" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;" >
    //                                                     <tr>
    //                                                         <th align="left" style="font-family:'Inter', Helvetica, Arial, sans-serif;padding-top:10px;padding-bottom:10px;padding-right:0;padding-left:0;color:#85878E;font-size:13px;font-weight:600;line-height:18px;" >
    //                                                             Description
    //                                                         </th>
    //                                                         <th align="right" style="font-family:'Inter', Helvetica, Arial, sans-serif;padding-top:10px;padding-bottom:10px;padding-right:0;padding-left:0;color:#85878E;font-size:13px;font-weight:600;line-height:18px;" >
    //                                                             Amount
    //                                                         </th>
    //                                                     </tr>

    //                                                     <tr>
    //                                                         <td valign="middle" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding-top:14px;padding-bottom:14px;padding-right:0;padding-left:0;border-top-width:1px;border-top-style:solid;border-top-color:#e2e8f0;" >
    //                                                             ${description}
    //                                                         </td>
    //                                                         <td valign="middle" align="right" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding-top:14px;padding-bottom:14px;padding-right:0;padding-left:0;border-top-width:1px;border-top-style:solid;border-top-color:#e2e8f0;" >
    //                                                             ${amount}
    //                                                         </td>
    //                                                     </tr>

    //                                                     <tr>
    //                                                         <td style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding-top:14px;padding-bottom:14px;padding-right:0;padding-left:0;border-top-width:1px;border-top-style:solid;border-top-color:#e2e8f0;" >
    //                                                             <h4 style="margin-top:0;color:#111111;font-size:16px;line-height:24px;font-weight:600;margin-bottom:16px;" >Total</h4>
    //                                                         </td>
    //                                                         <td align="right" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding-top:14px;padding-bottom:14px;padding-right:0;padding-left:0;border-top-width:1px;border-top-style:solid;border-top-color:#e2e8f0;" >
    //                                                             <h4 style="margin-top:0;color:#111111;font-size:16px;line-height:24px;font-weight:600;margin-bottom:16px;" >${total}</h4>
    //                                                         </td>
    //                                                     </tr>
    //                                                 </table>

    //                                             </td>
    //                                         </tr>
    //                                     </table>

    //                                     <table width="100%" style="border-collapse:collapse;" >
    //                                         <tr>
    //                                             <td height="20" style="font-size:0px;line-height:0px;word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;" >
    //                                                 &nbsp;
    //                                             </td>
    //                                         </tr>
    //                                         <tr>
    //                                             <td height="20" style="font-size:0px;line-height:0px;border-top-width:1px;border-top-style:solid;border-top-color:#e2e8f0;word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;" >
    //                                                 &nbsp;
    //                                             </td>
    //                                         </tr>
    //                                     </table>

    //                                     <p class="small" style="color:#4a5566;margin-top:20px;margin-bottom:20px;margin-right:0;margin-left:0;font-size:14px;line-height:21px;" >If you’re having trouble with the button above, copy and paste the URL below into your web browser.</p>

    //                                 </td>
    //                             </tr>
    //                         </table>

    //                     </td>
    //                 </tr>
    //                 <tr>
    //                     <td align="center" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;" >

    //                         <table class="ms-footer" width="640" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;width:640px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;" >
    //                             <tr>
    //                                 <td class="ms-content-body" align="center" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;padding-top:40px;padding-bottom:40px;padding-right:50px;padding-left:50px;" >
    //                                     <p class="small" style="margin-top:20px;margin-bottom:20px;margin-right:0;margin-left:0;color:#96a2b3;font-size:14px;line-height:21px;" >&copy; 2020 ${name}. All rights reserved.</p>
    //                                     <p class="small" style="margin-top:20px;margin-bottom:20px;margin-right:0;margin-left:0;color:#96a2b3;font-size:14px;line-height:21px;" >
    //                                         1234 Street Rd.
    //                                         <br>Suite 1234
    //                                         <br>City, State, ZIP Code
    //                                     </p>
    //                                 </td>
    //                             </tr>
    //                         </table>

    //                     </td>
    //                 </tr>
    //             </table>

    //         </td>
    //     </tr>
    // </table>

    // </body>
    // </html>
    //     `

    `
    <!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 5px;
            overflow: hidden;
        }
        .header {
            background-color: #003366;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .content {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }
        .content h1 {
            font-size: 20px;
            margin-bottom: 10px;
        }
        .content ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .content ul li {
            margin-bottom: 8px;
        }
        .partners-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .partners-text {
            width: 70%;
            font-size: 14px;
        }

        .partners-logo {
            width: 30%;
            text-align: right;
        }

        .partners-logo img {
            max-width: 100%;
            height: auto;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 20px;
            font-size: 14px;
            color: #777777;
        }
        .footer-content {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
        }
        .contact-details {
            width: 60%;
            font-size: 12px;
            padding-right: 10px;
        }
        .contact-details p {
            margin: 5px 0;
        }
        .social-icons {
            width: 38%;
            display: flex;
            justify-content: flex-end;
            gap: 15px;
        }
        .social-icons img {
            width: 30px;
            height: auto;
        }
        .footer a {
            color: #003366;
            text-decoration: none;
        }
        .logo {
            width: 170px;
            height: auto;
        }
@media only screen and (max-width: 600px) {
            .partners-section {
                flex-direction: column;
                text-align: center;
            }
            .partners-text, .partners-logo {
                width: 100%;
                margin-bottom: 10px;
            }
            .partners-logo img {
                max-width: 150px;
            }
            .footer-content {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            .contact-details, .social-icons {
                width: 100%;
                margin-bottom: 10px;
            }
            .social-icons {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>CUSTOMER NOTICE</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h1>To Our Valued Clients</h1>
            <p>
                We urge all CBZ Insurance customers to quote their policy numbers when
                paying for premiums. This allows for your premium to be:
            </p>
            <ul>
                <li>Easily identified in the system</li>
                <li>Allocated to the right policy</li>
                <li>Minimize delays in claim settlements</li>
            </ul>
            <p>
                Ensuring your premiums are updated timeously.
            </p>
            <div class="partners-section">
                <p class="partners-text">
                    <strong>Partners for Success</strong>
                </p>
                <div class="partners-logo">
                    <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/db/CBZ_Holdings_Logo.png"
                    alt="CBZ Insurance Logo"
                    />
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <!-- Contact Details -->
                <div class="contact-details">
                    <p>
                        Call: +263 8677004050 | Toll Free: 460 / 461
                    </p>
                    <p>
                        WhatsApp: +263 774 460 460 / 774 461 461
                    </p>
                    <p>
                        Mail: <a href="mailto:contactcentre@cbz.co.zw">contactcentre@cbz.co.zw</a>
                    </p>
                    <p>
                        Site: <a href="https://www.cbz.co.zw">www.cbz.co.zw</a>
                    </p>
                </div>
                <!-- Social Media Icons -->
                <div class="social-icons">
                    <a href="https://www.facebook.com/CBZHoldings/">
                        <img
                        src="https://cdn-icons-png.flaticon.com/128/145/145802.png"
                        alt="Facebook"
                        />
                    </a>
                    <a href="https://x.com/CBZHoldings?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor">
                        <img
                        src="https://cdn-icons-png.flaticon.com/128/5969/5969020.png"
                        alt="Twitter"
                        />
                    </a>
                    <a href="https://www.instagram.com/cbzholdings/?hl=en">
                        <img
                        src="https://cdn-icons-png.flaticon.com/128/3955/3955024.png"
                        alt="Instagram"
                        />
                    </a>
                    <a href="https://www.linkedin.com/company/cbzholdings/?originalSubdomain=zw">
                        <img
                        src="https://cdn-icons-png.flaticon.com/128/3670/3670147.png"
                        alt="LinkedIn"
                        />
                    </a>
                    <a href="https://www.youtube.com/channel/UCRVBpVa1r_oKWzaUSpZx1KQ">
                        <img
                        src="https://cdn-icons-png.flaticon.com/128/1384/1384060.png"
                        alt="YouTube"
                        />
                    </a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`
)