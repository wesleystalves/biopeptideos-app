"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Package, ShoppingCart, ChevronLeft, Star } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dw.peptideosbio.com";

export default function ProductPage({ params }: { params: { slug: string } }) {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        fetch(`${API}/api/products/${params.slug}`)
            .then(r => r.json())
            .then(data => { setProduct(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [params.slug]);

    function addToCart() {
        if (!product) return;
        const cart = JSON.parse(localStorage.getItem("bp_cart") || "[]");
        const existing = cart.findIndex((i: any) => i.id === product.id);
        if (existing >= 0) {
            cart[existing].qty += 1;
        } else {
            cart.push({ id: product.id, name: product.name, price: product.price, currency: product.currency, qty: 1 });
        }
        localStorage.setItem("bp_cart", JSON.stringify(cart));
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#050d1a" }}>
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#050d1a", color: "#64748b" }}>
            <Package className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">Produto não encontrado</p>
            <Link href="/catalog" className="btn-secondary mt-4 text-xs">← Voltar ao catálogo</Link>
        </div>
    );

    return (
        <div className="min-h-screen" style={{ background: "#050d1a" }}>
            <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-40" style={{ background: "rgba(5,13,26,0.8)" }}>
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-3">
                    <Link href="/catalog" className="flex items-center gap-1.5 text-sm" style={{ color: "#94a3b8" }}>
                        <ChevronLeft className="w-4 h-4" /> Catálogo
                    </Link>
                    <div className="flex-1" />
                    <Link href="/cart" className="relative">
                        <ShoppingCart className="w-5 h-5" style={{ color: "#94a3b8" }} />
                    </Link>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Imagem */}
                    <div className="rounded-2xl overflow-hidden h-96 flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(10,20,40,0.95) 100%)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <Package className="w-24 h-24" style={{ color: "rgba(14,165,233,0.2)" }} />
                        )}
                    </div>

                    {/* Info */}
                    <div className="space-y-5">
                        <div>
                            <div className="text-xs font-medium uppercase tracking-wide mb-2 capitalize" style={{ color: "#0ea5e9" }}>
                                {product.category}
                            </div>
                            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
                        </div>

                        {/* Reviews placeholder */}
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#fbbf24" }} />)}
                            <span className="text-xs" style={{ color: "#64748b" }}>Produto verificado</span>
                        </div>

                        {/* Preço */}
                        <div className="text-3xl font-bold" style={{ color: "#34d399" }}>
                            {product.currency} {Number(product.price).toFixed(2)}
                        </div>

                        {/* Descrição */}
                        <p className="leading-relaxed text-sm" style={{ color: "#94a3b8" }}>
                            {product.description || "Formulação de alta pureza desenvolvida para performance e longevidade. Cada lote é testado para garantir pureza mínima de 98%."}
                        </p>

                        {/* Compliance badge */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}>
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                            Produto aprovado para sua região · Para uso em pesquisa
                        </div>

                        {/* Botão */}
                        <button
                            onClick={addToCart}
                            className={added ? "btn-success w-full justify-center py-3.5 text-base" : "btn-primary w-full justify-center py-3.5 text-base"}
                        >
                            {added ? "✓ Adicionado ao carrinho!" : "Adicionar ao Carrinho"}
                        </button>

                        <Link href="/cart" className="btn-secondary w-full justify-center text-sm">
                            Ver Carrinho
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
