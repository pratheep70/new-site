import nodemailer from 'nodemailer';
import { db } from '../../../src/db/index.ts';
import { notificationLogs } from '../../../src/db/schema.ts';
import { getAppConfig } from '../config/env.ts';

export async function sendEnquiryNotification(params: {
  enquiryId: number;
  referenceCode: string;
  fullName: string;
  serviceTitle: string;
  sourcePage?: string | null;
}) {
  const config = getAppConfig();
  const recipient = config.companyNotificationEmail;
  const subject = `New Consultation Enquiry (${params.referenceCode}) - ${params.serviceTitle}`;

  if (!config.smtp.configured) {
    try {
      await db.insert(notificationLogs).values({
        enquiryId: params.enquiryId,
        channel: 'EMAIL',
        recipient,
        subject,
        status: 'SKIPPED_NOT_CONFIGURED',
        detail:
          'SMTP credentials are not configured. Enquiry is saved in PostgreSQL for admin review.',
      });
    } catch (error) {
      console.error('Failed to record skipped notification log:', error);
    }
    return { delivered: false, status: 'SKIPPED_NOT_CONFIGURED' as const };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    const bodyText = [
      `A new consultation enquiry has been recorded.`,
      ``,
      `Reference: ${params.referenceCode}`,
      `Service: ${params.serviceTitle}`,
      `Client Name: ${params.fullName}`,
      `Source Page: ${params.sourcePage || '/contact'}`,
      ``,
      `Please sign in to the SIGN IN DOCUMENTS CLEARING admin dashboard to review full contact details and update the enquiry status.`,
    ].join('\n');

    await transporter.sendMail({
      from: config.smtp.from,
      to: recipient,
      subject,
      text: bodyText,
    });

    await db.insert(notificationLogs).values({
      enquiryId: params.enquiryId,
      channel: 'EMAIL',
      recipient,
      subject,
      status: 'SENT',
      detail: 'Email notification dispatched via configured SMTP relay.',
    });

    return { delivered: true, status: 'SENT' as const };
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message.slice(0, 300) : 'SMTP transport error';
    console.error('SMTP notification failed:', error);

    try {
      await db.insert(notificationLogs).values({
        enquiryId: params.enquiryId,
        channel: 'EMAIL',
        recipient,
        subject,
        status: 'FAILED',
        detail: errMsg,
      });
    } catch (logErr) {
      console.error('Failed to log SMTP failure:', logErr);
    }

    return { delivered: false, status: 'FAILED' as const };
  }
}
