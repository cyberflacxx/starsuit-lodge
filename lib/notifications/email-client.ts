import "server-only";

import nodemailer from "nodemailer";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim() ?? "";
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER?.trim() ?? "";
  const password = process.env.SMTP_PASSWORD?.trim() ?? "";

  return {
    host,
    port,
    secure: port === 465,
    auth: user && password ? { user, pass: password } : undefined,
  };
}

export function isEmailConfigured() {
  const config = getSmtpConfig();
  return Boolean(config.host && config.port && config.auth?.user && config.auth?.pass);
}

export function getEmailTransport() {
  const config = getSmtpConfig();

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });
}
