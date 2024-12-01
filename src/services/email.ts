import nodemailer from 'nodemailer';

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendRecoveryCode = async (email: string, code: string) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Código de recuperación de contraseña',
    html: `
      <h1>Recuperación de contraseña</h1>
      <p>Has solicitado recuperar tu contraseña. Utiliza el siguiente código:</p>
      <h2 style="font-size: 24px; padding: 10px; background: #f0f0f0; text-align: center;">${code}</h2>
      <p>Este código expirará en 15 minutos.</p>
      <p>Si no has solicitado este cambio, ignora este mensaje.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};