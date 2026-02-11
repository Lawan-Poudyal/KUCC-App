import nodemailer from "nodemailer";
import path, { dirname } from'path';
import { fileURLToPath } from "url";

// KUCC Logo URL (hosted image)
const KUCC_LOGO_URL =
  "https://th.bing.com/th/id/R.f8c1f155a456512b62552f27364fedb8?rik=u48hw383ACzOcQ&riu=http%3a%2f%2fkucc.ku.edu.np%2f_next%2fimage%3furl%3d%252Fkucc-logo.png%26w%3d828%26q%3d75&ehk=kIk%2f%2bGr%2bFbVbH1HmGgF0tP7wTHeKWY6ZeGwunfq%2f%2fus%3d&risl=&pid=ImgRaw&r=0";


const __filename=fileURLToPath(import.meta.url);
const __dirname=dirname(__filename);

export const transporter= nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendCertificateEmail=async ({
    to,
    name,
    eventTitle,
    certificateType,
    pdfUrl,
}) => {

     // Email HTML with KUCC branding
  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate Award - KUCC</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(74, 95, 157, 0.15);">
          
          <!-- Header with KUCC Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #4a5f9d 0%, #2c3e7a 100%); padding: 50px 40px; text-align: center; position: relative;">
              <!-- Decorative top border -->
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #ffd700, #4a5f9d, #ffd700);"></div>
              
              <!-- KUCC Logo -->
              <img src="${KUCC_LOGO_URL}" alt="KUCC Logo" width="120" style="width: 120px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
              
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px; line-height: 1.3; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                🎓 Certificate Awarded!
              </h1>
              <p style="color: #e8ecf1; margin: 10px 0 0 0; font-size: 14px; letter-spacing: 1px;">
                ESTD: 1997
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <p style="color: #2c3e50; font-size: 18px; margin: 0 0 20px 0; line-height: 1.6;">
                Dear <strong style="color: #4a5f9d;">${name}</strong>,
              </p>
              
              <p style="color: #34495e; font-size: 16px; margin: 0 0 30px 0; line-height: 1.7;">
                Congratulations on your outstanding achievement! 🌟 We are thrilled to award you this certificate.
              </p>

              <!-- Certificate Info Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8f9fb 0%, #e8ecf1 100%); border-radius: 12px; margin-bottom: 30px; border-left: 5px solid #4a5f9d; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 30px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 20px;">
                          <p style="color: #7f8c8d; font-size: 13px; margin: 0 0 8px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                            Certificate Type
                          </p>
                          <p style="color: #2c3e50; font-size: 20px; margin: 0; font-weight: 700; text-transform: capitalize;">
                            ${certificateType}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border-top: 1px solid #d5dde5; padding-top: 20px;">
                          <p style="color: #7f8c8d; font-size: 13px; margin: 0 0 8px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                            Event
                          </p>
                          <p style="color: #2c3e50; font-size: 18px; margin: 0; font-weight: 600; line-height: 1.4;">
                            ${eventTitle}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border-top: 1px solid #d5dde5; padding-top: 20px;">
                          <p style="color: #7f8c8d; font-size: 13px; margin: 0 0 8px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                            Issued On
                          </p>
                          <p style="color: #2c3e50; font-size: 16px; margin: 0; font-weight: 600;">
                            ${new Date().toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #34495e; font-size: 16px; margin: 0 0 30px 0; line-height: 1.7;">
                Your certificate is ready for download! Click the button below to access your certificate:
              </p>

              <!-- Download Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 35px;">
                <tr>
                  <td align="center">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${pdfUrl}" style="height:54px;v-text-anchor:middle;width:300px;" arcsize="50%" strokecolor="#4a5f9d" fillcolor="#4a5f9d">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">📥 Download Your Certificate</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${pdfUrl}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       download
                       style="display: inline-block; background: linear-gradient(135deg, #4a5f9d 0%, #2c3e7a 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-size: 16px; font-weight: 700; letter-spacing: 0.5px; box-shadow: 0 6px 20px rgba(74, 95, 157, 0.35); mso-hide: all; transition: all 0.3s ease;">
                      📥 Download Your Certificate (PDF)
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <!-- Instructions Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fff9e6; border-radius: 10px; margin-bottom: 30px; border: 1px solid #ffe4a3;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #856404; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
                      💡 How to Download:
                    </p>
                    <ul style="color: #856404; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
                      <li>Click the download button above</li>
                      <li>Your certificate will be saved as a PDF file</li>
                      <li>You can print or share it digitally</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="border-top: 2px solid #ecf0f1; margin: 40px 0;"></div>

              <!-- Congratulatory Message -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f0f4f8 0%, #e8ecf1 100%); border-radius: 10px; padding: 25px; margin-bottom: 30px;">
                <tr>
                  <td>
                    <p style="color: #2c3e50; font-size: 15px; margin: 0 0 15px 0; line-height: 1.7; text-align: center;">
                      <strong>🎉 We're proud of your accomplishment!</strong>
                    </p>
                    <p style="color: #34495e; font-size: 14px; margin: 0; line-height: 1.7; text-align: center;">
                      This certificate serves as a testament to your dedication, hard work, and commitment to excellence.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #34495e; font-size: 15px; margin: 0 0 25px 0; line-height: 1.7; text-align: center;">
                Keep up the excellent work! 💪 Continue to learn, grow, and inspire others.
              </p>

              <!-- Signature -->
              <p style="color: #2c3e50; font-size: 15px; margin: 0; line-height: 1.8;">
                Best regards,<br/>
                <strong style="color: #4a5f9d; font-size: 16px;">Kathmandu University Computer Club</strong><br/>
                <span style="color: #7f8c8d; font-size: 13px; font-style: italic;">Empowering minds since 1997</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fb; padding: 30px 40px; text-align: center; border-top: 1px solid #ecf0f1;">
              <!-- Logo small -->
              <img src="${KUCC_LOGO_URL}" alt="KUCC" width="60" style="width: 60px; height: auto; margin-bottom: 15px; opacity: 0.7;" />
              
              <p style="color: #95a5a6; font-size: 13px; margin: 0 0 10px 0; line-height: 1.6;">
                This is an automated email from the KUCC Certificate System.
              </p>
              <p style="color: #95a5a6; font-size: 13px; margin: 0 0 15px 0; line-height: 1.6;">
                Please do not reply to this message.
              </p>
              
              <p style="color: #bdc3c7; font-size: 12px; margin: 0 0 20px 0; line-height: 1.6;">
                © ${new Date().getFullYear()} Kathmandu University Computer Club. All rights reserved.
              </p>
              
              <!-- Social Links -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin-bottom: 15px;">
                <tr>
                  <td style="padding: 0 10px;">
                    <a href="#" style="color: #95a5a6; text-decoration: none; font-size: 12px; font-weight: 500;">Website</a>
                  </td>
                  <td style="padding: 0 5px; color: #bdc3c7;">•</td>
                  <td style="padding: 0 10px;">
                    <a href="#" style="color: #95a5a6; text-decoration: none; font-size: 12px; font-weight: 500;">Facebook</a>
                  </td>
                  <td style="padding: 0 5px; color: #bdc3c7;">•</td>
                  <td style="padding: 0 10px;">
                    <a href="#" style="color: #95a5a6; text-decoration: none; font-size: 12px; font-weight: 500;">LinkedIn</a>
                  </td>
                </tr>
              </table>

              <p style="color: #bdc3c7; font-size: 11px; margin: 0; line-height: 1.5;">
                Kathmandu University, Dhulikhel, Nepal
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // prepare mail options
  const mailOptions={
    from:{
       name: "Kathmandu University Computer Club",
      address: process.env.MAIL_FROM,  
    },
    to,
    subject: `🎓 Your ${certificateType} Certificate - ${eventTitle}`,
    html: emailHtml,
  };

  try {
    const info= await transporter.sendMail(mailOptions);
    console.log(`[EMAIL_SUCCESS] Certificate email sent to ${to} - Message ID: ${info.messageId}`);
    return {success: true, messageId:info.messageId};
  } catch (error) {
    console.error(`[EMAIL_ERROR] Failed to send email to ${to}:`, error.message);
    throw error;
  }

  };