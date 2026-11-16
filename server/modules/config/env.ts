export interface AppConfig {
  nodeEnv: string;
  port: number;
  appUrl: string;
  adminEmails: string[];
  companyNotificationEmail: string;
  smtp: {
    configured: boolean;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
  };
}

export function getAppConfig(): AppConfig {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = Number(process.env.PORT || 3000);
  const appUrl = (process.env.APP_URL || `http://localhost:${port}`).replace(/\/+$/, '');

  const rawAdmins =
    process.env.ADMIN_EMAILS ||
    (nodeEnv === 'production'
      ? 'signinofficial446@gmail.com'
      : 'signinofficial446@gmail.com,nanigameing1@gmail.com');

  const adminEmails = rawAdmins
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const smtpHost = (process.env.SMTP_HOST || '').trim();
  const smtpUser = (process.env.SMTP_USER || '').trim();
  const smtpPass = (process.env.SMTP_PASS || '').trim();
  const smtpConfigured = Boolean(smtpHost && smtpUser && smtpPass);

  return {
    nodeEnv,
    port,
    appUrl,
    adminEmails,
    companyNotificationEmail: (
      process.env.COMPANY_NOTIFICATION_EMAIL || 'signinofficial446@gmail.com'
    ).trim(),
    smtp: {
      configured: smtpConfigured,
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      user: smtpUser,
      pass: smtpPass,
      from:
        process.env.SMTP_FROM ||
        'SIGN IN DOCUMENTS CLEARING <no-reply@signin-documents.example>',
    },
  };
}
