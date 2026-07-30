import "@tanstack/react-start/server-only"

const SUBJECT = "Confirm your Makes Mistakes launch notification"

export function createConfirmationEmail(confirmationUrl: string) {
  const escapedUrl = escapeHtml(confirmationUrl)

  return {
    subject: SUBJECT,
    text: [
      "Confirm your Makes Mistakes launch notification",
      "",
      "You asked to hear when the paid version of Makes Mistakes is ready.",
      "Confirm your email address:",
      confirmationUrl,
      "",
      "If you did not request this, ignore this email. Your address will not be added to the list.",
    ].join("\n"),
    html: `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>${SUBJECT}</title>
        </head>
        <body style="margin:0;background:#0b0a08;color:#ece7dc;font-family:Arial,sans-serif">
          <div style="margin:0 auto;max-width:560px;padding:48px 24px">
            <p style="margin:0 0 12px;color:#d4af37;font-size:12px;letter-spacing:.16em;text-transform:uppercase">
              Makes Mistakes
            </p>
            <h1 style="margin:0 0 20px;font-size:30px;line-height:1.2">
              Confirm your email
            </h1>
            <p style="margin:0 0 28px;color:#b8b0a2;font-size:16px;line-height:1.6">
              You asked to hear when the paid version of Makes Mistakes is ready.
            </p>
            <a
              href="${escapedUrl}"
              style="display:inline-block;border-radius:999px;background:#d4af37;color:#14110a;padding:14px 24px;font-size:15px;font-weight:700;text-decoration:none"
            >
              Confirm email
            </a>
            <p style="margin:28px 0 8px;color:#918a7b;font-size:13px;line-height:1.6">
              If the button does not work, open this link:
            </p>
            <p style="margin:0;overflow-wrap:anywhere;font-size:12px;line-height:1.6">
              <a href="${escapedUrl}" style="color:#fff6d0">${escapedUrl}</a>
            </p>
            <p style="margin:32px 0 0;color:#918a7b;font-size:12px;line-height:1.6">
              If you did not request this, ignore this email. Your address will not be added to the list.
            </p>
          </div>
        </body>
      </html>
    `.trim(),
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}
