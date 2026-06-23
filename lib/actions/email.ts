'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendCustomerEmail(data: {
  to: string
  customerName: string
  subject: string
  message: string
  orderNumber: number
}) {
  const { to, customerName, subject, message, orderNumber } = data

  const { error } = await resend.emails.send({
    from: 'מאפיית רונית <noreply@leviws.tech>',
    to,
    subject,
    html: `
      <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a1a;">שלום ${customerName},</h2>
        <p style="color: #444;">בנוגע להזמנה מספר <strong>#${orderNumber}</strong>:</p>
        <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 16px 0; white-space: pre-line; color: #333;">
          ${message}
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 13px;">בברכה,<br/>מאפיית רונית</p>
      </div>
    `,
  })

  if (error) return { error: error.message }
  return { error: null }
}
