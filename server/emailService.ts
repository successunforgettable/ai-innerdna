import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendPasswordRecoveryEmail(email: string, password: string): Promise<boolean> {
  const emailParams: EmailParams = {
    to: email,
    from: 'noreply@innerdna.com', // You may need to verify this domain with SendGrid
    subject: 'Inner DNA Assessment - Password Recovery',
    text: `Your Inner DNA Assessment password is: ${password}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #7c3aed, #3730a3); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="color: #fbbf24; margin: 0; text-align: center; font-size: 28px;">Inner DNA Assessment</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border: 1px solid #e9ecef;">
          <h2 style="color: #1e3a8a; margin-top: 0;">Password Recovery</h2>
          
          <p style="color: #495057; font-size: 16px; line-height: 1.6;">
            You requested your password for accessing your Inner DNA Assessment report.
          </p>
          
          <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 2px solid #fbbf24; margin: 20px 0;">
            <p style="color: #1e3a8a; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">Your Password:</p>
            <p style="color: #000; font-size: 18px; font-weight: bold; margin: 0; letter-spacing: 1px;">${password}</p>
          </div>
          
          <p style="color: #495057; font-size: 16px; line-height: 1.6;">
            Use this password to log in and access your personality assessment report.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NODE_ENV === 'production' ? 'https://your-domain.replit.app' : 'http://localhost:5000'}/login" 
               style="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Access Your Report
            </a>
          </div>
          
          <p style="color: #6c757d; font-size: 14px; line-height: 1.5; margin-top: 30px;">
            For security reasons, we recommend logging in immediately and keeping your password secure.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          © 2025 Inner DNA Assessment. All rights reserved.
        </div>
      </div>
    `
  };

  return await sendEmail(emailParams);
}