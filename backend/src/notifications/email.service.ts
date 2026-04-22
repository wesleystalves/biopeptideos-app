import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_8VZifXJY_nZP3GX8UpfHbZYCH5XAH6vTi';
// Use resend sandbox sender until domain peptideosbio.com is verified in Resend dashboard
const FROM = process.env.EMAIL_FROM || 'PeptideosBio <onboarding@resend.dev>';
const APP_URL = process.env.APP_URL || 'https://peptideosbio.com';

@Injectable()
export class EmailService {
  private readonly resend = new Resend(RESEND_API_KEY);
  private readonly logger = new Logger(EmailService.name);

  async sendWelcome(email: string, name: string): Promise<void> {
    const firstName = name?.split(' ')[0] || 'Olá';
    try {
      await this.resend.emails.send({
        from: FROM,
        to: email,
        subject: '🧬 Bem-vindo(a) ao PeptídeosBio!',
        html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#071a2c;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#071a2c 0%,#083a5a 100%);padding:32px 40px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
      <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;">
        ✦ <span style="background:linear-gradient(90deg,#5b8af5,#00e5cc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">PeptídeosBio</span>
      </h1>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <h2 style="margin:0 0 12px;color:#fff;font-size:20px;">Olá, ${firstName}! 👋</h2>
      <p style="color:#94afc7;line-height:1.7;margin:0 0 24px;">
        Sua conta foi criada com sucesso no <strong style="color:#e2e8f0;">PeptídeosBio</strong>. 
        Agora falta um único passo: escolher seu plano para ter acesso ao conteúdo completo.
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${APP_URL}/ebook" 
           style="display:inline-block;background:linear-gradient(135deg,#5b8af5,#00e5cc);color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-weight:800;font-size:16px;box-shadow:0 8px 24px rgba(91,138,245,0.35);">
          Acessar agora → R$ 9,90
        </a>
      </div>

      <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">
        <strong style="color:#94afc7;">O que você vai receber:</strong><br>
        🧬 Manual completo sobre peptídeos<br>
        ⚡ 12 peptídeos para performance e emagrecimento<br>
        📋 Protocolos de dosagem e segurança<br>
        🔥 Stacks avançados e combinações sinérgicas
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
      <p style="color:#334155;font-size:12px;margin:0;">
        © 2025 PeptídeosBio · Você recebeu este email porque criou uma conta em peptideosbio.com
      </p>
    </div>
  </div>
</body>
</html>`,
      });
      this.logger.log(`Email de boas-vindas enviado para ${email}`);
    } catch (err: any) {
      // Não bloquear o cadastro se o email falhar
      this.logger.error(`Falha ao enviar email de boas-vindas para ${email}`, err?.message);
    }
  }
}
