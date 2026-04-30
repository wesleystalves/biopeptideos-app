"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Bot, Save, RefreshCw, Wifi, WifiOff, QrCode, Plus, Trash2, Send, ChevronDown, Key, Wrench, BookOpen, MessageSquare, Settings2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";
const TABS = [
  { id: "ai", label: "IA & OpenAI", icon: Bot },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { id: "tools", label: "Ferramentas", icon: Wrench },
  { id: "knowledge", label: "Base de Conhecimento", icon: BookOpen },
  { id: "test", label: "Testar IA", icon: Send },
];

const DEFAULT = {
  systemPrompt: `Você é um consultor especialista em peptídeos bioativos da BioPeptídeos.\nSeu objetivo é ajudar o cliente a encontrar a solução ideal para seus objetivos.\n- Nunca se apresente como IA\n- Conduza naturalmente para a conversão\n- Use linguagem profissional e acessível\n- Ofereça o checkout quando o cliente demonstrar interesse`,
  temperature: 0.7, maxTokens: 500, model: "gpt-4o-mini",
  welcomeMessage: "Olá! Seja bem-vindo à BioPeptídeos. Como posso ajudar?",
  followUpDelay: 30, enableAutoCheckout: true, enableFollowUp: true,
  enableTools: true,
};

const TOOL_LIST = [
  { key: "get_site_info", label: "Informações do Site", desc: "Preços, planos, ebook e catálogo em tempo real" },
  { key: "search_peptides", label: "Busca de Peptídeos", desc: "Acesso à biblioteca completa de 70 peptídeos" },
  { key: "get_user_profile", label: "Perfil do Cliente", desc: "Histórico de compras e plano ativo do lead" },
  { key: "create_checkout_link", label: "Gerar Checkout", desc: "Cria link de pagamento direto para o cliente" },
  { key: "save_lead_data", label: "Salvar Dados", desc: "Atualiza nome, email e interesse no CRM" },
  { key: "get_protocols", label: "Protocolos", desc: "Protocolos de uso por objetivo do cliente" },
];

export default function AIConfigPage() {
  const [tab, setTab] = useState("ai");
  const [config, setConfig] = useState<any>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // WhatsApp state
  const [evoUrl, setEvoUrl] = useState("");
  const [evoKey, setEvoKey] = useState("");
  const [evoSaving, setEvoSaving] = useState(false);
  const [evoTest, setEvoTest] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [instances, setInstances] = useState<any[]>([]);
  const [newInstance, setNewInstance] = useState("");
  const [qrData, setQrData] = useState<Record<string, { qrCode?: string; status: string }>>({});
  const pollRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Test chat state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const tok = () => typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  const h = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${tok()}` });

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/ai-config`, { headers: h() }).then(r => r.json()),
      fetch(`${API}/api/evolution/config`, { headers: h() }).then(r => r.json()).catch(() => ({})),
    ]).then(([ai, evo]) => {
      setConfig({ ...DEFAULT, ...ai });
      setEvoUrl(evo["evolution.url"] || "");
      setEvoKey(evo["evolution.api_key"] || "");
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []); // eslint-disable-line

  const loadInstances = useCallback(async () => {
    const r = await fetch(`${API}/api/evolution/instances`, { headers: h() });
    if (r.ok) { const d = await r.json(); setInstances(Array.isArray(d) ? d : []); }
  }, []); // eslint-disable-line

  useEffect(() => { if (tab === "whatsapp") loadInstances(); }, [tab, loadInstances]);

  async function save() {
    setSaving(true);
    await fetch(`${API}/api/ai-config`, { method: "PUT", headers: h(), body: JSON.stringify(config) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000);
  }

  async function saveEvo() {
    setEvoSaving(true);
    const body: any = { url: evoUrl };
    if (evoKey && !evoKey.includes("••")) body.apiKey = evoKey;
    await fetch(`${API}/api/evolution/config`, { method: "POST", headers: h(), body: JSON.stringify(body) });
    setEvoSaving(false);
  }

  async function testEvo() {
    const r = await fetch(`${API}/api/evolution/test`, { headers: h() });
    const d = await r.json();
    setEvoTest(d);
  }

  async function createInstance() {
    if (!newInstance.trim()) return;
    await fetch(`${API}/api/evolution/instances`, { method: "POST", headers: h(), body: JSON.stringify({ name: newInstance, setupWebhook: true }) });
    setNewInstance(""); loadInstances();
  }

  async function connectInstance(name: string) {
    const r = await fetch(`${API}/api/evolution/instances/${name}/qr`, { headers: h() });
    const d = await r.json();
    setQrData(prev => ({ ...prev, [name]: d }));
    // Poll status
    if (pollRef.current[name]) clearInterval(pollRef.current[name]);
    pollRef.current[name] = setInterval(async () => {
      const sr = await fetch(`${API}/api/evolution/instances/${name}/status`, { headers: h() });
      const sd = await sr.json();
      setQrData(prev => ({ ...prev, [name]: { ...prev[name], status: sd.status } }));
      if (sd.status === "open") { clearInterval(pollRef.current[name]); loadInstances(); }
    }, 3000);
  }

  async function deleteInstance(name: string) {
    if (!confirm(`Remover instância "${name}"?`)) return;
    await fetch(`${API}/api/evolution/instances/${name}`, { method: "DELETE", headers: h() });
    loadInstances();
  }

  async function sendTestChat() {
    if (!chatInput.trim()) return;
    const msg = chatInput; setChatInput(""); setChatLoading(true);
    setChatHistory(h => [...h, { role: "user", content: msg }]);
    try {
      const r = await fetch(`${API}/api/ai/chat`, { method: "POST", headers: h(), body: JSON.stringify({ message: msg, history: chatHistory }) });
      const d = await r.json();
      setChatHistory(h => [...h, { role: "assistant", content: d.reply || d.message || "Sem resposta" }]);
    } catch { setChatHistory(h => [...h, { role: "assistant", content: "Erro ao contactar a IA." }]); }
    setChatLoading(false);
  }

  const patch = (k: string, v: any) => setConfig((p: any) => ({ ...p, [k]: v }));

  if (loading) return <div className="flex items-center justify-center h-60"><div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Settings2 className="w-6 h-6 text-brand-400" />Config IA</h1><p className="text-slate-400 text-sm mt-0.5">Evolution API v2.3.7 + OpenAI Agent</p></div>
        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" />{saving ? "Salvando..." : saved ? "✓ Salvo!" : "Salvar"}</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass-card rounded-xl overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? "bg-brand-600 text-white" : "text-slate-400 hover:text-white"}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {/* ─── TAB: IA & OpenAI ─── */}
      {tab === "ai" && (
        <div className="space-y-5 max-w-3xl">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1"><Key className="w-4 h-4 text-brand-400" /><h2 className="font-semibold text-white text-sm">OpenAI</h2></div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">API Key (sk-...)</label>
              <input type="password" className="input w-full font-mono text-xs" placeholder="sk-proj-••••••••" value={config.openaiApiKey || ""} onChange={e => patch("openaiApiKey", e.target.value)} />
              <p className="text-xs text-slate-600">Salva no banco de forma segura. Deixe em branco para manter a atual.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Modelo</label>
                <div className="relative">
                  <select className="input w-full appearance-none pr-8" value={config.model} onChange={e => patch("model", e.target.value)}>
                    <option value="gpt-4o-mini">GPT-4o Mini (rápido)</option>
                    <option value="gpt-4o">GPT-4o (poderoso)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-4.1">GPT-4.1</option>
                    <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Temperatura: <span className="text-brand-400">{config.temperature}</span></label>
                <input type="range" min={0} max={1} step={0.1} value={config.temperature} onChange={e => patch("temperature", parseFloat(e.target.value))} className="w-full accent-brand-500" />
                <div className="flex justify-between text-[10px] text-slate-600"><span>Preciso</span><span>Criativo</span></div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Max Tokens</label>
                <input type="number" min={100} max={4000} step={50} className="input w-full" value={config.maxTokens} onChange={e => patch("maxTokens", parseInt(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Follow-up (minutos)</label>
                <input type="number" min={5} max={120} className="input w-full" value={config.followUpDelay} onChange={e => patch("followUpDelay", parseInt(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="flex items-center gap-2 mb-1"><Bot className="w-4 h-4 text-brand-400" /><h2 className="font-semibold text-white text-sm">System Prompt</h2></div>
            <p className="text-xs text-slate-500">Define a personalidade e objetivos do agente em todas as conversas.</p>
            <textarea rows={8} className="input w-full resize-none font-mono text-xs leading-relaxed" value={config.systemPrompt} onChange={e => patch("systemPrompt", e.target.value)} />
          </div>

          <div className="glass-card p-6 space-y-3">
            <h2 className="font-semibold text-white text-sm">Mensagens & Recursos</h2>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Mensagem de Boas-vindas</label>
              <input className="input w-full" value={config.welcomeMessage} onChange={e => patch("welcomeMessage", e.target.value)} />
            </div>
            <div className="space-y-2 pt-2">
              {[{ key: "enableAutoCheckout", label: "Checkout automático", desc: "IA envia link quando detecta intenção de compra" },
                { key: "enableFollowUp", label: "Follow-up automático", desc: "Reenvia se cliente não responder" },
                { key: "enableTools", label: "Ferramentas (Tools)", desc: "Permite IA buscar dados do site em tempo real" }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                  <div><div className="text-sm font-medium text-white">{item.label}</div><div className="text-xs text-slate-500 mt-0.5">{item.desc}</div></div>
                  <button onClick={() => patch(item.key, !config[item.key])} className={`w-11 h-6 rounded-full transition-colors ${config[item.key] ? "bg-brand-600" : "bg-slate-700"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${config[item.key] ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: WhatsApp ─── */}
      {tab === "whatsapp" && (
        <div className="space-y-5 max-w-3xl">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold text-white text-sm flex items-center gap-2"><QrCode className="w-4 h-4 text-green-400" />Evolution API v2.3.7</h2>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">URL da Evolution API</label>
                <input className="input w-full font-mono text-xs" placeholder="https://evolution.seudominio.com" value={evoUrl} onChange={e => setEvoUrl(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">API Key Global</label>
                <input type="password" className="input w-full font-mono text-xs" placeholder="sua-api-key-aqui" value={evoKey} onChange={e => setEvoKey(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <button onClick={saveEvo} disabled={evoSaving} className="btn-primary flex items-center gap-2 text-sm">
                  <Save className="w-4 h-4" />{evoSaving ? "Salvando..." : "Salvar Config"}
                </button>
                <button onClick={testEvo} className="btn-secondary flex items-center gap-2 text-sm">
                  <Wifi className="w-4 h-4" />Testar Conexão
                </button>
              </div>
              {evoTest && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${evoTest.ok ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                  {evoTest.ok ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                  {evoTest.ok ? "✅ Conexão OK! Evolution API v2.3.7 respondendo." : `❌ Erro: ${evoTest.error}`}
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white text-sm">Instâncias WhatsApp</h2>
              <button onClick={loadInstances} className="text-slate-400 hover:text-white"><RefreshCw className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-2">
              <input className="input flex-1 text-sm" placeholder="Nome da instância (ex: biopeptideos)" value={newInstance} onChange={e => setNewInstance(e.target.value)} onKeyDown={e => e.key === "Enter" && createInstance()} />
              <button onClick={createInstance} className="btn-primary flex items-center gap-2 text-sm px-4"><Plus className="w-4 h-4" />Criar</button>
            </div>

            <div className="space-y-3">
              {instances.length === 0 && <p className="text-slate-500 text-sm text-center py-4">Nenhuma instância criada.</p>}
              {instances.map((inst: any) => {
                const qr = qrData[inst.instanceName];
                const status = qr?.status || inst.status || "unknown";
                return (
                  <div key={inst.instanceName} className="glass-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{inst.instanceName}</div>
                        <div className={`text-xs mt-0.5 ${status === "open" ? "text-emerald-400" : status === "connecting" ? "text-yellow-400" : "text-slate-500"}`}>
                          {status === "open" ? "✅ Conectado" : status === "connecting" ? "⏳ Conectando..." : "❌ Desconectado"}
                          {inst.profileName && ` · ${inst.profileName}`}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {status !== "open" && (
                          <button onClick={() => connectInstance(inst.instanceName)} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"><QrCode className="w-3 h-3" />Conectar</button>
                        )}
                        <button onClick={() => deleteInstance(inst.instanceName)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    {qr?.qrCode && status !== "open" && (
                      <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl">
                        <img src={qr.qrCode.startsWith("data:") ? qr.qrCode : `data:image/png;base64,${qr.qrCode}`} alt="QR Code" className="w-48 h-48 object-contain" />
                        <p className="text-slate-800 text-xs font-medium">Escaneie com seu WhatsApp</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: Ferramentas ─── */}
      {tab === "tools" && (
        <div className="space-y-4 max-w-3xl">
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white text-sm mb-1">Tools do Agente</h2>
            <p className="text-xs text-slate-500 mb-5">Controle quais capacidades o agente pode usar nas conversas.</p>
            <div className="space-y-3">
              {TOOL_LIST.map(tool => {
                const enabledTools: string[] = config.enabledTools || TOOL_LIST.map(t => t.key);
                const isOn = enabledTools.includes(tool.key);
                return (
                  <div key={tool.key} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <div className="text-sm font-medium text-white">{tool.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{tool.desc}</div>
                    </div>
                    <button onClick={() => {
                      const cur: string[] = config.enabledTools || TOOL_LIST.map(t => t.key);
                      const next = isOn ? cur.filter(k => k !== tool.key) : [...cur, tool.key];
                      patch("enabledTools", next);
                    }} className={`w-11 h-6 rounded-full transition-colors ${isOn ? "bg-brand-600" : "bg-slate-700"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${isOn ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: Base de Conhecimento ─── */}
      {tab === "knowledge" && (
        <div className="space-y-4 max-w-3xl">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold text-white text-sm">Base de Conhecimento</h2>
            <p className="text-xs text-slate-500">Informações extras que a IA usa automaticamente nas conversas. Adicione detalhes sobre sua empresa, ofertas especiais, políticas, etc.</p>
            <textarea rows={12} className="input w-full resize-none font-mono text-xs leading-relaxed"
              placeholder={`Exemplos:\n- A BioPeptídeos tem suporte via WhatsApp das 9h às 18h\n- Parcelamento em até 12x no cartão\n- Cupom BEMVINDO10 dá 10% de desconto na primeira compra\n- Promoção do mês: Premium com 30% OFF\n- Entrega digital imediata após o pagamento`}
              value={config.knowledgeBase || ""} onChange={e => patch("knowledgeBase", e.target.value)} />
            <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300">
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              A IA já tem acesso automático a: preços atuais, catálogo de peptídeos, perfil do cliente e protocolos de uso. Use este campo para informações adicionais.
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: Testar IA ─── */}
      {tab === "test" && (
        <div className="space-y-4 max-w-3xl">
          <div className="glass-card p-6 flex flex-col" style={{ minHeight: 480 }}>
            <h2 className="font-semibold text-white text-sm mb-4 flex items-center gap-2"><Send className="w-4 h-4 text-brand-400" />Chat de Teste</h2>
            <div className="flex-1 space-y-3 mb-4 overflow-y-auto" style={{ maxHeight: 320 }}>
              {chatHistory.length === 0 && <p className="text-slate-500 text-sm text-center py-8">Envie uma mensagem para testar o agente.</p>}
              {chatHistory.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === "user" ? "bg-brand-600 text-white" : "bg-white/10 text-slate-200"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading && <div className="flex justify-start"><div className="bg-white/10 p-3 rounded-2xl text-slate-400 text-sm">Pensando...</div></div>}
            </div>
            <div className="flex gap-2">
              <input className="input flex-1 text-sm" placeholder="Escreva uma mensagem de teste..." value={chatInput}
                onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendTestChat()} />
              <button onClick={sendTestChat} disabled={chatLoading || !chatInput.trim()} className="btn-primary px-4"><Send className="w-4 h-4" /></button>
            </div>
            <button onClick={() => setChatHistory([])} className="text-xs text-slate-500 hover:text-slate-300 mt-2 self-center">Limpar conversa</button>
          </div>
        </div>
      )}
    </div>
  );
}
