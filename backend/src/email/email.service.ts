import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

const FROM = process.env.RESEND_FROM || 'BioPeptideos <noreply@peptideosbio.com>';
const APP_URL = process.env.APP_URL || 'https://biopeptidios.dw.aiwhatsapp.com.br';
const EBOOK_URL = 'https://ebook-pep.dw.aiwhatsapp.com.br';

// ─── Layout base ─────────────────────────────────────────────────────────────
function baseLayout(content: string, preheader = '') {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BioPeptideos</title>
</head>
<body style="margin:0;padding:0;background:#080c0b;font-family:'Helvetica Neue',Arial,sans-serif;">
  ${preheader ? `<span style="display:none;font-size:1px;color:#080c0b;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0d1f1a;border:1px solid rgba(0,212,170,0.2);border-radius:16px;overflow:hidden;">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#00d4aa,#00a884);padding:28px 40px;text-align:center;">
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#000;letter-spacing:-0.5px;">🧬 BioPeptideos</h1>
          <p style="margin:4px 0 0;font-size:12px;color:rgba(0,0,0,0.6);font-weight:600;letter-spacing:0.05em;">O CÓDIGO SECRETO DOS PEPTÍDEOS</p>
        </td></tr>
        <!-- Content -->
        <tr><td style="padding:40px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <p style="margin:0 0 8px;font-size:12px;color:#4a7060;">© 2025 BioPeptideos · peptideosbio.com</p>
          <p style="margin:0;font-size:11px;color:#3a5050;">
            Você recebeu este e-mail por ter adquirido um produto ou criado uma conta.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Botão CTA ────────────────────────────────────────────────────────────────
function btn(label: string, url: string, secondary = false) {
    const bg = secondary ? 'transparent' : '#00d4aa';
    const color = secondary ? '#00d4aa' : '#000';
    const border = secondary ? '2px solid #00d4aa' : 'none';
    return `<a href="${url}" style="display:inline-block;background:${bg};color:${color};border:${border};border-radius:8px;padding:14px 32px;font-size:15px;font-weight:800;text-decoration:none;">${label}</a>`;
}

// ─── Separador ────────────────────────────────────────────────────────────────
const divider = `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:28px 0;" />`;

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly resend = new Resend(process.env.RESEND_API_KEY);

    private async send(opts: {
        to: string;
        subject: string;
        html: string;
        tags?: { name: string; value: string }[];
    }) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: FROM,
                to: opts.to,
                subject: opts.subject,
                html: opts.html,
                tags: opts.tags,
            });
            if (error) {
                this.logger.error(`Email error para ${opts.to}: ${JSON.stringify(error)}`);
                return false;
            }
            this.logger.log(`✉️ Email enviado: [${opts.subject}] → ${opts.to} (${data?.id})`);
            return true;
        } catch (err) {
            this.logger.error(`Email exception para ${opts.to}`, err?.message);
            return false;
        }
    }

    // ── 1. BOAS-VINDAS (após registro) ────────────────────────────────────────
    async sendWelcome(opts: { to: string; name?: string }) {
        const name = opts.name || 'Cientista';
        return this.send({
            to: opts.to,
            subject: '🧬 Bem-vindo ao BioPeptideos',
            tags: [{ name: 'type', value: 'welcome' }],
            html: baseLayout(
                `<h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#f0f4f3;">Olá, ${name}! 👋</h2>
                <p style="margin:0 0 20px;color:#8fa8a0;font-size:15px;line-height:1.7;">
                  Sua conta no <strong style="color:#00d4aa;">BioPeptideos</strong> está ativa. Você agora faz parte da comunidade que está descobrindo o código secreto do corpo humano.
                </p>
                <p style="margin:0 0 28px;color:#8fa8a0;font-size:14px;line-height:1.7;">
                  Com a sua conta você pode acompanhar seus protocolos, acessar o conteúdo do ebook e usar a IA especialista em peptídeos.
                </p>
                <div style="text-align:center;margin-bottom:28px;">
                  ${btn('Acessar a Plataforma', APP_URL)}
                </div>
                ${divider}
                <p style="margin:0;font-size:12px;color:#4a7060;text-align:center;">
                  Dúvidas? Reply neste e-mail que respondemos em até 24h.
                </p>`,
                'Sua jornada com peptídeos começa agora',
            ),
        });
    }

    // ── 2. CONFIRMAÇÃO DE COMPRA ─────────────────────────────────────────────
    async sendPurchaseConfirmation(opts: {
        to: string;
        name?: string;
        plan: 'basic' | 'premium';
        amount: number;
        autoLoginUrl?: string;
    }) {
        const name = opts.name || 'Cientista';
        const isPremium = opts.plan === 'premium';
        const planLabel = isPremium ? 'Plano Premium' : 'Plano Básico';
        const planFeatures = isPremium
            ? ['Ebook completo — 5 capítulos', 'Acesso VIP à plataforma BioPeptideos', '🤖 IA Especialista em peso real', 'Calculadora de dosagem interativa', 'Biblioteca de 54 peptídeos', 'Atualizações vitalícias']
            : ['Ebook completo — 5 capítulos', 'Enciclopédia de 25+ peptídeos', '6 Protocolos prontos para usar', 'Acesso vitalício'];

        const featuresHtml = planFeatures
            .map(f => `<li style="padding:6px 0;color:#c8ddd8;font-size:14px;"><span style="color:#00d4aa;margin-right:8px;">✓</span>${f}</li>`)
            .join('');

        const ctaUrl = opts.autoLoginUrl || APP_URL;

        return this.send({
            to: opts.to,
            subject: `🎉 Compra confirmada — ${planLabel} BioPeptideos`,
            tags: [{ name: 'type', value: 'purchase_confirmation' }, { name: 'plan', value: opts.plan }],
            html: baseLayout(
                `<h2 style="margin:0 0 4px;font-size:26px;font-weight:800;color:#f0f4f3;">Compra confirmada! 🎉</h2>
                <p style="margin:0 0 24px;color:#00d4aa;font-size:16px;font-weight:700;">${planLabel} · R$ ${opts.amount.toFixed(2).replace('.', ',')}</p>

                <div style="background:rgba(0,212,170,0.06);border:1px solid rgba(0,212,170,0.2);border-radius:12px;padding:24px;margin-bottom:28px;">
                  <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#00d4aa;letter-spacing:0.05em;">O QUE ESTÁ INCLUÍDO:</p>
                  <ul style="list-style:none;padding:0;margin:0;">${featuresHtml}</ul>
                </div>

                <p style="margin:0 0 24px;color:#8fa8a0;font-size:14px;line-height:1.7;">
                  Olá, <strong style="color:#f0f4f3;">${name}</strong>! Seu acesso está liberado. Clique no botão abaixo para entrar diretamente na plataforma — sem precisar de senha.
                </p>

                <div style="text-align:center;margin-bottom:28px;">
                  ${btn('🚀 Acessar Meu Conteúdo Agora', ctaUrl)}
                </div>
                <p style="text-align:center;font-size:12px;color:#4a7060;margin:0 0 24px;">
                  Este link de acesso expira em 24 horas. Após isso, use seu e-mail e senha para entrar.
                </p>
                ${divider}
                <p style="margin:0;font-size:12px;color:#4a7060;text-align:center;">
                  🛡️ Garantia de 7 dias · Se não gostar, devolvemos 100% do valor.
                </p>`,
                'Seu acesso está liberado — clique para entrar',
            ),
        });
    }

    // ── 3. MAGIC LINK (auto-login) ────────────────────────────────────────────
    async sendMagicLink(opts: { to: string; name?: string; token: string }) {
        const url = `${APP_URL}/auth/auto-login?token=${opts.token}`;
        const name = opts.name || 'você';

        return this.send({
            to: opts.to,
            subject: '🔑 Seu link de acesso — BioPeptideos',
            tags: [{ name: 'type', value: 'magic_link' }],
            html: baseLayout(
                `<h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f0f4f3;">Acesse sua conta com 1 clique</h2>
                <p style="margin:0 0 24px;color:#8fa8a0;font-size:14px;line-height:1.7;">
                  Olá, <strong style="color:#f0f4f3;">${name}</strong>! Aqui está seu link de acesso mágico. Ele expira em <strong style="color:#f0f4f3;">24 horas</strong>.
                </p>

                <div style="text-align:center;margin-bottom:24px;">
                  ${btn('🔑 Entrar na Plataforma', url)}
                </div>

                <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:24px;">
                  <p style="margin:0 0 8px;font-size:11px;color:#4a7060;font-weight:700;">OU COPIE O LINK:</p>
                  <p style="margin:0;font-size:11px;color:#8fa8a0;word-break:break-all;">${url}</p>
                </div>

                ${divider}
                <p style="margin:0;font-size:12px;color:#4a7060;text-align:center;">
                  Se não solicitou este e-mail, ignore-o com segurança.
                </p>`,
                'Seu link de acesso mágico está aqui',
            ),
        });
    }

    // ── 4. RESET DE SENHA ─────────────────────────────────────────────────────
    async sendPasswordReset(opts: { to: string; name?: string; token: string }) {
        const url = `${APP_URL}/auth/reset-password?token=${opts.token}`;
        const name = opts.name || 'você';

        return this.send({
            to: opts.to,
            subject: '🔐 Redefinição de senha — BioPeptideos',
            tags: [{ name: 'type', value: 'password_reset' }],
            html: baseLayout(
                `<h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f0f4f3;">Redefinir sua senha</h2>
                <p style="margin:0 0 24px;color:#8fa8a0;font-size:14px;line-height:1.7;">
                  Olá, <strong style="color:#f0f4f3;">${name}</strong>! Você solicitou a redefinição da sua senha. Clique no botão abaixo — o link expira em <strong style="color:#f0f4f3;">1 hora</strong>.
                </p>
                <div style="text-align:center;margin-bottom:28px;">
                  ${btn('🔐 Redefinir Minha Senha', url)}
                </div>
                ${divider}
                <p style="margin:0;font-size:12px;color:#4a7060;text-align:center;">
                  Se não solicitou a redefinição, ignore este e-mail. Sua senha não será alterada.
                </p>`,
                'Link para redefinição de senha',
            ),
        });
    }

    // ── 5. UPSELL (promover básico → premium) ─────────────────────────────────
    async sendUpsellPremium(opts: { to: string; name?: string; coupon?: string }) {
        const name = opts.name || 'Cientista';
        const ctaUrl = coupon => `${EBOOK_URL}${coupon ? `?coupon=${coupon}` : ''}`;

        return this.send({
            to: opts.to,
            subject: '⚡ Desbloqueie a IA especialista — Oferta exclusiva',
            tags: [{ name: 'type', value: 'upsell_premium' }],
            html: baseLayout(
                `<h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f0f4f3;">Você está usando apenas 30% do potencial</h2>
                <p style="margin:0 0 20px;color:#8fa8a0;font-size:14px;line-height:1.7;">
                  Olá, <strong style="color:#f0f4f3;">${name}</strong>! Com o Plano Básico você tem o ebook — mas a magia real está na <strong style="color:#00d4aa;">IA Especialista</strong> que cria protocolos personalizados para o seu objetivo.
                </p>

                <div style="background:rgba(0,212,170,0.06);border:1px solid rgba(0,212,170,0.3);border-radius:12px;padding:24px;margin-bottom:28px;">
                  <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#00d4aa;">O QUE VOCÊ ESTÁ PERDENDO:</p>
                  ${['🤖 IA que analisa seu objetivo e monta o protocolo ideal', '📊 Calculadora de dosagem interativa', '🔬 Biblioteca com 54 peptídeos detalhados', '⚡ Atualizações vitalícias da plataforma'].map(f => `<p style="margin:0 0 8px;color:#c8ddd8;font-size:14px;"><span style="color:#00d4aa;margin-right:6px;">✓</span>${f}</p>`).join('')}
                </div>

                ${opts.coupon ? `<p style="text-align:center;color:#f0f4f3;font-size:13px;font-weight:700;margin:0 0 16px;">🎁 Use o cupom <span style="background:#00d4aa;color:#000;padding:2px 10px;border-radius:4px;letter-spacing:1px;">${opts.coupon}</span> e ganhe desconto especial</p>` : ''}

                <div style="text-align:center;margin-bottom:16px;">
                  ${btn('Fazer Upgrade por R$ 29,90', ctaUrl(opts.coupon))}
                </div>
                <p style="text-align:center;font-size:12px;color:#4a7060;margin:0;">🛡️ Garantia de 7 dias · Acesso imediato</p>`,
                'Desbloqueie a IA especialista em peptídeos',
            ),
        });
    }

    // ── 6. BROADCAST / INFORMATIVO ────────────────────────────────────────────
    async sendBroadcast(opts: {
        to: string[];
        subject: string;
        title: string;
        body: string;
        ctaLabel?: string;
        ctaUrl?: string;
    }) {
        const results = await Promise.allSettled(
            opts.to.map(email =>
                this.send({
                    to: email,
                    subject: opts.subject,
                    tags: [{ name: 'type', value: 'broadcast' }],
                    html: baseLayout(
                        `<h2 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#f0f4f3;">${opts.title}</h2>
                        <div style="color:#8fa8a0;font-size:14px;line-height:1.8;">${opts.body}</div>
                        ${opts.ctaLabel && opts.ctaUrl ? `<div style="text-align:center;margin-top:28px;">${btn(opts.ctaLabel, opts.ctaUrl)}</div>` : ''}
                        ${divider}
                        <p style="margin:0;font-size:12px;color:#4a7060;text-align:center;">BioPeptideos · peptideosbio.com</p>`,
                    ),
                }),
            ),
        );
        const sent = results.filter(r => r.status === 'fulfilled').length;
        this.logger.log(`Broadcast "${opts.subject}": ${sent}/${opts.to.length} enviados`);
        return { sent, total: opts.to.length };
    }

    // ── 7. ADMIN: teste de envio ──────────────────────────────────────────────
    async sendTest(to: string) {
        return this.send({
            to,
            subject: '✅ Teste de e-mail — BioPeptideos',
            html: baseLayout(
                `<h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f0f4f3;">Sistema de e-mail funcionando! ✅</h2>
                <p style="color:#8fa8a0;font-size:14px;margin:0;">Este é um teste do sistema de e-mail da plataforma BioPeptideos enviado via Resend com o domínio peptideosbio.com.</p>`,
                'Teste de configuração',
            ),
        });
    }
}
