import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import Content from '@/models/Content';

export interface EmailOptions {
  to?: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: string | Buffer;
    contentType?: string;
  }>;
}

export async function getReceiverEmail(type?: string): Promise<string> {
  let receiverEmail = process.env.RECEIVER_EMAIL || process.env.NOTIFICATION_EMAIL;

  if (!receiverEmail) {
    const defaultUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    if (defaultUser && !defaultUser.includes('smtp-brevo') && !defaultUser.includes('brevo.com')) {
      receiverEmail = defaultUser;
    } else {
      receiverEmail = 'info@lightsovercolumbus.com';
    }
  }

  try {
    const contentDoc = await Content.findOne({ key: 'complete_data' }).lean() as any;
    if (contentDoc && contentDoc.data) {
      if (type === 'Quote Request' && contentDoc.data.quote?.email) {
        receiverEmail = contentDoc.data.quote.email;
      } else if (contentDoc.data.contactPage?.email) {
        receiverEmail = contentDoc.data.contactPage.email;
      } else if (contentDoc.data.quote?.email) {
        receiverEmail = contentDoc.data.quote.email;
      }
    }
  } catch (e) {
    console.warn('Error fetching dynamic email from Content CMS:', e);
  }

  if (receiverEmail) {
    receiverEmail = receiverEmail.replace(/\s+/g, '').toLowerCase();
  }

  return receiverEmail || 'info@lightsovercolumbus.com';
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const recipient = options.to || await getReceiverEmail();
  console.log(`[Email Service] Attempting to send email to: ${recipient}`);

  // 1. Try Nodemailer if SMTP configured
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  let smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '';
  if (smtpPass.startsWith('"') && smtpPass.endsWith('"')) {
    smtpPass = smtpPass.slice(1, -1);
  }

  if (smtpUser && smtpPass) {
    try {
      const port = parseInt(process.env.SMTP_PORT || '587');
      const isSecure = port === 465;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: port,
        secure: isSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
      });

      const fromAddress = process.env.SMTP_FROM || (smtpUser.includes('smtp-brevo') ? 'info@lightsovercolumbus.com' : smtpUser);
      const fromName = process.env.SMTP_FROM_NAME || 'Christmas Lights Over Columbus';

      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromAddress}>`,
        to: recipient,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      });

      console.log('[Email Service] Successfully sent via Nodemailer SMTP:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (smtpError: any) {
      console.warn('[Email Service] Nodemailer SMTP failed:', smtpError.message);
    }
  }

  // 2. Try Resend if configured
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && !resendApiKey.includes('your_resend')) {
    try {
      const resend = new Resend(resendApiKey);
      const resendAttachments = (options.attachments || []).map(att => ({
        filename: att.filename,
        content: att.content ? (typeof att.content === 'string' ? att.content : att.content.toString('base64')) : undefined,
        path: att.path,
      }));

      const { data, error } = await resend.emails.send({
        from: 'Christmas Lights Over Columbus <onboarding@resend.dev>',
        to: [recipient],
        subject: options.subject,
        html: options.html,
        attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
      });

      if (!error && data?.id) {
        console.log('[Email Service] Successfully sent via Resend:', data.id);
        return { success: true, messageId: data.id };
      } else if (error) {
        console.warn('[Email Service] Resend API error:', error.message);
      }
    } catch (resendError: any) {
      console.warn('[Email Service] Resend error:', resendError.message);
    }
  }

  console.warn('[Email Service] Notice: External email sending skipped or unconfigured. Credentials in .env.local may need verification.');
  return { success: false, error: 'Email delivery credentials unconfigured or rejected by mail provider.' };
}
