import { Request, Response } from 'express';
import { Resend } from 'resend';

interface NotifyPayload {
  nombre: string;
  documento: string;
  telefono: string;           // móvil del trabajador — reservado para Twilio
  correo: string;             // correo del trabajador
  contratistaEmail: string;   // correo del contratista (copia)
  contratistaRazonSocial: string;
  nota: string;
}

export async function sendTrabajadorNotification(req: Request, res: Response) {
  const { nombre, documento, correo, contratistaEmail, contratistaRazonSocial, nota } = req.body as NotifyPayload; // telefono reservado para Twilio

  if (!nota?.trim()) {
    return res.status(400).json({ success: false, message: 'La nota no puede estar vacía' });
  }

  const apiKey = process.env.RESEND_API_KEY || '';
  if (!apiKey) {
    return res.status(500).json({ success: false, message: 'RESEND_API_KEY no configurado' });
  }

  const destinatarios = [correo, contratistaEmail].filter(Boolean);
  if (destinatarios.length === 0) {
    return res.status(400).json({ success: false, message: 'No hay destinatarios de correo' });
  }

  const fecha = new Date().toLocaleString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const resend = new Resend(apiKey);
  const fromEmail = process.env.RESEND_FROM || 'SG-SST <onboarding@resend.dev>';

  try {
    await resend.emails.send({
      from: fromEmail,
      to: destinatarios,
      subject: `📋 Nota SST – ${nombre} (${documento})`,
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

    return res.json({
      success: true,
      email: true,
      message: 'Email enviado ✅',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      success: false,
      email: false,
      message: `Error al enviar email: ${msg}`,
    });
  }
}
