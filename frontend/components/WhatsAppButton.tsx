'use client';

/**
 * WhatsAppButton — botão flutuante com o ícone oficial do WhatsApp
 * Estilo outline/vazado (fundo transparente), exatamente como na imagem enviada.
 * Ícone: bolha de conversa circular com telefone, contorno verde sem preenchimento sólido.
 */
export default function WhatsAppButton() {
    const phone = '5547999043771'; // +55 47 9904-3771
    const message = encodeURIComponent('Olá! Vim pelo site PeptideosBio e gostaria de mais informações.');
    const href = `https://wa.me/${phone}?text=${message}`;

    return (
        <>
            <style>{`
                @keyframes waPulse {
                    0%   { transform: scale(0.9); opacity: 0.7; }
                    70%  { transform: scale(1.6);  opacity: 0; }
                    100% { transform: scale(1.6);  opacity: 0; }
                }
                .wa-btn:hover {
                    transform: scale(1.12) !important;
                    filter: drop-shadow(0 6px 20px rgba(37,211,102,0.75)) drop-shadow(0 2px 8px rgba(0,0,0,0.3)) !important;
                }
            `}</style>

            {/* Anel de pulso — separado para não afetar o ícone */}
            <span style={{
                position: 'fixed',
                bottom: '28px',
                right: '28px',
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(37,211,102,0.25)',
                zIndex: 9998,
                animation: 'waPulse 2.4s ease-out infinite',
                pointerEvents: 'none',
            }} />

            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Fale conosco pelo WhatsApp"
                className="wa-btn"
                style={{
                    position: 'fixed',
                    bottom: '28px',
                    right: '28px',
                    zIndex: 9999,
                    width: '68px',
                    height: '68px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1), filter 0.25s ease',
                    filter: 'drop-shadow(0 4px 16px rgba(37,211,102,0.6)) drop-shadow(0 2px 8px rgba(0,0,0,0.25))',
                }}
            >
                {/*
                  SVG baseado exatamente na imagem enviada:
                  - Contorno outline sem preenchimento (stroke only)
                  - Bolha de conversa circular com rabinho inferior esquerdo
                  - Ícone de telefone preenchido no centro
                */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    width="68"
                    height="68"
                    aria-hidden="true"
                >
                    {/* Bolha de fala — outline exato do WhatsApp (sem preenchimento) */}
                    <path
                        d="
                          M50 8
                          C26.9 8 8 26.9 8 50
                          C8 57.8 10.1 65.1 13.9 71.4
                          L8.5 92
                          L29.6 86.7
                          C35.6 90.1 42.6 92 50 92
                          C73.1 92 92 73.1 92 50
                          C92 26.9 73.1 8 50 8Z
                        "
                        fill="none"
                        stroke="#25D366"
                        strokeWidth="6"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />

                    {/* Telefone — preenchido, centrado na bolha */}
                    <path
                        d="
                          M35 33
                          C35 33 33 35 33 38
                          C33 49 51 67 62 67
                          C65 67 67 65 67 65
                          L63 57
                          L58 59
                          C58 59 53 54 50 49
                          C47 44 45 38 45 38
                          L47 33
                          Z
                        "
                        fill="#25D366"
                        stroke="none"
                    />
                </svg>
            </a>
        </>
    );
}
