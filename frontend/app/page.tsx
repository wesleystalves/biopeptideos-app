import Link from "next/link";
import {
  Activity, ShieldCheck, Zap, Globe, ArrowRight, Star, ChevronRight
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-hero-gradient overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-white/5 backdrop-blur-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-white">Bio</span>
              <span className="gradient-text">Peptidios</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/catalog" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">
              Catálogo
            </Link>
            <Link href="/auth/login" className="text-sm text-slate-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/catalog" className="btn-primary text-xs">
              Explorar Produtos
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-32 px-6 relative">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-400 text-xs font-medium mb-8">
            <ShieldCheck className="w-3.5 h-3.5" />
            Formulações Premium · Pesquisa Avançada
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-none">
            Peptídeos para{" "}
            <span className="gradient-text">Performance</span>
            {" "}& Longevidade
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Acesse formulações de alta pureza usadas por atletas de elite e pesquisadores.
            Protocolos personalizados. Ciência que funciona.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog" className="btn-primary flex items-center gap-2 justify-center text-base px-8 py-3.5">
              Ver Catálogo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/auth/register" className="btn-secondary flex items-center gap-2 justify-center text-base px-8 py-3.5">
              Criar Conta
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-xs text-slate-500">
            {[
              { label: "Pureza mínima", value: "98%" },
              { label: "Países atendidos", value: "30+" },
              { label: "Clientes ativos", value: "5.000+" },
              { label: "Suporte", value: "24/7" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-brand-400">{s.value}</div>
                <div className="mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Uma plataforma. <span className="gradient-text">Resultados reais.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Combinamos ciência de ponta, tecnologia e suporte personalizado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Activity,
                title: "Protocolos Personalizados",
                desc: "IA analisa seus objetivos e monta o protocolo ideal com dosagens precisas.",
              },
              {
                icon: ShieldCheck,
                title: "Compliance Global",
                desc: "Operamos em conformidade com as regulamentações de cada país.",
              },
              {
                icon: Globe,
                title: "Entrega Internacional",
                desc: "Logística discreta para mais de 30 países com rastreamento em tempo real.",
              },
            ].map((f) => (
              <div key={f.title} className="glass-card-hover p-8 group">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-5 group-hover:bg-brand-500/20 transition-colors">
                  <f.icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-brand-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Saiba mais <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
          </div>
          <blockquote className="text-xl text-white font-medium mb-4">
            "Mudou completamente minha recuperação pós-treino. Resultados visíveis em 3 semanas."
          </blockquote>
          <p className="text-slate-400 text-sm mb-10">@atleta_igor · Usuário verificado</p>

          <Link href="/auth/register" className="btn-success flex items-center gap-2 justify-center text-base px-8 py-3.5 w-fit mx-auto">
            Começar agora <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-slate-500">© 2026 BioPeptidios. For research use.</span>
          <div className="flex gap-6 text-xs text-slate-600">
            <Link href="/legal/terms" className="hover:text-slate-400 transition-colors">Termos</Link>
            <Link href="/legal/privacy" className="hover:text-slate-400 transition-colors">Privacidade</Link>
            <Link href="/legal/compliance" className="hover:text-slate-400 transition-colors">Compliance</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
