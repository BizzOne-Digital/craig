import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

let transporter = null;

function getTransporter() {
  if (!env.smtp.user || !env.smtp.pass) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, html, text }) {
  const transport = getTransporter();
  if (!transport) {
    logger.warn('Email not sent: SMTP not configured', { to, subject });
    return { sent: false, reason: 'SMTP not configured' };
  }

  try {
    await transport.sendMail({
      from: `"CEO Foundation" <${env.smtp.user}>`,
      to,
      subject,
      html,
      text,
    });
    return { sent: true };
  } catch (error) {
    logger.error('Email send failed', { to, subject, message: error.message });
    return { sent: false, reason: error.message };
  }
}

export function isMailConfigured() {
  return Boolean(env.smtp.user && env.smtp.pass);
}
