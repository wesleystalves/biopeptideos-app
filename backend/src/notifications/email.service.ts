import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_8VZifXJY_nZP3GX8UpfHbZYCH5XAH6vTi';
const FROM = process.env.EMAIL_FROM || 'PeptideosBio <noreply@peptideosbio.com>';
const APP_URL = process.env.APP_URL || 'https://peptideosbio.com';

function baseHtml(body: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#071a2c;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#071a2c 0%,#083a5a 100%);padding:28px 40px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
      <h1 style="margin:0;font-size:20px;font-weight:800;color:#fff;">
        ✦ <span style="background:linear-gradient(90deg,#5b8af5,#00e5cc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">PeptídeosBio</span>
      </h1>
    </div>
    <div style="padding:36px 40px;">${body}</div>
    <div style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
      <p style="color:#334155;font-size:12px;margin:0;">© 2025 PeptídeosBio · peptideosbio.com</p>
    </div>
  </div>
</body>
</html>`;
}

function ctaBtn(label: string, url: string) {
  return `<div style="text-align:center;margin:28px 0;">
  <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#5b8af5,#00e5cc);color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-weight:800;font-size:16px;box-shadow:0 8px 24px rgba(91,138,245,0.35);">${label}</a>
</div>`;
}

@Injectable()
export class EmailService {
  private readonly resend = new Resend(RESEND_API_KEY);
  private readonly logger = new Logger(EmailService.name);

  private async send(to: string, subject: string, html: string) {
    try {
      const { error } = await this.resend.emails.send({ from: FROM, to, subject, html });
      if (error) {
        this.logger.error(`Email error para ${to}: ${JSON.stringify(error)}`);
        return false;
      }
      this.logger.log(`✉️ [${subject}] → ${to}`);
      return true;
    } catch (err: any) {
      this.logger.error(`Email exception para ${to}`, err?.message);
      return false;
    }
  }

  /** 1. Boas-vindas após registro ou primeira compra */
  async sendWelcome(email: string, name: string): Promise<void> {
    const firstName = name?.split(' ')[0] || 'Olá';
    await this.send(
      email,
      '🧬 Bem-vindo(a) ao PeptídeosBio!',
      baseHtml(`
                <h2 style="margin:0 0 12px;color:#fff;font-size:20px;">Olá, ${firstName}! 👋</h2>
                <p style="color:#94afc7;line-height:1.7;margin:0 0 24px;">
                    Sua conta foi criada com sucesso no <strong style="color:#e2e8f0;">PeptídeosBio</strong>.
                    Você já pode fazer login e acessar o conteúdo adquirido.
                </p>
                ${ctaBtn('Acessar minha conta →', `${APP_URL}/auth/login`)}
                <p style="color:#64748b;font-size:13px;text-align:center;margin:0;">
                    Dúvidas? Responda este e-mail — retornamos em até 24h.
                </p>
            `),
    );
  }

  /** 2. Confirmação de compra após pagamento aprovado */
  async sendPurchaseConfirmation(opts: {
    to: string;
    name?: string;
    plan: 'basic' | 'premium';
    amount: number;
    loginUrl?: string;
  }): Promise<void> {
    const firstName = opts.name?.split(' ')[0] || 'Cliente';
    const planLabel = opts.plan === 'premium' ? 'Plano Premium' : 'Plano Básico (Ebook)';
    const loginUrl = opts.loginUrl || `${APP_URL}/auth/login`;

    await this.send(
      opts.to,
      `🎉 Compra confirmada — ${planLabel}`,
      baseHtml(`
                <h2 style="margin:0 0 8px;color:#fff;font-size:22px;">Compra confirmada! 🎉</h2>
                <p style="margin:0 0 24px;color:#00e5cc;font-weight:700;font-size:16px;">
                    ${planLabel} · R$ ${opts.amount.toFixed(2).replace('.', ',')}
                </p>
                <p style="color:#94afc7;line-height:1.7;margin:0 0 24px;">
                    Olá, <strong style="color:#e2e8f0;">${firstName}</strong>!
                    Seu acesso está liberado. Faça login com o e-mail <strong style="color:#e2e8f0;">${opts.to}</strong> para acessar seu conteúdo.
                </p>
                ${ctaBtn('🚀 Acessar minha conta', loginUrl)}
                <div style="background:rgba(91,138,245,0.08);border:1px solid rgba(91,138,245,0.2);border-radius:12px;padding:16px;margin-top:8px;">
                    <p style="color:#e2e8f0;font-weight:700;font-size:13px;margin:0 0 8px;">🔑 Como acessar:</p>
                    <ol style="color:#64748b;font-size:13px;padding-left:18px;margin:0;line-height:1.8;">
                        <li>Acesse <a href="${loginUrl}" style="color:#5b8af5;">${APP_URL}/auth/login</a></li>
                        <li>Use o e-mail: <strong style="color:#94afc7;">${opts.to}</strong></li>
                        <li>Caso não tenha senha, clique em "Esqueci minha senha"</li>
                    </ol>
                </div>
                <p style="color:#334155;font-size:12px;text-align:center;margin:20px 0 0;">
                    🛡️ Garantia de 7 dias · Se não gostar, devolvemos 100% do valor.
                </p>
            `),
    );
  }

  /** 3. Verificação de e-mail */
  async sendEmailVerification(opts: { to: string; name?: string; token: string }): Promise<void> {
    const firstName = opts.name?.split(' ')[0] || 'Olá';
    const url = `${APP_URL}/auth/verify-email?token=${opts.token}`;

    await this.send(
      opts.to,
      '✉️ Confirme seu e-mail — PeptídeosBio',
      baseHtml(`
                <h2 style="margin:0 0 12px;color:#fff;font-size:20px;">Confirme seu e-mail, ${firstName}!</h2>
                <p style="color:#94afc7;line-height:1.7;margin:0 0 24px;">
                    Clique no botão abaixo para confirmar seu endereço de e-mail.
                    O link expira em <strong style="color:#e2e8f0;">48 horas</strong>.
                </p>
                ${ctaBtn('✅ Confirmar meu e-mail', url)}
                <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:14px;margin-top:8px;">
                    <p style="color:#4a6580;font-size:11px;margin:0 0 6px;font-weight:700;">OU COPIE O LINK:</p>
                    <p style="color:#64748b;font-size:11px;word-break:break-all;margin:0;">${url}</p>
                </div>
                <p style="color:#334155;font-size:12px;text-align:center;margin:20px 0 0;">
                    Se não criou uma conta, ignore este e-mail.
                </p>
            `),
    );
  }

  /** 4. Recuperação / reset de senha */
  async sendPasswordReset(opts: { to: string; name?: string; token: string }): Promise<void> {
    const firstName = opts.name?.split(' ')[0] || 'Olá';
    const url = `${APP_URL}/auth/reset-password?token=${opts.token}`;

    await this.send(
      opts.to,
      '🔐 Redefinição de senha — PeptídeosBio',
      baseHtml(`
                <h2 style="margin:0 0 12px;color:#fff;font-size:20px;">Redefina sua senha</h2>
                <p style="color:#94afc7;line-height:1.7;margin:0 0 24px;">
                    Olá, <strong style="color:#e2e8f0;">${firstName}</strong>!
                    Clique no botão abaixo para criar uma nova senha.
                    O link expira em <strong style="color:#e2e8f0;">1 hora</strong>.
                </p>
                ${ctaBtn('🔐 Redefinir minha senha', url)}
                <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:14px;margin-top:8px;">
                    <p style="color:#4a6580;font-size:11px;margin:0 0 6px;font-weight:700;">OU COPIE O LINK:</p>
                    <p style="color:#64748b;font-size:11px;word-break:break-all;margin:0;">${url}</p>
                </div>
                <p style="color:#334155;font-size:12px;text-align:center;margin:20px 0 0;">
                    Se não solicitou a redefinição, ignore este e-mail. Sua senha não será alterada.
                </p>
            `),
    );
  }
}
