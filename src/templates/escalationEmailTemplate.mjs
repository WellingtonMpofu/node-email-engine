/**
 * Task Escalation & Document Verification Notification Template.
 * Clean, minimalist, professional design with unified typography and subdued palette.
 */
export const escalationEmailTemplate = (message = "", messageHeader = "") => {
  const currentYear = new Date().getFullYear();
  const headerText = messageHeader || "Document Verification Notification";

  // Determine alert category for a clean, neutral tag
  const isExecutive = /executive|critical/i.test(headerText) || /executive|critical/i.test(message);
  const isUnassigned = /unassigned/i.test(headerText) || /unassigned/i.test(message);

  let tagLabel = "SLA Alert";
  if (isExecutive) {
    tagLabel = "Executive Escalation";
  } else if (isUnassigned) {
    tagLabel = "Action Required - Unassigned";
  }

  // Parse paragraphs and special blocks from message
  const rawParagraphs = String(message || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  let salutation = "";
  let bodyParagraphs = [];
  let assignedOwnerBlock = "";
  let ccNoticeBlock = "";
  let referenceBlock = "";

  for (const para of rawParagraphs) {
    if (/^(dear\s+|attention:)/i.test(para) && !salutation) {
      salutation = para;
    } else if (/^assigned\s+(task\s+)?owner:/i.test(para) || /^assignment\s+status:/i.test(para)) {
      assignedOwnerBlock = para;
    } else if (/^\[note to cc recipients\]:/i.test(para) || /^\(note to cc recipients\):/i.test(para)) {
      ccNoticeBlock = para
        .replace(/^\[note to cc recipients\]:\s*/i, "")
        .replace(/^\(note to cc recipients\):\s*/i, "");
    } else if (/^reference:/i.test(para)) {
      referenceBlock = para.replace(/^reference:\s*/i, "");
    } else {
      bodyParagraphs.push(para);
    }
  }

  if (!salutation && bodyParagraphs.length > 0 && /^(dear\s+|attention:)/i.test(bodyParagraphs[0])) {
    salutation = bodyParagraphs.shift();
  }

  // Format reference items into a clean metadata list
  let referenceHtml = "";
  if (referenceBlock) {
    const chips = referenceBlock.split("|").map((s) => s.trim()).filter(Boolean);
    referenceHtml = `
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: #64748b; margin-bottom: 8px;">
          Reference Details
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
          ${chips
            .map((chip) => {
              const parts = chip.split(/:(.+)/);
              const label = parts[0]?.trim() || "Item";
              const val = parts[1]?.trim() || "";
              return `
                <tr>
                  <td style="padding: 3px 0; color: #64748b; width: 32%; font-weight: 500;">${label}:</td>
                  <td style="padding: 3px 0; color: #0f172a; font-weight: 500;">${val || label}</td>
                </tr>
              `;
            })
            .join("")}
        </table>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerText}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; line-height: 1.6; }
    @media screen and (max-width: 600px) {
      .email-wrapper { width: 100% !important; margin: 0 !important; border-radius: 0 !important; }
      .content-padding { padding: 20px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 32px 0; background-color: #f8fafc;">
  <center>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
      <tr>
        <td align="center" style="padding: 0 16px;">
          <!-- Card Container -->
          <table role="presentation" class="email-wrapper" border="0" cellpadding="0" cellspacing="0" width="560" style="max-width: 560px; width: 100%; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
            
            <!-- Clean Header Bar -->
            <tr>
              <td style="padding: 24px 32px 18px 32px; border-bottom: 1px solid #f1f5f9;" class="content-padding">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td valign="middle">
                      <span style="font-size: 14px; font-weight: 700; color: #0f172a; letter-spacing: -0.2px;">
                        Document Management Engine
                      </span>
                    </td>
                    <td align="right" valign="middle">
                      <span style="display: inline-block; padding: 3px 9px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; background-color: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;">
                        ${tagLabel}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Title & Body Section -->
            <tr>
              <td style="padding: 24px 32px;" class="content-padding">
                
                <h1 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #0f172a; line-height: 1.4;">
                  ${headerText}
                </h1>

                ${salutation ? `
                  <p style="margin: 0 0 14px 0; font-size: 14px; font-weight: 600; color: #0f172a;">
                    ${salutation}
                  </p>
                ` : ""}

                ${bodyParagraphs.map(p => `
                  <p style="margin: 0 0 14px 0; font-size: 14px; color: #334155; line-height: 1.6;">
                    ${p.replace(/\n/g, "<br>")}
                  </p>
                `).join("")}

                <!-- Subtle Assigned Owner Card -->
                ${assignedOwnerBlock ? `
                  <div style="margin: 18px 0; padding: 12px 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                    <div style="font-size: 13px; font-weight: 600; color: #0f172a;">
                      ${assignedOwnerBlock}
                    </div>
                  </div>
                ` : ""}

                <!-- CC Note (Clean subtle secondary text) -->
                ${ccNoticeBlock ? `
                  <p style="margin: 14px 0 0 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                    <strong style="color: #475569;">Note for Copied Recipients:</strong> ${ccNoticeBlock}
                  </p>
                ` : ""}

                <!-- Minimalist Dark Button -->
                <div style="margin: 24px 0 8px 0;">
                  <a href="http://localhost:3000" target="_blank" style="background-color: #0f172a; color: #ffffff; font-size: 13px; font-weight: 600; text-decoration: none; padding: 10px 22px; border-radius: 6px; display: inline-block;">
                    Open Case Portal &rarr;
                  </a>
                </div>

                <!-- Structured Reference Details -->
                ${referenceHtml}

              </td>
            </tr>

            <!-- Minimalist Footer -->
            <tr>
              <td style="padding: 18px 32px 24px 32px; background-color: #ffffff; border-top: 1px solid #f1f5f9; text-align: center;" class="content-padding">
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #94a3b8;">
                  This is an automated operational notification from the Document Management &amp; Verification System.
                </p>
                <p style="margin: 0; font-size: 12px; color: #cbd5e1;">
                  &copy; ${currentYear} All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
};
