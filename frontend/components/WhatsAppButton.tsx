'use client';

/**
 * WhatsAppButton — botão flutuante fixo no canto inferior direito.
 * Abre conversa direta no WhatsApp com o número configurado.
 * Aparece em todas as páginas do site.
 */
export default function WhatsAppButton() {
    const phone = '5547999043771'; // +55 47 9904-3771
    const message = encodeURIComponent('Olá! Vim pelo site PeptideosBio e gostaria de mais informações.');
    const href = `https://wa.me/${phone}?text=${message}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fale conosco pelo WhatsApp"
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(37, 211, 102, 0.5), 0 2px 8px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                textDecoration: 'none',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.12)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(37, 211, 102, 0.65), 0 4px 12px rgba(0,0,0,0.35)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.5), 0 2px 8px rgba(0,0,0,0.3)';
            }}
        >
            {/* Anel de pulso animado */}
            <span
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '2px solid rgba(37, 211, 102, 0.6)',
                    animation: 'waPulse 2s ease-out infinite',
                }}
            />
            <style>{`
                @keyframes waPulse {
                    0%   { transform: scale(1);   opacity: 0.8; }
                    70%  { transform: scale(1.55); opacity: 0; }
                    100% { transform: scale(1.55); opacity: 0; }
                }
            `}</style>

            {/* Ícone SVG oficial do WhatsApp */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="32"
                height="32"
                fill="white"
                aria-hidden="true"
            >
                <path d="M16.004 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.362.638 4.592 1.75 6.521L2.667 29.333l6.979-1.729A13.27 13.27 0 0 0 16.004 29.333c7.368 0 13.329-5.969 13.329-13.333 0-7.364-5.961-13.333-13.329-13.333Zm0 24.267a11.01 11.01 0 0 1-5.613-1.535l-.402-.24-4.146 1.027 1.046-3.993-.262-.41A10.974 10.974 0 0 1 5.001 16c0-6.077 4.926-11.001 11.003-11.001 6.077 0 11.001 4.924 11.001 11.001 0 6.077-4.924 11.001-11.001 11.001Zm6.03-8.237c-.33-.165-1.953-.964-2.256-1.073-.303-.109-.524-.165-.745.165-.22.33-.856 1.073-.049 1.403.33.165 1.073.648 1.073.648s-.33.73-.99 1.372c-.66.643-1.566 1.072-2.64 1.072-1.703 0-3.245-.896-4.108-2.25-.863-1.355-.88-3.002-.049-4.378.83-1.375 2.32-2.201 3.929-2.201.494 0 .99.069 1.456.208.467.138.896.346 1.28.621.384.275.714.621.979 1.017.264.396.462.836.577 1.299.115.462.148.944.099 1.42" />
            </svg>
        </a>
    );
}
