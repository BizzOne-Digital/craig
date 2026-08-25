const brand = {
  obsidian: '#070707',
  carbon: '#121212',
  signalRed: '#E10600',
  bone: '#F3EEE6',
  steel: '#A8A8A8',
};

function layout(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:${brand.obsidian};font-family:Arial,sans-serif;color:${brand.bone};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${brand.obsidian};padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:${brand.carbon};border-top:3px solid ${brand.signalRed};">
        <tr><td style="padding:32px 28px;">
          <div style="font-size:12px;letter-spacing:0.2em;color:${brand.signalRed};text-transform:uppercase;">CEO Foundation</div>
          <h1 style="margin:12px 0 24px;font-size:24px;color:${brand.bone};">${title}</h1>
          ${content}
          <hr style="border:none;border-top:1px solid #2a2a2a;margin:28px 0;" />
          <p style="font-size:12px;color:${brand.steel};line-height:1.6;">
            CEO Foundation · <a href="mailto:ceoassociatesllc@gmail.com" style="color:${brand.bone};">ceoassociatesllc@gmail.com</a> · 314-267-5674<br/>
            Information in this message is general and does not guarantee any legal outcome.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function formatMoney(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amount);
}

export function orderCustomerEmail(order) {
  const itemsHtml = order.lineItems
    .map(
      (item) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;">${item.name}${item.size ? ` · ${item.size}` : ''}${item.color ? ` · ${item.color}` : ''}</td>
        <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;text-align:right;">${formatMoney(item.lineTotal)}</td>
      </tr>`
    )
    .join('');

  const content = `
    <p style="line-height:1.7;color:${brand.bone};">Thank you for supporting the CEO Foundation. Your order helps advance fairness, accountability, and meaningful assistance.</p>
    <p style="color:${brand.steel};"><strong style="color:${brand.bone};">Order:</strong> ${order.orderNumber}<br/><strong style="color:${brand.bone};">Date:</strong> ${new Date(order.paidAt || order.createdAt).toLocaleString()}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr><th align="left" style="padding:8px 0;color:${brand.steel};font-size:12px;">Item</th><th style="padding:8px 0;color:${brand.steel};font-size:12px;">Qty</th><th align="right" style="padding:8px 0;color:${brand.steel};font-size:12px;">Total</th></tr>
      ${itemsHtml}
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr><td style="padding:4px 0;color:${brand.steel};">Subtotal</td><td align="right">${formatMoney(order.subtotal)}</td></tr>
      ${order.discountAmount ? `<tr><td style="padding:4px 0;color:${brand.steel};">Discount (${order.discountCode})</td><td align="right">-${formatMoney(order.discountAmount)}</td></tr>` : ''}
      <tr><td style="padding:4px 0;color:${brand.steel};">Shipping</td><td align="right">${formatMoney(order.shippingAmount)}</td></tr>
      <tr><td style="padding:4px 0;color:${brand.steel};">Tax</td><td align="right">${formatMoney(order.taxAmount)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold;">Total</td><td align="right" style="font-weight:bold;color:${brand.signalRed};">${formatMoney(order.total)}</td></tr>
    </table>
    <p style="margin-top:20px;line-height:1.7;color:${brand.bone};"><strong>Shipping to</strong><br/>${order.customer.name}<br/>${order.shippingAddress.line1}${order.shippingAddress.line2 ? `<br/>${order.shippingAddress.line2}` : ''}<br/>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
    <p style="line-height:1.7;color:${brand.steel};">Questions about your order? Reply to this email or contact us at 314-267-5674.</p>`;

  const text = `Thank you for your order ${order.orderNumber}. Total: ${formatMoney(order.total)}. Contact: ceoassociatesllc@gmail.com / 314-267-5674.`;
  return { subject: `Order Confirmation · ${order.orderNumber}`, html: layout('Thank You For Your Order', content), text };
}

export function orderAdminEmail(order, adminOrderUrl) {
  const items = order.lineItems.map((i) => `${i.quantity}x ${i.name} (${formatMoney(i.lineTotal)})`).join('\n');
  const content = `
    <p style="color:${brand.bone};">A new paid order has been received.</p>
    <p style="color:${brand.steel};"><strong style="color:${brand.bone};">Order:</strong> ${order.orderNumber}<br/>
    <strong style="color:${brand.bone};">Customer:</strong> ${order.customer.name} · ${order.customer.email}${order.customer.phone ? ` · ${order.customer.phone}` : ''}<br/>
    <strong style="color:${brand.bone};">Payment:</strong> ${order.paymentStatus} · ${order.paymentIntentId || order.checkoutSessionId}</p>
    <pre style="background:#0d0d0d;padding:16px;color:${brand.bone};white-space:pre-wrap;font-family:Consolas,monospace;">${items}

Subtotal: ${formatMoney(order.subtotal)}
Discount: ${order.discountCode ? `${order.discountCode} (-${formatMoney(order.discountAmount)})` : 'None'}
Shipping: ${formatMoney(order.shippingAmount)}
Tax: ${formatMoney(order.taxAmount)}
Total: ${formatMoney(order.total)}

Shipping Address:
${order.shippingAddress.line1}
${order.shippingAddress.line2 || ''}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
    </pre>
    <p><a href="${adminOrderUrl}" style="display:inline-block;background:${brand.signalRed};color:#fff;padding:12px 18px;text-decoration:none;font-weight:bold;">View Order in Admin</a></p>`;

  const text = `New paid order ${order.orderNumber} from ${order.customer.email}. Total ${formatMoney(order.total)}. Admin: ${adminOrderUrl}`;
  return { subject: `New Paid Order · ${order.orderNumber}`, html: layout('New Paid Order', content), text };
}

export function bookingEmails(data) {
  const adminContent = `<p style="color:${brand.bone};">A new case review / service booking request was submitted.</p>
    <pre style="background:#0d0d0d;padding:16px;color:${brand.bone};white-space:pre-wrap;">Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Service: ${data.service}
Preferred Date: ${data.preferredDate}
Preferred Time: ${data.preferredTime}
Contact Preference: ${data.contactPreference}

Overview:
${data.message || 'No additional details provided.'}
    </pre>`;

  const visitorContent = `<p style="line-height:1.7;color:${brand.bone};">Thank you, ${data.name}. We received your request for <strong>${data.service}</strong>.</p>
    <p style="line-height:1.7;color:${brand.steel};">Our team will review your submission and respond using your preferred contact method (${data.contactPreference}). Please do not send Social Security numbers, payment card data, confidential evidence, or sensitive case files through follow-up email unless explicitly requested through a secure channel.</p>
    <p style="color:${brand.steel};">Submitted preferences: ${data.preferredDate} at ${data.preferredTime}</p>`;

  return {
    admin: { subject: `New Booking Request · ${data.service}`, html: layout('New Booking Request', adminContent), text: `Booking from ${data.email} for ${data.service}` },
    visitor: { subject: 'We Received Your Request', html: layout('Request Received', visitorContent), text: `We received your booking request for ${data.service}.` },
  };
}

export function contactEmails(data) {
  const adminContent = `<p style="color:${brand.bone};">New contact inquiry received.</p>
    <pre style="background:#0d0d0d;padding:16px;color:${brand.bone};white-space:pre-wrap;">Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Subject: ${data.subject}
Reply Method: ${data.replyMethod}

Message:
${data.message}
    </pre>`;

  const visitorContent = `<p style="line-height:1.7;color:${brand.bone};">Thank you for contacting the CEO Foundation, ${data.name}.</p>
    <p style="line-height:1.7;color:${brand.steel};">We received your message regarding <strong>${data.subject}</strong> and will respond via ${data.replyMethod}.</p>`;

  return {
    admin: { subject: `Contact Inquiry · ${data.subject}`, html: layout('New Contact Inquiry', adminContent), text: `Contact from ${data.email}: ${data.subject}` },
    visitor: { subject: 'We Received Your Message', html: layout('Message Received', visitorContent), text: `We received your message about ${data.subject}.` },
  };
}
