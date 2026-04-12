// TODO: Integrar envio de e-mails via Resend no sistema (Fase 4 - Notificações)
// Chave da API mantida salva a pedido do usuário para não perdermos:
// API KEY: re_8VZifXJY_nZP3GX8UpfHbZYCH5XAH6vTi

/* === CÓDIGO DE EXEMPLO PARA INTEGRAÇÃO FUTURA ===

import { Resend } from 'resend';

// Inicializar com variável de ambiente no futuro: process.env.RESEND_API_KEY
const resend = new Resend('re_8VZifXJY_nZP3GX8UpfHbZYCH5XAH6vTi');

export async function sendTestEmail() {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'biopeptideos@gmail.com',
    subject: 'Hello World',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
  });
}
*/
