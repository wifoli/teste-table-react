/**
 * ChartPlaylist
 *
 * Motor de playlist de layouts para dashboards.
 * Não tem nenhuma dependência de gráfico — você monta o layout fora e passa aqui.
 *
 * Exports:
 *   default          → <ChartPlaylist playlist={items} />
 *
 *   Layout helpers:
 *     <PlaylistLayout>   → wrapper raiz de um slide (ocupa 100% da tela)
 *     <Row>              → linha flexível horizontal
 *     <Col>              → coluna flexível vertical
 *     <Cell>             → célula individual (aceita weight/span)
 *     <ScrollTable>      → scroll automático suave para conteúdo longo (tabelas)
 *
 *   Utility:
 *     createSlide(layout, options) → monta o objeto PlaylistItem
 *     TRANSITIONS                 → array com todas as transições disponíveis
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @keyframes pl-fadeIn    { from{opacity:0}              to{opacity:1} }
    @keyframes pl-fadeOut   { from{opacity:1}              to{opacity:0} }
    @keyframes pl-slideInR  { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes pl-slideOutL { from{transform:translateX(0);opacity:1}   to{transform:translateX(-100%);opacity:0} }
    @keyframes pl-slideInU  { from{transform:translateY(80px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes pl-slideOutD { from{transform:translateY(0);opacity:1}   to{transform:translateY(80px);opacity:0} }
    @keyframes pl-zoomIn    { from{transform:scale(.82);opacity:0}      to{transform:scale(1);opacity:1} }
    @keyframes pl-zoomOut   { from{transform:scale(1);opacity:1}        to{transform:scale(1.1);opacity:0} }
    @keyframes pl-blurIn    { from{filter:blur(24px);opacity:0}         to{filter:blur(0);opacity:1} }
    @keyframes pl-blurOut   { from{filter:blur(0);opacity:1}            to{filter:blur(24px);opacity:0} }
    @keyframes pl-flipIn    { from{transform:perspective(1400px) rotateY(-90deg);opacity:0} to{transform:perspective(1400px) rotateY(0);opacity:1} }
    @keyframes pl-flipOut   { from{transform:perspective(1400px) rotateY(0);opacity:1}      to{transform:perspective(1400px) rotateY(90deg);opacity:0} }
    @keyframes pl-scanIn    { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
    @keyframes pl-scanOut   { from{clip-path:inset(0 0% 0 0)}   to{clip-path:inset(0 0 0 100%)} }
    @keyframes pl-glow      { 0%,100%{box-shadow:0 0 8px #00f5ff33} 50%{box-shadow:0 0 28px #00f5ffaa,0 0 56px #00f5ff33} }
    @keyframes pl-blink     { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes pl-tagIn     { from{transform:translateY(8px);opacity:0} to{transform:translateY(0);opacity:1} }

    *, *::before, *::after { box-sizing: border-box; }

    .pl-item { transition: background .15s, border-color .15s; }
    .pl-item:hover { background: #111e30 !important; }
    .pl-item.sel   { border-color: #00f5ff44 !important; background: #0a1e34 !important; }

    .pl-btn {
      background: #0c1827; border: 1px solid #142236; color: #5a8099;
      cursor: pointer; border-radius: 8px; transition: all .16s;
      display: flex; align-items: center; justify-content: center;
      font-family: 'JetBrains Mono', monospace;
    }
    .pl-btn:hover    { background: #162536; border-color: #00f5ff55; color: #00f5ff; }
    .pl-btn:disabled { opacity: .3; cursor: not-allowed; }
    .pl-btn.pri      { background: #00f5ff18; border-color: #00f5ff66; color: #00f5ff; }
    .pl-btn.pri:hover{ background: #00f5ff2a; }
    .pl-btn.red      { border-color: #ff4d6633; color: #ff4d66; }
    .pl-btn.red:hover{ background: #ff4d6618; }

    .pl-chip { cursor: pointer; transition: all .15s; font-family: 'JetBrains Mono', monospace; }
    .pl-chip:hover { border-color: #00f5ff66 !important; color: #00f5ff !important; }
    .pl-chip.on    { border-color: #00f5ff !important; background: #00f5ff18 !important; color: #00f5ff !important; }

    ::-webkit-scrollbar       { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #05080f; }
    ::-webkit-scrollbar-thumb { background: #142236; border-radius: 2px; }
  `}</style>
);

// ─── Tokens ───────────────────────────────────────────────────────────────────
const T = {
  bg:     "#05080f",
  panel:  "#080e1b",
  card:   "#0c1422",
  border: "#121f30",
  acc:    "#00f5ff",
  text:   "#c4dbe8",
  muted:  "#3d6070",
  danger: "#ff4d66",
};

const PAL = ["#00f5ff","#7c3aed","#f472b6","#34d399","#fb923c","#facc15","#60a5fa","#e879f9"];

// ─── Transitions ──────────────────────────────────────────────────────────────
/**
 * Array de transições disponíveis.
 * Cada item: { id, label, in, out }
 * Use o `id` no campo `transition` do PlaylistItem.
 */
export const TRANSITIONS = [
  { id: "fade",    label: "Fade",      in: "pl-fadeIn .5s ease",   out: "pl-fadeOut .35s ease" },
  { id: "slide",   label: "Slide",     in: "pl-slideInR .5s cubic-bezier(.16,1,.3,1)", out: "pl-slideOutL .4s ease" },
  { id: "slideup", label: "Deslizar",  in: "pl-slideInU .5s cubic-bezier(.16,1,.3,1)", out: "pl-slideOutD .4s ease" },
  { id: "zoom",    label: "Zoom",      in: "pl-zoomIn .5s cubic-bezier(.16,1,.3,1)",   out: "pl-zoomOut .4s ease" },
  { id: "blur",    label: "Blur",      in: "pl-blurIn .6s ease",   out: "pl-blurOut .35s ease" },
  { id: "flip",    label: "Flip 3D",   in: "pl-flipIn .6s cubic-bezier(.16,1,.3,1)",   out: "pl-flipOut .4s ease" },
  { id: "scan",    label: "Scanner",   in: "pl-scanIn .5s cubic-bezier(.16,1,.3,1)",   out: "pl-scanOut .4s ease" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Wrapper raiz de um slide.
 * Ocupa 100% do espaço disponível (tela cheia no player, preview no editor).
 * Sempre use como elemento externo do seu layout.
 *
 * @example
 * const slide = (
 *   <PlaylistLayout background="#0a0f1e">
 *     <Row>
 *       <Cell><MeuGrafico /></Cell>
 *       <Cell><MeuGrafico2 /></Cell>
 *     </Row>
 *   </PlaylistLayout>
 * )
 */
export function PlaylistLayout({ children, background, padding, style }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: background || T.bg,
      padding: padding ?? "24px",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}

/**
 * Linha horizontal que divide o espaço entre células.
 * Filhos devem ser <Cell> ou elementos com flex próprio.
 *
 * @param {number} gap   - espaçamento entre células (padrão 16)
 * @param {number} flex  - fator flex desta linha (padrão 1)
 */
export function Row({ children, gap = 16, flex = 1, style }) {
  return (
    <div style={{
      display: "flex", flexDirection: "row",
      flex, gap, minHeight: 0, width: "100%",
      ...style,
    }}>
      {children}
    </div>
  );
}

/**
 * Coluna vertical que divide o espaço entre células.
 *
 * @param {number} gap   - espaçamento entre células (padrão 16)
 * @param {number} flex  - fator flex desta coluna (padrão 1)
 */
export function Col({ children, gap = 16, flex = 1, style }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      flex, gap, minHeight: 0,
      ...style,
    }}>
      {children}
    </div>
  );
}

/**
 * Célula individual dentro de um Row ou Col.
 * O conteúdo preenche automaticamente o espaço disponível.
 *
 * @param {number}  weight  - peso flex relativo (padrão 1). Use 2 para dobrar o tamanho.
 * @param {string}  title   - título exibido acima do conteúdo (opcional)
 * @param {boolean} noPad   - remove o padding interno (útil quando o componente já tem)
 *
 * @example
 * <Row>
 *   <Cell weight={2} title="Receita">  ← ocupa 2/3 da linha
 *     <MeuBarChart />
 *   </Cell>
 *   <Cell weight={1} title="Share">    ← ocupa 1/3 da linha
 *     <MeuPieChart />
 *   </Cell>
 * </Row>
 */
export function Cell({ children, weight = 1, title, noPad = false, background, style }) {
  return (
    <div style={{
      flex: weight, minWidth: 0, minHeight: 0,
      display: "flex", flexDirection: "column",
      background: background || T.card,
      borderRadius: 12,
      border: `1px solid ${T.border}`,
      overflow: "hidden",
      padding: noPad ? 0 : "16px 20px",
      gap: title ? 12 : 0,
      ...style,
    }}>
      {title && (
        <div style={{
          fontFamily: "Syne, sans-serif",
          fontSize: 14, fontWeight: 700,
          color: T.text, flexShrink: 0,
          letterSpacing: "-0.01em",
        }}>
          {title}
        </div>
      )}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Wrapper para conteúdo longo (tabelas, listas) que precisa de scroll automático.
 * Rola suavemente para baixo usando requestAnimationFrame e recomeça ao final.
 *
 * @param {number}  speed    - pixels por frame (padrão 0.55). Valores sugeridos:
 *                             0.3 = lento · 0.55 = padrão · 1.0 = rápido
 * @param {boolean} active   - controla se o scroll está ativo (o player passa isso automaticamente)
 *
 * @example
 * <Cell title="Relatório de Clientes" noPad>
 *   <ScrollTable speed={0.4}>
 *     <MinhaTabela data={clientes} />
 *   </ScrollTable>
 * </Cell>
 */
export function ScrollTable({ children, speed = 0.55, active = true, style }) {
  const ref  = useRef(null);
  const pos  = useRef(0);
  const raf  = useRef(null);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    if (!active) return;

    const el = ref.current;
    if (!el) return;

    // Aguarda o DOM renderizar para ter scrollHeight correto
    const start = () => {
      pos.current  = 0;
      el.scrollTop = 0;

      const tick = () => {
        pos.current += speed;
        const max = el.scrollHeight - el.clientHeight;
        if (max <= 0) return; // conteúdo cabe sem scroll
        if (pos.current >= max) pos.current = 0;
        el.scrollTop = pos.current;
        raf.current  = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    };

    const timer = setTimeout(start, 100);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf.current); };
  }, [active, speed, children]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%", height: "100%",
        overflowY: "hidden", overflowX: "auto",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── createSlide helper ────────────────────────────────────────────────────────
/**
 * Utilitário para montar um objeto PlaylistItem de forma tipada.
 *
 * @param {ReactNode} layout     - o layout completo montado com PlaylistLayout + Row + Cell
 * @param {object}    options    - { id?, title, subtitle?, duration?, transition? }
 *
 * @example
 * const slide = createSlide(
 *   <PlaylistLayout>
 *     <Row>
 *       <Cell title="Vendas"><MeuChart /></Cell>
 *       <Cell title="Meta"><MeuChart2 /></Cell>
 *     </Row>
 *   </PlaylistLayout>,
 *   { title: "Resultado Mensal", duration: 10, transition: "slide" }
 * )
 */
export function createSlide(layout, options = {}) {
  return {
    id:         options.id        ?? Date.now() + Math.random(),
    title:      options.title     ?? "Sem título",
    subtitle:   options.subtitle  ?? "",
    duration:   options.duration  ?? 8,
    transition: options.transition ?? "fade",
    layout,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERNALS — player engine (não precisa mexer aqui)
// ═══════════════════════════════════════════════════════════════════════════════

function Ring({ pct, size = 40, stroke = 2.5, color = T.acc }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
        style={{ transition: "stroke-dashoffset .08s linear" }} strokeLinecap="round"/>
    </svg>
  );
}

function Slide({ item, entering, transition }) {
  const anim = entering ? transition.in : transition.out;
  return (
    <div style={{
      position: "absolute", inset: 0,
      animation: anim,
      willChange: "transform, opacity, filter",
    }}>
      {/* Injeta `active` no ScrollTable se existir diretamente — via contexto ou clone */}
      <SlideActiveContext.Provider value={entering}>
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          {item.layout}
        </div>
      </SlideActiveContext.Provider>
    </div>
  );
}

// Contexto para ScrollTable saber se o slide está ativo
import { createContext, useContext } from "react";
const SlideActiveContext = createContext(true);

// Sobrescreve o `active` do ScrollTable baseado no contexto do player
const _OriginalScrollTable = ScrollTable;
// (ScrollTable já usa `active` prop diretamente, o contexto é bônus para uso sem prop)

function FullPlayer({ playlist, startIdx, onExit }) {
  const [idx,      setIdx]      = useState(startIdx);
  const [playing,  setPlaying]  = useState(true);
  const [entering, setEntering] = useState(true);
  const [pct,      setPct]      = useState(0);
  const [hud,      setHud]      = useState(true);
  const [prevIdx,  setPrevIdx]  = useState(null);
  const [inTrans,  setInTrans]  = useState(false);

  const rafRef   = useRef(null);
  const t0Ref    = useRef(null);
  const hudTimer = useRef(null);
  const locked   = useRef(false);

  const item     = playlist[idx];
  const prevItem = prevIdx !== null ? playlist[prevIdx] : null;
  const tr       = TRANSITIONS.find(t => t.id === (item.transition || "fade")) || TRANSITIONS[0];

  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => { if (document.fullscreenElement) document.exitFullscreen?.(); };
  }, []);

  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onExit(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onExit]);

  const showHud = useCallback(() => {
    setHud(true);
    clearTimeout(hudTimer.current);
    hudTimer.current = setTimeout(() => setHud(false), 3800);
  }, []);

  useEffect(() => { showHud(); }, [idx]);

  const goTo = useCallback((next) => {
    if (locked.current || next === idx) return;
    locked.current = true;
    cancelAnimationFrame(rafRef.current);
    setInTrans(true);
    setEntering(false);
    setPct(0);
    setTimeout(() => {
      setPrevIdx(idx);
      setIdx(next);
      setEntering(true);
      setInTrans(false);
      locked.current = false;
    }, 420);
  }, [idx]);

  const advance = useCallback((dir) => {
    goTo((idx + dir + playlist.length) % playlist.length);
  }, [idx, playlist.length, goTo]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (!playing || inTrans) return;
    t0Ref.current = performance.now();
    const dur = (item.duration || 8) * 1000;
    const tick = now => {
      const p = Math.min(((now - t0Ref.current) / dur) * 100, 100);
      setPct(p);
      if (p < 100) rafRef.current = requestAnimationFrame(tick);
      else advance(1);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, idx, inTrans]);

  return (
    <div
      onMouseMove={showHud}
      onClick={showHud}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: T.bg, overflow: "hidden",
        fontFamily: "'JetBrains Mono', monospace",
        cursor: hud ? "default" : "none",
        animation: "pl-fadeIn .3s ease",
      }}
    >
      {/* Scanlines sutis */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "repeating-linear-gradient(0deg,transparent,transparent 2px,#ffffff03 2px,#ffffff03 4px)" }}/>

      {/* Slides */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {prevItem && !entering && (
          <Slide key={`p${prevIdx}`} item={prevItem} entering={false} transition={tr}/>
        )}
        <Slide key={`c${idx}`} item={item} entering={entering} transition={tr}/>
      </div>

      {/* HUD */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10,
        pointerEvents: hud ? "auto" : "none",
        opacity: hud ? 1 : 0, transition: "opacity .5s ease" }}>

        {/* Top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0,
          background: "linear-gradient(180deg,#05080fee 0%,transparent 100%)",
          padding: "20px 36px 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.danger,
                animation: playing ? "pl-blink 1s infinite" : "none" }}/>
              <span style={{ color: T.muted, fontSize: 11, letterSpacing: "0.1em" }}>
                {playing ? "AO VIVO" : "PAUSADO"}
              </span>
            </div>
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800, color: T.text }}>
              {item.title}
            </span>
            {item.subtitle && (
              <span style={{ color: T.muted, fontSize: 13 }}>{item.subtitle}</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: T.muted, fontSize: 12 }}>{idx + 1} / {playlist.length}</span>
            <button className="pl-btn red" style={{ width: 36, height: 36, fontSize: 14 }}
              onClick={onExit} title="Sair (ESC)">✕</button>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(0deg,#05080ff5 0%,transparent 100%)",
          padding: "48px 36px 24px" }}>

          {/* Progress bar */}
          <div style={{ height: 3, background: T.border, borderRadius: 2, marginBottom: 18, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`,
              background: `linear-gradient(90deg,${T.acc},${PAL[1]})`,
              borderRadius: 2, transition: "width .08s linear",
              boxShadow: `0 0 10px ${T.acc}99` }}/>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="pl-btn" style={{ width: 40, height: 40, fontSize: 16 }}
                onClick={() => advance(-1)}>⏮</button>
              <button className="pl-btn pri" style={{ width: 54, height: 54, fontSize: 22 }}
                onClick={() => setPlaying(p => !p)}>{playing ? "⏸" : "▶"}</button>
              <button className="pl-btn" style={{ width: 40, height: 40, fontSize: 16 }}
                onClick={() => advance(1)}>⏭</button>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginLeft: 6 }}>
                <Ring pct={pct} size={40} stroke={2.5}/>
                <span style={{ color: T.muted, fontSize: 11 }}>
                  {Math.max(0, Math.ceil((item.duration || 8) * (1 - pct / 100)))}s
                </span>
              </div>
            </div>

            {/* Dot navigation */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {playlist.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} style={{
                  width: i === idx ? 26 : 8, height: 8, borderRadius: 4,
                  border: "none", cursor: "pointer", padding: 0,
                  background: i === idx ? T.acc : T.border,
                  boxShadow: i === idx ? `0 0 10px ${T.acc}99` : "none",
                  transition: "all .25s cubic-bezier(.16,1,.3,1)",
                }} title={playlist[i].title}/>
              ))}
            </div>

            {/* Transition label */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: T.muted, fontSize: 10, letterSpacing: "0.08em" }}>TRANSIÇÃO</span>
              <span style={{ color: T.acc, fontSize: 11, fontWeight: 600 }}>
                {tr.label.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal (apenas duration + transition, sem tocar no layout) ───────────
function EditModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    title:      item.title,
    subtitle:   item.subtitle || "",
    duration:   item.duration || 8,
    transition: item.transition || "fade",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inp = {
    background: "#060b14", border: `1px solid ${T.border}`, borderRadius: 8,
    color: T.text, padding: "9px 13px", width: "100%", outline: "none",
    fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
  };
  const lbl = {
    color: T.muted, fontSize: 10, fontWeight: 600,
    textTransform: "uppercase", letterSpacing: "0.08em",
    marginBottom: 5, display: "block",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000d", zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "pl-fadeIn .2s ease" }}>
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 16,
        padding: 32, width: 440, boxShadow: "0 32px 80px #000c",
        fontFamily: "'JetBrains Mono', monospace" }}>

        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 800, color: T.text }}>
            Editar Slide
          </span>
          <button className="pl-btn" style={{ width: 32, height: 32 }} onClick={onClose}>✕</button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Título</label>
          <input value={form.title} onChange={e => set("title", e.target.value)} style={inp}/>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Subtítulo</label>
          <input value={form.subtitle} onChange={e => set("subtitle", e.target.value)} style={inp}/>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Duração (segundos)</label>
          <input type="number" min={2} max={300} value={form.duration}
            onChange={e => set("duration", +e.target.value)} style={inp}/>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={lbl}>Animação de Transição</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TRANSITIONS.map(t => (
              <button key={t.id} className={`pl-chip ${form.transition === t.id ? "on" : ""}`}
                onClick={() => set("transition", t.id)}
                style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${T.border}`,
                  background: T.card, color: T.muted, fontSize: 12, fontWeight: 600 }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="pl-btn" style={{ padding: "10px 20px", fontSize: 13 }} onClick={onClose}>
            Cancelar
          </button>
          <button onClick={() => { onSave({ ...item, ...form }); onClose(); }}
            style={{ padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg,${T.acc}cc,${PAL[1]}cc)`,
              color: "#fff", fontSize: 13, fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              boxShadow: `0 0 20px ${T.acc}44` }}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Playlist row card ─────────────────────────────────────────────────────────
function PlRow({ item, idx, sel, total, onSel, onPlay, onEdit, onDel, onUp, onDn }) {
  const tr = TRANSITIONS.find(t => t.id === item.transition) || TRANSITIONS[0];
  const c  = PAL[idx % PAL.length];

  return (
    <div className={`pl-item ${sel ? "sel" : ""}`}
      style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 11,
        padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
        cursor: "pointer", animation: "pl-tagIn .25s ease forwards" }}
      onClick={onSel}>

      <span style={{ color: T.muted, fontSize: 11, width: 22, textAlign: "center",
        flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>
        {String(idx + 1).padStart(2, "0")}
      </span>

      {/* Color accent */}
      <div style={{ width: 4, height: 36, borderRadius: 4, background: c, flexShrink: 0,
        boxShadow: `0 0 8px ${c}88` }}/>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: T.text, fontSize: 13, fontFamily: "Syne, sans-serif",
          fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.title}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          {[
            { v: `${item.duration}s`, col: T.muted },
            { v: tr.label,            col: T.acc   },
          ].map((t, i) => (
            <span key={i} style={{ background: `${t.col}18`, color: t.col,
              border: `1px solid ${t.col}33`, padding: "1px 8px", borderRadius: 20,
              fontSize: 10, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
              {t.v}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}
        onClick={e => e.stopPropagation()}>
        <button className="pl-btn pri" style={{ width: 28, height: 28, fontSize: 11 }}
          onClick={onPlay} title="Play daqui">▶</button>
        <button className="pl-btn" style={{ width: 28, height: 28, fontSize: 13 }}
          onClick={onUp} disabled={idx === 0}>↑</button>
        <button className="pl-btn" style={{ width: 28, height: 28, fontSize: 13 }}
          onClick={onDn} disabled={idx === total - 1}>↓</button>
        <button className="pl-btn" style={{ width: 28, height: 28, fontSize: 13 }}
          onClick={onEdit}>✎</button>
        <button className="pl-btn red" style={{ width: 28, height: 28, fontSize: 13 }}
          onClick={onDel}>✕</button>
      </div>
    </div>
  );
}

// ─── Preview panel ─────────────────────────────────────────────────────────────
function Preview({ item }) {
  if (!item) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 16, color: T.muted }}>
      <span style={{ fontSize: 36 }}>⊟</span>
      <span style={{ fontSize: 13 }}>Selecione um slide para pré-visualizar</span>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 16,
            fontWeight: 800, color: T.text }}>{item.title}</div>
          {item.subtitle && (
            <div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>{item.subtitle}</div>
          )}
        </div>
        <span style={{ background: `${T.acc}18`, color: T.acc,
          border: `1px solid ${T.acc}44`, padding: "2px 10px", borderRadius: 20,
          fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
          {item.duration}s
        </span>
      </div>

      {/* Preview box */}
      <div style={{ flex: 1, minHeight: 0, border: `1px solid ${T.border}`,
        borderRadius: 12, overflow: "hidden", background: T.bg }}>
        <SlideActiveContext.Provider value={true}>
          {item.layout}
        </SlideActiveContext.Provider>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ChartPlaylist — componente principal
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @param {PlaylistItem[]} playlist  - array de slides montados com createSlide()
 *
 * PlaylistItem: {
 *   id:         number | string
 *   title:      string
 *   subtitle?:  string
 *   duration:   number   // segundos
 *   transition: string   // id de TRANSITIONS
 *   layout:     ReactNode // seu layout montado com PlaylistLayout + Row + Cell
 * }
 */
export default function ChartPlaylist({ playlist: externalPlaylist }) {
  const [pl,      setPl]     = useState(externalPlaylist || []);
  const [selI,    setSelI]   = useState(0);
  const [pIdx,    setPIdx]   = useState(0);
  const [playing, setPlay]   = useState(false);
  const [modal,   setModal]  = useState(false);
  const [editItem,setEdit]   = useState(null);

  // Sincroniza se a prop mudar externamente
  useEffect(() => {
    if (externalPlaylist) setPl(externalPlaylist);
  }, [externalPlaylist]);

  const selected = pl[selI];
  const totalSec = useMemo(() => pl.reduce((s, i) => s + (i.duration || 8), 0), [pl]);

  const updItem = useCallback(item =>
    setPl(p => p.map(x => x.id === item.id ? item : x)), []);

  const delItem = useCallback(id =>
    setPl(p => { const n = p.filter(x => x.id !== id); setSelI(i => Math.min(i, n.length - 1)); return n; }), []);

  const move = useCallback((idx, dir) =>
    setPl(p => {
      const a = [...p], to = idx + dir;
      if (to < 0 || to >= a.length) return a;
      [a[idx], a[to]] = [a[to], a[idx]];
      setSelI(to);
      return a;
    }), []);

  return (
    <>
      <GlobalStyles/>

      {playing && pl.length > 0 && (
        <FullPlayer playlist={pl} startIdx={pIdx} onExit={() => setPlay(false)}/>
      )}

      {modal && editItem && (
        <EditModal
          item={editItem}
          onSave={updItem}
          onClose={() => { setModal(false); setEdit(null); }}
        />
      )}

      <div style={{ minHeight: "100vh", background: T.bg, color: T.text,
        fontFamily: "'JetBrains Mono', monospace", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ borderBottom: `1px solid ${T.border}`, padding: "18px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#07091566" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10,
              background: `${T.acc}15`, border: `1px solid ${T.acc}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, animation: "pl-glow 3s infinite" }}>⊟</div>
            <div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 22,
                fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>
                Chart Playlist
              </div>
              <div style={{ color: T.muted, fontSize: 11, marginTop: 1 }}>
                {pl.length} slide{pl.length !== 1 ? "s" : ""} · {Math.floor(totalSec / 60)}m {totalSec % 60}s total
              </div>
            </div>
          </div>

          <button
            disabled={pl.length === 0}
            onClick={() => { setPIdx(selI); setPlay(true); }}
            style={{ padding: "10px 24px", borderRadius: 9, border: "none",
              cursor: pl.length === 0 ? "not-allowed" : "pointer",
              background: pl.length === 0
                ? T.border
                : `linear-gradient(135deg,${T.acc}cc,${PAL[1]}cc)`,
              color: "#fff", fontSize: 14, fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              display: "flex", alignItems: "center", gap: 9,
              boxShadow: pl.length > 0 ? `0 0 24px ${T.acc}44` : "none",
              transition: "all .2s" }}>
            <span style={{ fontSize: 18 }}>▶</span> Play
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Sidebar */}
          <div style={{ width: 360, flexShrink: 0, borderRight: `1px solid ${T.border}`,
            display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "11px 16px", borderBottom: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: T.muted, fontSize: 10, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.08em" }}>Fila</span>
              {pl.length > 0 && (
                <span style={{ color: T.acc, fontSize: 10 }}>
                  {pl.length} slide{pl.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
              {pl.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 12px", color: T.muted }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>⊟</div>
                  <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                    Nenhum slide na fila.<br/>
                    Passe a prop <code style={{ color: T.text }}>playlist</code> com os<br/>
                    layouts montados.
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {pl.map((item, i) => (
                    <PlRow key={item.id} item={item} idx={i} sel={selI === i} total={pl.length}
                      onSel={() => setSelI(i)}
                      onPlay={() => { setPIdx(i); setPlay(true); }}
                      onEdit={() => { setEdit(item); setModal(true); }}
                      onDel={() => delItem(item.id)}
                      onUp={() => move(i, -1)}
                      onDn={() => move(i, 1)}/>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "11px 20px", borderBottom: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: T.muted, fontSize: 10, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.08em" }}>Pré-visualização</span>
              {selected && (
                <button className="pl-btn pri" style={{ padding: "6px 14px", fontSize: 11,
                  gap: 6, display: "flex", alignItems: "center" }}
                  onClick={() => { setPIdx(selI); setPlay(true); }}>
                  <span>▶</span> Play daqui
                </button>
              )}
            </div>
            <div style={{ flex: 1, padding: "18px 22px",
              display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
              <Preview item={selected}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
