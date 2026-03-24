import { Request, Response } from 'express';
import twilio from 'twilio';
import nodemailer from 'nodemailer';

interface NotifyPayload {
  nombre: string;
  documento: string;
  telefono: string;           // teléfono móvil del trabajador (solo dígitos)
  correo: string;             // correo del trabajador
  contratistaEmail: string;   // correo del contratista (copia)
  contratistaRazonSocial: string;
  nota: string;
}

export async function sendTrabajadorNotification(req: Request, res: Response) {
  const { nombre, documento, telefono, correo, contratistaEmail, contratistaRazonSocial, nota } = req.body as NotifyPayload;

  if (!nota?.trim()) {
    return res.status(400).json({ success: false, message: 'La nota no puede estar vacía' });
  }

  const fecha = new Date().toLocaleString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const msgTexto = `📋 Nota SST [${fecha}]\nTrabajador: ${nombre}\nDoc: ${documento}\nEmpresa: ${contratistaRazonSocial}\n\n${nota}`;

  const results = { whatsapp: false, email: false, errors: [] as string[] };

  // ── WhatsApp vía Twilio ─────────────────────────────────────────────────
  const twilioSid  = process.env.TWILIO_ACCOUNT_SID  || '';
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN    || '';
  const twilioFrom = process.env.TWILIO_WHATSAPP_FROM || '';

  if (twilioSid && twilioAuth && twilioFrom && telefono) {
    try {
      const client = twilio(twilioSid, twilioAuth);
      const toPhone = telefono.replace(/\D/g, '');
      await client.messages.create({
        from: twilioFrom,
        to: `whatsapp:+57${toPhone}`,
        body: msgTexto,
      });
      results.whatsapp = true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      results.errors.push(`WhatsApp: ${msg}`);
    }
  } else if (telefono) {
    results.errors.push('WhatsApp: credenciales Twilio no configuradas');
  }

  // ── Email vía Gmail SMTP ────────────────────────────────────────────────
  const gmailUser = process.env.GMAIL_USER         || '';
  const gmailPass = process.env.GMAIL_APP_PASSWORD || '';

  const destinatarios = [correo, contratistaEmail].filter(Boolean);

  if (gmailUser && gmailPass && destinatarios.length > 0) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass },
      });

      await transporter.sendMail({
        from: `"SG-SST Sistema" <${gmailUser}>`,
        to: destinatarios.join(', '),
        subject: `📋 Nota SST – ${nombre} (${documento})`,
        text: msgTexto,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
            <div style="background:#047857;padding:16px 24px">
              <h2 style="color:#fff;margin:0;font-size:16px">📋 Nota SST — Sistema de Gestión</h2>
            </div>
            <div style="padding:24px">
              <p style="margin:0 0 8px 0;color:#6b7280;font-size:12px">${fecha}</p>
              <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">
                <tr><td style="padding:4px 8px;color:#6b7280;width:160px">Trabajador</td><td style="padding:4px 8px;font-weight:600">${nombre}</td></tr>
                <tr style="background:#f9fafb"><td style="padding:4px 8px;color:#6b7280">Documento</td><td style="padding:4px 8px">${documento}</td></tr>
                <tr><td style="padding:4px 8px;color:#6b7280">Empresa</td><td style="padding:4px 8px">${contratistaRazonSocial}</td></tr>
              </table>
              <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:4px;font-size:13px;color:#1f2937">
                <strong>Nota:</strong><br/>${nota.replace(/\n/g, '<br/>')}
              </div>
            </div>
            <div style="background:#f9fafb;padding:12px 24px;text-align:center;font-size:11px;color:#9ca3af">
              Generado por el sistema SG-SST — No responder a este mensaje
            </div>
          </div>`,
      });
      results.email = true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      results.errors.push(`Email: ${msg}`);
    }
  } else if (destinatarios.length > 0) {
    results.errors.push('Email: credenciales Gmail no configuradas');
  }

  return res.json({
    success: results.whatsapp || results.email,
    whatsapp: results.whatsapp,
    email: results.email,
    errors: results.errors,
    message: `WhatsApp: ${results.whatsapp ? '✅' : '❌'} | Email: ${results.email ? '✅' : '❌'}`,
  });
}
