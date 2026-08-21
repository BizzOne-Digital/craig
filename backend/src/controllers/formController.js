import crypto from 'crypto';
import BookingRequest from '../models/BookingRequest.js';
import ContactInquiry from '../models/ContactInquiry.js';
import { sendMail } from '../services/mailService.js';
import { bookingEmails, contactEmails } from '../templates/emailTemplates.js';
import { env } from '../config/env.js';
import { created, fail } from '../utils/apiResponse.js';

function ipHash(req) {
  return crypto.createHash('sha256').update(req.ip || 'unknown').digest('hex');
}

export async function submitBooking(req, res) {
  if (req.body.website) return fail(res, 'Unable to process request', 400);

  const data = { ...req.body, ipHash: ipHash(req) };
  await BookingRequest.create(data);

  const emails = bookingEmails(data);
  await sendMail({ to: env.adminNotificationEmail, ...emails.admin });
  await sendMail({ to: data.email, ...emails.visitor });

  return created(res, { message: 'Your request has been received. We will respond using your preferred contact method.' });
}

export async function submitContact(req, res) {
  if (req.body.website) return fail(res, 'Unable to process request', 400);

  const data = { ...req.body, ipHash: ipHash(req) };
  await ContactInquiry.create(data);

  const emails = contactEmails(data);
  await sendMail({ to: env.adminNotificationEmail, ...emails.admin });
  await sendMail({ to: data.email, ...emails.visitor });

  return created(res, { message: 'Your message has been received. Thank you for contacting us.' });
}
