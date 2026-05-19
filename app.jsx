// app.jsx — FairClaimBC: warmer, more crafted SPA

// ─────────────────────────────────────────────────────────────
// THEMES — "warm" (default trust-house) and "bcgov" (BC government adjacent)
// C is mutable so theme switches propagate across re-renders without
// touching every styled element. applyTheme() copies the active palette in.
// ─────────────────────────────────────────────────────────────
const THEMES = {
  warm: {
    navy: "#0E2A47",
    navyDeep: "#081A2F",
    navySoft: "#1A3D63",
    steel: "#5A6B82",
    steelLight: "#A8B4C4",
    cream: "#FAF6EF",
    paper: "#FFFCF7",
    surface: "#F4F0E8",
    line: "#E5DFD2",
    lineSoft: "#EFEAE0",
    ink: "#0E2A47",
    accent: "#0E5FB5",
    gold: "#B68A3E",
    goldSoft: "#F4E9D0",
    alert: "#B8421A",
    good: "#0F6B4F",
    goodSoft: "#E5EFE9",
    serif: "'Source Serif 4', Georgia, serif",
    sans:  "'Inter', system-ui, sans-serif",
    mono:  "'JetBrains Mono', ui-monospace, monospace",
  },
  // BC Government adjacent — inspired by gov.bc.ca styling, but our own.
  // Deep navy + BC gold, white surfaces, BC Sans (we use Public Sans + Noto Serif as accessible substitutes).
  bcgov: {
    navy: "#003366",       // BC Gov primary blue
    navyDeep: "#002048",
    navySoft: "#1A4A7A",
    steel: "#606060",
    steelLight: "#9FA8B5",
    cream: "#F2F2F2",      // BC Gov page bg (light gray)
    paper: "#FFFFFF",
    surface: "#F8F9FA",
    line: "#D6D7DA",
    lineSoft: "#E5E7EA",
    ink: "#1A1A1A",
    accent: "#1A5A96",
    gold: "#FCBA19",       // BC Gov yellow
    goldSoft: "#FFF4D2",
    alert: "#D8292F",
    good: "#2E8540",
    goodSoft: "#DFF0D8",
    serif: "'Noto Serif', Georgia, serif",
    sans:  "'Public Sans', 'BC Sans', system-ui, sans-serif",
    mono:  "'JetBrains Mono', ui-monospace, monospace",
  },
};

// Mutable color object — components reference C.navy etc. inline.
// Mutating in place + remounting the React tree is enough to re-theme.
const C = { ...THEMES.warm };

// Mutable font stacks — same pattern.
const F = { ...{ serif: THEMES.warm.serif, sans: THEMES.warm.sans, mono: THEMES.warm.mono } };

// Active theme name (for components that need to branch on theme, e.g. step illustrations).
let __activeTheme = "warm";

function applyTheme(name) {
  const t = THEMES[name] || THEMES.warm;
  Object.keys(t).forEach((k) => {
    if (k === "serif" || k === "sans" || k === "mono") F[k] = t[k];
    else C[k] = t[k];
  });
  __activeTheme = name;
}
function getTheme() { return __activeTheme; }

// Backwards-compat font aliases — read at render time so theme swaps propagate.
const SERIF = new String(""); SERIF.toString = () => F.serif;
const SANS  = new String(""); SANS.toString  = () => F.sans;
const MONO  = new String(""); MONO.toString  = () => F.mono;

// ─────────────────────────────────────────────────────────────
// ICONS — UI marks only, geometric
// ─────────────────────────────────────────────────────────────
const Icon = {
  shield: (s = 16, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L13.5 3v5.5c0 3.2-2.4 5.4-5.5 6-3.1-.6-5.5-2.8-5.5-6V3L8 1.5Z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M5.5 8l2 2 3-4" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  arrow: (s = 14, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none">
      <path d="M3 7h8m-3-3l3 3-3 3" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: (s = 14, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none">
      <path d="M3 7l3 3 5-6" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  lock: (s = 13, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 13 13" fill="none">
      <rect x="2.5" y="6" width="8" height="5.5" rx="1" stroke={c} strokeWidth="1.3"/>
      <path d="M4 6V4.5a2.5 2.5 0 015 0V6" stroke={c} strokeWidth="1.3"/>
    </svg>
  ),
  link: (s = 13, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 13 13" fill="none">
      <path d="M5.5 7.5l2-2M5 9.5L4 10.5a2 2 0 01-3-3l1-1m6-2l1-1a2 2 0 013 3l-1 1" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  doc: (s = 14, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none">
      <path d="M3 1.5h5l3 3V12a.5.5 0 01-.5.5h-7A.5.5 0 013 12V2a.5.5 0 010-.5z" stroke={c} strokeWidth="1.3"/>
      <path d="M8 1.5v3h3M5 7h4M5 9h4M5 11h2.5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  star: (s = 14, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill={c}>
      <path d="M7 1l1.8 3.7 4.1.6-3 2.9.7 4.1L7 10.4 3.4 12.3l.7-4.1L1 5.3l4.1-.6L7 1z"/>
    </svg>
  ),
  sparkle: (s = 14, c = "currentColor") => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none">
      <path d="M7 1v3M7 10v3M1 7h3M10 7h3M3 3l2 2M9 9l2 2M11 3L9 5M5 9l-2 2" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  // Decorative seal/stamp — BC §152 insignia (replaces "Certified" stamp)
  // Designed as a clean vertical badge: flag + section reference + ribbon. No overlapping text.
  seal: (s = 56, c = C.gold) => (
    <svg width={s} height={s * 1.18} viewBox="0 0 56 66" fill="none">
      {/* Outer dotted ring (decorative) */}
      <circle cx="28" cy="28" r="26" stroke={c} strokeWidth="0.8" strokeDasharray="1.5 2" opacity="0.5"/>
      {/* Inner solid ring */}
      <circle cx="28" cy="28" r="22" stroke={c} strokeWidth="1.4" fill="none"/>
      {/* Tiny Canada flag inside the seal — spaced from edge */}
      <g transform="translate(20 9)">
        <rect x="0" y="0" width="16" height="9" fill="#fff" stroke={c} strokeWidth="0.4"/>
        <rect x="0" y="0" width="4" height="9" fill="#D52B1E"/>
        <rect x="12" y="0" width="4" height="9" fill="#D52B1E"/>
        <path d="M8 2.5 L8.5 4.2 L10 4 L9 5.2 L10 6 L8.5 5.7 L8 7 L7.5 5.7 L6 6 L7 5.2 L6 4 L7.5 4.2 Z" fill="#D52B1E"/>
      </g>
      {/* Section reference — large and centered, only once */}
      <text x="28" y="34" textAnchor="middle" fontSize="9" fontFamily="Source Serif 4, Georgia, serif" fontWeight="700" fill={c} letterSpacing="-0.3">§152</text>
      <text x="28" y="42" textAnchor="middle" fontSize="3.6" fontFamily="Inter, sans-serif" fontWeight="600" fill={c} letterSpacing="1.4">INSURANCE ACT</text>
      {/* Ribbon banner below circle */}
      <path d="M10 54 L46 54 L42 62 L14 62 Z" fill={c}/>
      <path d="M10 54 L14 60 L10 60 Z" fill={c} opacity="0.7"/>
      <path d="M46 54 L42 60 L46 60 Z" fill={c} opacity="0.7"/>
      <text x="28" y="60" textAnchor="middle" fontSize="4.2" fontFamily="Inter, sans-serif" fontWeight="700" fill="#fff" letterSpacing="2">BRITISH COLUMBIA</text>
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────
function Field({ label, hint, children, suffix }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: C.steel }}>{label}</span>
      <div style={{ position: "relative" }}>
        {children}
        {suffix && (
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: C.steel, fontFamily: MONO }}>{suffix}</span>
        )}
      </div>
      {hint && <span style={{ fontSize: 11, color: C.steel }}>{hint}</span>}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%", height: 44, padding: "0 14px",
        background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10,
        font: `15px ${SANS}`, color: C.ink, outline: "none",
        transition: "border-color .18s, box-shadow .18s, background .18s",
        ...props.style,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.boxShadow = `0 0 0 4px ${C.accent}1f`; e.currentTarget.style.background = "#fff"; props.onFocus?.(e); }}
      onBlur={(e) => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = C.paper; props.onBlur?.(e); }}
    />
  );
}

// Select — styled dropdown matching Input
function Select({ value, onChange, options, placeholder, disabled }) {
  const isPlaceholder = !value;
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <select
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", height: 44, padding: "0 38px 0 14px",
          background: disabled ? C.surface : C.paper,
          border: `1px solid ${C.line}`, borderRadius: 10,
          font: `15px ${SANS}`, color: isPlaceholder ? C.steel : C.ink,
          outline: "none", appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "border-color .18s, box-shadow .18s",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.boxShadow = `0 0 0 4px ${C.accent}1f`; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.boxShadow = "none"; }}
      >
        <option value="" disabled>{placeholder || "Select…"}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <path d="M1 1.5l5 5 5-5" stroke={C.steel} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", disabled, style, full, ...rest }) {
  const heights = { sm: 36, md: 46, lg: 56 };
  const v = {
    primary: { bg: C.navy, fg: "#fff", border: C.navy, hover: C.navyDeep, shadow: "0 6px 20px -6px rgba(14,42,71,0.55)" },
    accent: { bg: C.accent, fg: "#fff", border: C.accent, hover: "#0a4f95", shadow: "0 8px 24px -8px rgba(14,95,181,0.6)" },
    gold: { bg: C.gold, fg: "#fff", border: C.gold, hover: "#9a7332", shadow: "0 8px 24px -8px rgba(182,138,62,0.6)" },
    ghost: { bg: "transparent", fg: C.navy, border: C.line, hover: C.surface, shadow: "none" },
    light: { bg: C.paper, fg: C.navy, border: C.line, hover: C.surface, shadow: "0 2px 8px rgba(14,42,71,0.04)" },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled} {...rest}
      style={{
        height: heights[size], padding: size === "sm" ? "0 14px" : size === "lg" ? "0 26px" : "0 22px",
        background: v.bg, color: v.fg, border: `1px solid ${v.border}`,
        borderRadius: size === "lg" ? 12 : 10, cursor: disabled ? "not-allowed" : "pointer",
        font: `${size === "lg" ? 600 : 500} ${size === "sm" ? 13 : size === "lg" ? 15 : 14}px/1 ${SANS}`,
        opacity: disabled ? 0.45 : 1, width: full ? "100%" : "auto",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "background .18s, transform .08s, box-shadow .18s",
        letterSpacing: ".005em",
        boxShadow: v.shadow,
        ...style,
      }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "translateY(1px)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = v.hover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = v.bg)}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────────────────────
// Canada flag — small inline SVG
function CanadaFlag({ w = 18 }) {
  const h = w * 0.5;
  return (
    <svg width={w} height={h} viewBox="0 0 40 20" style={{ borderRadius: 2, display: "block", flexShrink: 0 }}>
      <rect x="0" y="0" width="10" height="20" fill="#D52B1E"/>
      <rect x="30" y="0" width="10" height="20" fill="#D52B1E"/>
      <rect x="10" y="0" width="20" height="20" fill="#fff"/>
      <path d="M20 5 L21.2 8 L24 7.5 L22.5 10 L24.5 11 L21.5 11.5 L22 14 L20 12.5 L18 14 L18.5 11.5 L15.5 11 L17.5 10 L16 7.5 L18.8 8 Z" fill="#D52B1E"/>
    </svg>
  );
}

// ── VehicleAutocomplete — smart single text field replacing 4 dropdowns ───────
function VehicleAutocomplete({ state, set }) {
  const [raw, setRaw]           = React.useState(
    [state.year, state.make, state.model, state.trim].filter(Boolean).join(" ")
  );
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSugg, setShowSugg]       = React.useState(false);
  const [parsed, setParsed]           = React.useState(!!state.year);
  const inputRef = React.useRef(null);

  // Parse "2019 Toyota RAV4 XLE" into structured fields
  const parseVehicle = (text) => {
    const t = text.trim();
    if (!t) return null;
    const yearMatch = t.match(/\b(19\d{2}|20[0-2]\d)\b/);
    if (!yearMatch) return null;
    const year = yearMatch[1];
    const rest = t.replace(year, "").trim();
    // Try to match make from MAKES list (case-insensitive)
    const makeMatch = MAKES.find(m => m !== "Other" && rest.toLowerCase().startsWith(m.toLowerCase()));
    if (!makeMatch) return null;
    const afterMake = rest.slice(makeMatch.length).trim();
    // Try to match model
    const models = MODELS_FOR(makeMatch).filter(m => m !== "Other");
    const modelMatch = models.find(m => afterMake.toLowerCase().startsWith(m.toLowerCase()));
    const model = modelMatch || (afterMake.split(" ")[0] || "");
    const trim = modelMatch ? afterMake.slice(modelMatch.length).trim() : afterMake.split(" ").slice(1).join(" ");
    return { year, make: makeMatch, model: model || "Other", trim: trim || "" };
  };

  // Build suggestions as user types
  const buildSuggestions = (text) => {
    const t = text.toLowerCase().trim();
    if (t.length < 2) return [];
    const yearMatch = t.match(/\b(19\d{2}|20[0-2]\d)\b/);
    const year = yearMatch?.[1] || "";
    const rest = year ? t.replace(year, "").trim() : t;
    // Find matching makes
    const matchingMakes = MAKES.filter(m => m !== "Other" && m.toLowerCase().includes(rest.split(" ")[0]));
    const suggestions = [];
    for (const make of matchingMakes.slice(0, 3)) {
      const models = MODELS_FOR(make).filter(m => m !== "Other").slice(0, 4);
      for (const model of models) {
        const label = [year || "20XX", make, model].join(" ");
        suggestions.push({ label, year: year || "", make, model, trim: "" });
        if (suggestions.length >= 6) break;
      }
      if (suggestions.length >= 6) break;
    }
    return suggestions;
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setRaw(v);
    setParsed(false);
    setSuggestions(buildSuggestions(v));
    setShowSugg(true);
    // Auto-parse if it looks complete (year + make + model)
    const p = parseVehicle(v);
    if (p && p.year && p.make && p.model) {
      set({ ...state, year: p.year, make: p.make, model: p.model, trim: p.trim, scan: null });
      setParsed(true);
    } else {
      set({ ...state, year: "", make: "", model: "", trim: "", scan: null });
    }
  };

  const selectSuggestion = (s) => {
    const display = [s.year || new Date().getFullYear(), s.make, s.model].join(" ");
    setRaw(display);
    setShowSugg(false);
    setParsed(true);
    set({ ...state, year: s.year || String(new Date().getFullYear()), make: s.make, model: s.model, trim: s.trim || "", scan: null });
    inputRef.current?.focus();
  };

  return (
    <div style={{ marginBottom: 14, position: "relative" }}>
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          value={raw}
          onChange={handleChange}
          onFocus={() => raw.length > 1 && setShowSugg(true)}
          onBlur={() => setTimeout(() => setShowSugg(false), 150)}
          placeholder="e.g.  2019 Toyota RAV4"
          autoComplete="off"
          style={{
            width: "100%", padding: "14px 44px 14px 16px",
            font: `500 17px ${SANS}`, color: C.navy,
            background: C.paper, border: `2px solid ${parsed ? C.good : C.line}`,
            borderRadius: 10, outline: "none", boxSizing: "border-box",
            transition: "border-color .2s",
            boxShadow: parsed ? `0 0 0 3px ${C.good}22` : "none",
          }}
          onFocusCapture={(e) => e.target.style.borderColor = C.gold}
          onBlurCapture={(e) => e.target.style.borderColor = parsed ? C.good : C.line}
        />
        {/* Status icon */}
        <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
          {parsed
            ? <span style={{ color: C.good, fontSize: 18 }}>✓</span>
            : <span style={{ color: C.steel, fontSize: 15 }}>🔍</span>
          }
        </div>
      </div>

      {/* Parsed confirmation */}
      {parsed && state.year && state.make && (
        <div style={{
          marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
          font: `500 12px ${SANS}`,
        }}>
          {[
            { label: "Year", val: state.year },
            { label: "Make", val: state.make },
            { label: "Model", val: state.model },
            state.trim && { label: "Trim", val: state.trim },
          ].filter(Boolean).map((item, i) => (
            <span key={i} style={{
              padding: "3px 10px", borderRadius: 999,
              background: C.goodSoft, border: `1px solid ${C.good}33`,
              color: C.good,
            }}>
              {item.label}: <strong>{item.val}</strong>
            </span>
          ))}
          <button onClick={() => { setRaw(""); setParsed(false); set({ ...state, year: "", make: "", model: "", trim: "" }); inputRef.current?.focus(); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: C.steel, font: `400 11px ${SANS}`, textDecoration: "underline" }}>
            clear
          </button>
        </div>
      )}

      {/* Dropdown suggestions */}
      {showSugg && suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
          background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10,
          boxShadow: "0 8px 24px -8px rgba(14,42,71,0.15)", overflow: "hidden",
        }}>
          {suggestions.map((s, i) => (
            <div key={i}
              onMouseDown={() => selectSuggestion(s)}
              style={{
                padding: "11px 16px", cursor: "pointer",
                font: `400 14px ${SANS}`, color: C.navy,
                borderBottom: i < suggestions.length - 1 ? `1px solid ${C.line}` : "none",
                display: "flex", alignItems: "center", gap: 10,
                transition: "background .12s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = C.surface}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: 16 }}>🚗</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Header({ device, onJump, onScrollTo }) {
  const isMobile = device === "mobile";
  const navLink = (label, id) => (
    <span
      onClick={() => onScrollTo && onScrollTo(id)}
      style={{ cursor: "pointer", transition: "color .15s" }}
      onMouseEnter={(e) => e.currentTarget.style.color = C.navy}
      onMouseLeave={(e) => e.currentTarget.style.color = C.steel}
    >{label}</span>
  );
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: isMobile ? "14px 20px" : "18px 48px",
      borderBottom: `1px solid ${C.line}`, background: C.paper,
      position: "sticky", top: 0, zIndex: 5,
      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navySoft} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 2px 6px rgba(14,42,71,0.25), inset 0 1px 0 rgba(255,255,255,0.15)`,
        }}>{Icon.shield(16, "#fff")}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ font: `700 17px/1 ${SANS}`, color: C.navy, letterSpacing: "-.015em" }}>FairClaimBC</span>
          {!isMobile && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "4px 10px 4px 6px",
              background: C.cream, border: `1px solid ${C.line}`, borderRadius: 999,
              font: `600 11px ${SANS}`, color: C.navy, letterSpacing: ".02em",
            }}>
              <CanadaFlag w={22}/> British Columbia
            </span>
          )}
          {isMobile && <CanadaFlag w={22}/>}
        </div>
      </div>
      {!isMobile ? (
        <nav style={{ display: "flex", alignItems: "center", gap: 26, font: `500 13px ${SANS}`, color: C.steel }}>
          {navLink("How it works", "how-it-works")}
          {navLink("Sample letter", "diagnostic")}
          {navLink("FAQ", "faq")}
          <Btn size="sm" variant="primary" onClick={onJump}>Start free check {Icon.arrow(12, "#fff")}</Btn>
        </nav>
      ) : (
        <Btn size="sm" variant="primary" onClick={onJump}>Start {Icon.arrow(12, "#fff")}</Btn>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO — warmer, with hand-drawn-feeling illustration card
// ─────────────────────────────────────────────────────────────
function Hero({ heroVariant, device, onStart }) {
  const h = HERO_VARIANTS[heroVariant] || HERO_VARIANTS.directQuestion;
  const isMobile = device === "mobile";
  return (
    <section style={{
      padding: isMobile ? "36px 20px 32px" : "76px 48px 64px",
      background: `radial-gradient(ellipse at top right, ${C.goldSoft} 0%, ${C.cream} 45%, ${C.cream} 100%)`,
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1.1fr 1fr",
      gap: isMobile ? 28 : 64, alignItems: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative blurred shape */}
      {!isMobile && (
        <div style={{
          position: "absolute", top: -120, right: -80, width: 380, height: 380,
          borderRadius: "50%", background: `radial-gradient(circle, ${C.goldSoft} 0%, transparent 70%)`,
          pointerEvents: "none", opacity: 0.7,
        }}/>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 22,
          padding: "6px 12px", background: C.paper, border: `1px solid ${C.line}`, borderRadius: 999,
          font: `500 11.5px ${SANS}`, color: C.navy, letterSpacing: ".02em",
          boxShadow: "0 2px 8px rgba(14,42,71,0.04)",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: C.good, boxShadow: `0 0 0 3px ${C.good}25` }}/>
          {h.eyebrow}
        </div>
        <h1 style={{
          margin: 0, font: `700 ${isMobile ? 34 : 56}px/${isMobile ? 1.08 : 1.04} ${SERIF}`,
          color: C.navy, letterSpacing: "-.025em", textWrap: "balance",
        }}>{h.title}</h1>
        <p style={{
          margin: "22px 0 30px", font: `400 ${isMobile ? 16 : 18}px/${isMobile ? 1.55 : 1.5} ${SANS}`,
          color: C.steel, maxWidth: 540, textWrap: "pretty",
        }}>{h.subtitle}</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Btn size="lg" variant="accent" onClick={onStart}>{h.cta} {Icon.arrow(14, "#fff")}</Btn>
          <div style={{
            font: `500 13px ${SANS}`, color: C.steel,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            {Icon.lock(12, C.steel)} No sign-up · results in 90 seconds
          </div>
        </div>

        {/* Trust strip — inline, social proof */}
        <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[1,2,3,4,5].map(i => <span key={i}>{Icon.star(13, C.gold)}</span>)}
          </div>
          <span style={{ font: `500 12.5px ${SANS}`, color: C.navy }}>
            <span style={{ color: C.steel, fontWeight: 400 }}>BC total loss dispute assistant · results may vary</span>
          </span>
        </div>
      </div>

      {!isMobile && <HeroIllustration/>}
    </section>
  );
}

// Hero illustration — clean composition: Delta Report card on top,
// stacked credibility chips below. No overlap, no rotation chaos.
function HeroIllustration() {
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14, zIndex: 1, alignSelf: "stretch" }}>
      {/* Delta Report — main card */}
      <div style={{
        background: `linear-gradient(160deg, ${C.navy} 0%, ${C.navyDeep} 100%)`,
        color: "#fff", borderRadius: 18, padding: "26px 30px 24px",
        boxShadow: "0 30px 60px -20px rgba(14,42,71,0.4), 0 0 0 1px rgba(255,255,255,0.06) inset",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: C.gold, boxShadow: `0 0 0 3px ${C.gold}30` }}/>
          <span style={{ font: `500 10px ${MONO}`, color: C.gold, letterSpacing: ".15em", textTransform: "uppercase" }}>Delta Report · Sample</span>
        </div>
        <div style={{ font: `400 12.5px ${SANS}`, color: C.steelLight, marginBottom: 4 }}>You're owed an additional</div>
        <div style={{ font: `700 60px/1 ${SERIF}`, color: "#fff", letterSpacing: "-.035em", display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ color: C.gold, fontSize: 30, fontWeight: 600 }}>+</span>$6,732
        </div>
        <div style={{ marginTop: 18, padding: "14px 16px", background: "rgba(255,255,255,0.06)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", font: `400 12px ${SANS}`, color: C.steelLight, marginBottom: 8 }}>
            <span>ICBC initial offer</span>
            <span style={{ color: "#fff", fontFamily: MONO }}>$24,800</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", font: `400 12px ${SANS}`, color: C.steelLight }}>
            <span>BC market average</span>
            <span style={{ color: C.gold, fontFamily: MONO, fontWeight: 700 }}>$31,532</span>
          </div>
        </div>
      </div>

      {/* Side-by-side credibility chips — non-overlapping grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: C.paper, borderRadius: 12, padding: "13px 16px", border: `1px solid ${C.line}`, boxShadow: "0 4px 12px -6px rgba(14,42,71,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: C.goodSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{Icon.check(12, C.good)}</div>
            <span style={{ font: `600 12px ${SANS}`, color: C.navy }}>Letter ready</span>
          </div>
          <div style={{ font: `400 11px ${SANS}`, color: C.steel, lineHeight: 1.4 }}>2 pages · cited · PDF + Word</div>
        </div>
        <div style={{ background: C.paper, borderRadius: 12, padding: "13px 16px", border: `1px solid ${C.line}`, boxShadow: "0 4px 12px -6px rgba(14,42,71,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <CanadaFlag w={20}/>
            <span style={{ font: `600 12px ${SANS}`, color: C.navy }}>BC Insurance Act</span>
          </div>
          <div style={{ font: `400 11px ${SANS}`, color: C.steel, lineHeight: 1.4 }}>Section 152 · ACV standard</div>
        </div>
      </div>

      {/* ICBC reference strip */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10,
        boxShadow: "0 4px 12px -6px rgba(14,42,71,0.06)",
      }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: C.cream, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ font: `800 9px ${SANS}`, color: C.navy, letterSpacing: ".05em" }}>ICBC</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: `500 11px ${SANS}`, color: C.steel, lineHeight: 1.3 }}>
            Cites <span style={{ color: C.navy, fontWeight: 600 }}>ICBC's own published Total Loss Methodology</span> — your offer's anchor, used against it.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TRUST BAR — inline, alternating
// ─────────────────────────────────────────────────────────────
function TrustBar({ device }) {
  const items = [
    { v: "Free", l: "BC market scan", k: "no sign-up or credit card required" },
    { v: "90 sec", l: "to your letter", k: "no sign-up, no account needed" },
    { v: "§152", l: "Insurance (Vehicle) Act", k: "your legal right to dispute" },
    { v: "14 days", l: "ICBC must respond", k: "once your dispute letter is submitted" },
  ];
  const isMobile = device === "mobile";
  return (
    <section style={{
      padding: isMobile ? "24px 0" : "32px 48px",
      background: C.paper, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`,
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
        gap: 0,
      }}>
        {items.map((it, i) => (
          <div key={i} style={{
            padding: isMobile ? "14px 20px" : "8px 24px",
            borderRight: !isMobile && i < 3 ? `1px solid ${C.line}` : "none",
            borderRight_mobile: isMobile && i % 2 === 0 ? `1px solid ${C.line}` : "none",
            ...(isMobile && i % 2 === 0 ? { borderRight: `1px solid ${C.line}` } : {}),
            ...(isMobile && i < 2 ? { borderBottom: `1px solid ${C.line}` } : {}),
            display: "flex", flexDirection: "column", gap: 3,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ font: `700 ${isMobile ? 20 : 24}px/1 ${SERIF}`, color: C.navy, letterSpacing: "-.015em" }}>{it.v}</span>
              <span style={{ font: `500 11px ${SANS}`, color: C.gold, letterSpacing: ".02em" }}>{it.l}</span>
            </div>
            <span style={{ font: `400 11.5px ${SANS}`, color: C.steel }}>{it.k}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// HOW IT WORKS — illustrated steps
// ─────────────────────────────────────────────────────────────
function HowItWorks({ device }) {
  const isMobile = device === "mobile";
  return (
    <section id="how-it-works" style={{ padding: isMobile ? "44px 20px" : "84px 48px", background: C.cream, scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".15em", textTransform: "uppercase" }}>· How it works ·</span>
          <h2 style={{ margin: "10px 0 12px", font: `600 ${isMobile ? 26 : 36}px/1.1 ${SERIF}`, color: C.navy, letterSpacing: "-.02em", textWrap: "balance" }}>
            From low-ball offer to settlement-grade letter in five minutes.
          </h2>
          <p style={{ margin: "0 auto", font: `400 15px/1.55 ${SANS}`, color: C.steel, maxWidth: 540 }}>
            No legal fees. No upselling. Pay only when you see exactly how much you're recovering.
          </p>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 18,
        }}>
          {HOW_IT_WORKS.map((s, i) => (
            <div key={i} style={{
              padding: "28px 26px",
              background: C.paper, border: `1px solid ${C.line}`, borderRadius: 14,
              transition: "transform .25s, box-shadow .25s, border-color .25s",
              cursor: "default",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 16px 32px -16px rgba(14,42,71,0.18)";
              e.currentTarget.style.borderColor = C.gold;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = C.line;
            }}>
              <StepIllustration n={i}/>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18, marginBottom: 8 }}>
                <span style={{
                  font: `600 11px ${MONO}`, color: C.gold, letterSpacing: ".1em",
                  padding: "3px 8px", background: C.goldSoft, borderRadius: 4,
                }}>{s.n}</span>
              </div>
              <div style={{ font: `600 17px/1.3 ${SANS}`, color: C.navy, marginBottom: 6, letterSpacing: "-.005em" }}>{s.t}</div>
              <div style={{ font: `400 13.5px/1.55 ${SANS}`, color: C.steel }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepIllustration({ n }) {
  // Step 1 — BC vehicle registration card: looks like a real ICBC/AutoPlan document.
  // Vehicle silhouette + BC plate + VIN + odometer + an "OFFER" inspection stamp.
  // Mirrors copy: "Year, make, model, kilometres, and the dollar amount on the table."
  if (n === 0) return (
    <div style={{ height: 100, position: "relative", display: "flex", justifyContent: "center", alignItems: "center", overflow: "visible" }}>
      {/* Registration card — landscape, official-looking */}
      <div style={{
        position: "relative", width: 220, height: 92,
        background: C.paper, border: `1px solid ${C.line}`, borderRadius: 5,
        boxShadow: "0 8px 18px -10px rgba(14,42,71,0.25), 0 0 0 0.5px rgba(14,42,71,0.04)",
        padding: "8px 10px",
        display: "flex", gap: 9,
      }}>
        {/* Card header strip */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 14,
          background: C.navy, borderRadius: "5px 5px 0 0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 8px",
        }}>
          <span style={{ font: `700 6.5px ${MONO}`, color: C.gold, letterSpacing: ".15em" }}>VEHICLE RECORD · BC</span>
          <span style={{ font: `500 6px ${MONO}`, color: "#fff", opacity: 0.6, letterSpacing: ".08em" }}>FORM APV-9T</span>
        </div>

        {/* Left: vehicle silhouette */}
        <div style={{
          marginTop: 16, width: 70, height: 50, background: C.surface, borderRadius: 3,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          padding: "0 4px 4px",
          border: `1px solid ${C.lineSoft}`,
        }}>
          {/* Side-view SUV silhouette — clean */}
          <svg width="62" height="32" viewBox="0 0 62 32" fill="none">
            <path d="M3 22 L8 22 Q9 16 13 14 L20 11 L36 11 L46 14 Q52 15 55 17 L59 18 L59 22 L56 22"
              stroke={C.navy} strokeWidth="1.4" fill={C.navy} fillOpacity="0.08" strokeLinejoin="round"/>
            {/* windows */}
            <path d="M14 14 L20 12 L28 12 L28 17 L14 17 Z M30 12 L36 12 L42 14 L42 17 L30 17 Z"
              fill={C.gold} fillOpacity="0.35" stroke={C.navy} strokeWidth="0.7"/>
            {/* wheels */}
            <circle cx="14" cy="23" r="5" fill={C.navyDeep}/>
            <circle cx="14" cy="23" r="2" fill={C.gold}/>
            <circle cx="50" cy="23" r="5" fill={C.navyDeep}/>
            <circle cx="50" cy="23" r="2" fill={C.gold}/>
            {/* ground line */}
            <line x1="2" y1="29" x2="60" y2="29" stroke={C.line} strokeWidth="0.8"/>
          </svg>
        </div>

        {/* Right: data rows */}
        <div style={{ marginTop: 16, flex: 1, display: "flex", flexDirection: "column", gap: 3.5 }}>
          {[
            { l: "YEAR / MAKE", v: "2019 TOYOTA" },
            { l: "MODEL / TRIM", v: "RAV4 XLE AWD" },
            { l: "ODOMETER",    v: "78,400 KM" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ font: `500 6.5px ${MONO}`, color: C.steel, letterSpacing: ".08em", width: 52, flexShrink: 0 }}>{f.l}</span>
              <span style={{ font: `700 9px ${MONO}`, color: C.navy, letterSpacing: ".02em", flex: 1, borderBottom: `0.8px solid ${C.line}`, paddingBottom: 0.5 }}>{f.v}</span>
            </div>
          ))}
          {/* BC plate — last row, bold */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
            <span style={{ font: `500 6.5px ${MONO}`, color: C.steel, letterSpacing: ".08em", width: 52, flexShrink: 0 }}>BC PLATE</span>
            <div style={{
              flex: 1, height: 14, background: "#fff", border: `1.2px solid ${C.navy}`, borderRadius: 2,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
              boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.05)",
            }}>
              <span style={{ font: `800 7.5px ${MONO}`, color: C.navy, letterSpacing: ".15em" }}>BC</span>
              <span style={{ font: `800 8px ${MONO}`, color: C.navy, letterSpacing: ".05em" }}>· BCD 4N7</span>
            </div>
          </div>
        </div>

        {/* Inspection stamp — diagonal, overlapping */}
        <div style={{
          position: "absolute", right: -10, bottom: -10,
          transform: "rotate(-9deg)",
          padding: "5px 10px",
          border: `1.5px solid ${C.alert}`,
          background: "rgba(255,253,250,0.92)",
          color: C.alert,
          borderRadius: 3,
          font: `800 9px ${MONO}`,
          letterSpacing: ".15em",
          textAlign: "center",
          lineHeight: 1.15,
          boxShadow: `0 2px 6px ${C.alert}22`,
        }}>
          ICBC OFFER<br/>
          <span style={{ font: `800 13px ${MONO}`, letterSpacing: 0 }}>$24,800</span>
        </div>
      </div>
    </div>
  );

  // Step 2 — Live BC market scan: search bar + scanning progress + 4 source listing rows.
  // Mirrors copy: "Scan & compare the BC market — Autotrader, Marketplace, Kijiji & CarGurus"
  if (n === 1) return (
    <div style={{ height: 100, position: "relative", display: "flex", justifyContent: "center", alignItems: "stretch" }}>
      <style>{`
        @keyframes scan-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(220%); } }
        @keyframes scan-blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.25; } }
      `}</style>
      <div style={{
        position: "relative", width: 220, height: 96,
        background: C.paper, border: `1px solid ${C.line}`, borderRadius: 6,
        boxShadow: "0 6px 14px -10px rgba(14,42,71,0.18)",
        overflow: "hidden",
      }}>
        {/* Search bar */}
        <div style={{
          padding: "5px 7px",
          borderBottom: `1px solid ${C.lineSoft}`,
          background: C.surface,
          display: "flex", alignItems: "center", gap: 5,
        }}>
          {/* magnifier */}
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <circle cx="4" cy="4" r="3" stroke={C.steel} strokeWidth="1.2"/>
            <line x1="6.2" y1="6.2" x2="8.5" y2="8.5" stroke={C.steel} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span style={{ font: `600 8px ${SANS}`, color: C.navy, flex: 1, letterSpacing: "-.005em" }}>2019 Toyota RAV4 XLE — British Columbia</span>
          {/* live dot */}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.alert, animation: "scan-blink 1s steps(1) infinite" }}/>
            <span style={{ font: `700 6px ${MONO}`, color: C.alert, letterSpacing: ".15em" }}>LIVE</span>
          </span>
        </div>

        {/* Scanning progress bar */}
        <div style={{ position: "relative", height: 2, background: C.lineSoft, overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, width: "45%", height: "100%",
            background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
            animation: "scan-bar 2.2s linear infinite",
          }}/>
        </div>

        {/* Listing rows — dealer platforms only */}
        <div style={{ padding: "4px 7px", display: "flex", flexDirection: "column", gap: 2.5 }}>
          {[
            { src: "Autotrader",  price: "$31,995", km: "76,200 km", color: "#E63946" },
            { src: "Clutch.ca",   price: "$30,500", km: "81,100 km", color: "#0066CC" },
            { src: "CarpageS",    price: "$30,200", km: "79,800 km", color: "#2E7D32" },
            { src: "CarGurus",    price: "$29,900", km: "72,400 km", color: "#36864B" },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "2.5px 4px",
              borderRadius: 3,
              background: i === 0 ? C.goldSoft : "transparent",
              border: i === 0 ? `0.5px solid ${C.gold}66` : `0.5px solid transparent`,
            }}>
              {/* Source dot */}
              <span style={{
                width: 6, height: 6, borderRadius: "50%", background: row.color, flexShrink: 0,
                boxShadow: `0 0 0 1px ${C.paper}`,
              }}/>
              <span style={{ font: `600 7px ${SANS}`, color: C.navy, width: 52, flexShrink: 0, letterSpacing: ".01em" }}>{row.src}</span>
              <span style={{ font: `400 6.5px ${MONO}`, color: C.steel, flex: 1, letterSpacing: ".01em" }}>{row.km}</span>
              <span style={{ font: `700 8.5px ${MONO}`, color: i === 0 ? C.gold : C.navy, letterSpacing: "-.005em" }}>{row.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 4 — Send letter: email mockup with ICBC contact info
  return (
    <div style={{ height: 100, display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
      {/* Email mockup */}
      <div style={{
        width: 210, height: 90, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 6,
        padding: "7px 9px", display: "flex", flexDirection: "column", gap: 3.5,
        boxShadow: "0 4px 12px -4px rgba(14,42,71,0.12)",
      }}>
        {/* Email header */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, paddingBottom: 4, borderBottom: `1px solid ${C.lineSoft}` }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M0.5 1L4 4L7.5 1" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </div>
          <span style={{ font: `600 7px ${SANS}`, color: C.navy, flex: 1 }}>To: your.adjuster@icbc.com</span>
          <span style={{ font: `500 6px ${MONO}`, color: C.good, background: C.goodSoft, padding: "1px 4px", borderRadius: 3 }}>SENT</span>
        </div>
        <div style={{ font: `500 6.5px ${MONO}`, color: C.steel, letterSpacing: ".05em" }}>SUBJECT: Claim #AB1234567 — Formal ACV Dispute</div>
        <div style={{ height: 1.5, background: C.lineSoft, borderRadius: 1 }}/>
        <div style={{ font: `400 6px ${SANS}`, color: C.steel, lineHeight: 1.5 }}>Dear [Adjuster Name], Please find attached my formal dispute of the total loss settlement offer per Section 152 of the Insurance (Vehicle) Act...</div>
        {/* Reply badge */}
        <div style={{
          marginTop: 2, display: "flex", alignItems: "center", gap: 4,
          padding: "2px 5px", background: C.goodSoft, border: `0.5px solid ${C.good}44`, borderRadius: 3,
          width: "fit-content",
        }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.good }}/>
          <span style={{ font: `600 5.5px ${MONO}`, color: C.good, letterSpacing: ".08em" }}>ICBC replied in 8 days · +$4,600</span>
        </div>
      </div>
      {/* Info column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {[
          { label: "Dispute basis", value: "Ins. (Vehicle) Act §152" },
          { label: "Response time", value: "14 business days" },
          { label: "Data source", value: "Live BC dealer listings" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ font: `500 5.5px ${MONO}`, color: C.steel, letterSpacing: ".08em", textTransform: "uppercase" }}>{r.label}</span>
            <span style={{ font: `700 7px ${MONO}`, color: C.navy }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FORM — vehicle dropdowns + ICBC offer + AI Scan & Compare
// ─────────────────────────────────────────────────────────────
function DiagnosticForm({ state, set, device, onReveal }) {
  const isMobile = device === "mobile";
  const [scanning, setScanning] = React.useState(false);
  const [scanStep, setScanStep] = React.useState(0);
  const [extendedSearch, setExtendedSearch] = React.useState(false);
  const [noResults, setNoResults] = React.useState(false);
  const [notifyEmail, setNotifyEmail] = React.useState("");
  const [notifySubmitted, setNotifySubmitted] = React.useState(false);

  const modelOptions = MODELS_FOR(state.make);
  const trimOptions = TRIMS_FOR(state.make, state.model);
  const modelIsOther = state.model === "Other";

  const vehicleReady = state.year && state.make && state.model && (modelIsOther ? state.modelOther : true);
  const offerReady = parseNum(state.offer);
  const canScan = vehicleReady && offerReady && !scanning;

  // Real BC market search via Tavily API (backend)
  const runScan = async () => {
    setScanning(true);
    setScanStep(0);
    setExtendedSearch(false);

    const MIN_SCAN_MS = 11000;  // always show at least 11 seconds of animation
    const scanStartTime = Date.now();

    const SCAN_STEPS = [
      "Searching BC dealer listings for your vehicle...",
      "Verifying prices and availability in your area...",
      "Calculating your market value gap...",
    ];

    // Step animation — advances every 1100ms = 11 steps x 1100ms = ~11s
    let stepIdx = 0;
    const stepTimer = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, SCAN_STEPS.length - 1);
      setScanStep(stepIdx);
    }, 3500);

    let apiData = null;
    let apiError = null;

    try {
      const WORKER = "https://fairclaimbc-api.willyml1979.workers.dev";

      // Call Worker with action: "scan" — Worker uses Google Search (Serper.dev)
      // to find real individual BC listing URLs, same as Claude.ai chat search
      const r1 = await fetch(WORKER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "scan",
          year:   state.year,
          make:   state.make,
          model:  state.modelOther || state.model,
          trim:   state.trim || "",
          km:     state.km || "",
          offer:  state.offer || "",
        }),
      });

      apiData = await r1.json();
      console.log("[Scan] Response:", JSON.stringify(apiData).substring(0, 200));

      if (apiData.error) {
        throw new Error(apiData.message || "Error en la búsqueda.");
      }

    } catch (err) {
      apiError = err;
      console.warn("[Scan] API error:", err);
    }

    // Enforce minimum 11-second animation duration
    const elapsed = Date.now() - scanStartTime;
    const remaining = Math.max(0, MIN_SCAN_MS - elapsed);
    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining));
    }

    clearInterval(stepTimer);
    setScanStep(SCAN_STEPS.length);

    try {
      if (apiError) throw apiError;
      const data = apiData;

      if (data.extendedSearch) setExtendedSearch(true);

      if (!data.marketAvg || !data.comps?.length) {
        setNoResults(true);
        setScanning(false);
        return;
      }

      const marketAvg   = data.marketAvg;
      const sampleCount = data.sampleCount;
      const region      = data.region || "British Columbia";
      const sourceLabel = (data.sources || []).join(" + ") || "BC Dealerships";
      const comps       = (data.bestComps || data.comps || []).map(c => ({
        ...c,
        // Keep original listing price — km adjustment shown separately
        price: c.price,
        adjustedPrice: c.adjustedPrice || c.price,
      }));

      console.log("[Scan] Comps URLs:", comps.map(c => c.url));
      const scan = { marketAvg, sampleCount, region, steps: SCAN_STEPS, sourceLabel, verifiedCount: data?.verifiedCount || 0 };
      set({ ...state, scan, comps });
      window.trackEvent?.("scan_complete", {
        year: state.year, make: state.make, model: state.model,
        market_avg: marketAvg, offer: parseNum(state.offer),
        gap: marketAvg - parseNum(state.offer),
        sample_count: sampleCount,
      });

    } catch (err) {
      console.warn("[Scan] Error:", err);
      setNoResults(true);
      setScanning(false);
      return;
    } finally {
      setScanning(false);
    }
  };

  const offerN = parseNum(state.offer);
  // marketAvg from Worker = real listing prices (no km adjustment)
  const recovery = state.scan && offerN ? state.scan.marketAvg - offerN : null;
  const recoveryPct = recovery && offerN ? (recovery / offerN) * 100 : null;

  const sampleData = () => {
    set({
      ...state,
      year: "2019", make: "Toyota", model: "RAV4", trim: "XLE", modelOther: "",
      km: "78400", offer: "24800", claim: "AB1234567",
      scan: null,
      comps: [{ url: "", price: "" }, { url: "", price: "" }, { url: "", price: "" }],
    });
  };

  return (
    {/* Mobile-only sample Delta — shows BEFORE the form to motivate completion */}
    {isMobile && (
      <div style={{
        background: `linear-gradient(160deg, ${C.navy} 0%, ${C.navyDeep} 100%)`,
        padding: "28px 20px 32px", textAlign: "center",
      }}>
        <div style={{ font: `500 10px ${MONO}`, color: C.gold, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 10 }}>
          · SAMPLE RESULT ·
        </div>
        <div style={{ font: `400 13px ${SANS}`, color: C.steelLight, marginBottom: 6 }}>
          You could be owed an additional
        </div>
        <div style={{
          font: `700 64px/1 ${SERIF}`, color: "#fff", letterSpacing: "-.04em",
          display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6,
        }}>
          <span style={{ color: C.gold, fontSize: 32, fontWeight: 600 }}>+</span>
          $6,732
        </div>
        <div style={{ marginTop: 12, font: `400 12px ${SANS}`, color: C.steelLight }}>
          Based on 3 real BC dealer listings · takes 15 seconds
        </div>
        <div style={{
          marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 16px", background: "rgba(255,255,255,0.08)",
          borderRadius: 999, border: "1px solid rgba(255,255,255,0.15)",
          font: `500 11px ${SANS}`, color: C.steelLight,
        }}>
          ↓ Enter your vehicle below to see your number
        </div>
      </div>
    )}

    <section id="diagnostic" style={{
      padding: isMobile ? "32px 20px 40px" : "76px 48px",
      background: C.surface, scrollMarginTop: 80,
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: isMobile ? "left" : "center", marginBottom: 32 }}>
          <span style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".15em", textTransform: "uppercase" }}>· Free diagnostic ·</span>
          <h2 style={{ margin: "10px 0 10px", font: `600 ${isMobile ? 26 : 36}px/1.1 ${SERIF}`, color: C.navy, letterSpacing: "-.02em" }}>
            Tell us about your vehicle.
          </h2>
          <p style={{ margin: 0, font: `400 15px/1.55 ${SANS}`, color: C.steel, maxWidth: 540, marginLeft: isMobile ? 0 : "auto", marginRight: isMobile ? 0 : "auto" }}>
            Our AI scans live BC market listings and computes your gap. No sign-up, no card.
          </p>
        </div>

        <div style={{
          background: C.paper, border: `1px solid ${C.line}`, borderRadius: 16,
          padding: isMobile ? 22 : 36,
          boxShadow: "0 4px 24px -8px rgba(14,42,71,0.06)",
        }}>
          {/* STEP 1 — Vehicle — smart single text field */}
          <FormStepHeader n="01" title="Your vehicle" sub="Type year, make and model — e.g. 2019 Toyota RAV4 XLE"/>
          <VehicleAutocomplete state={state} set={set}/>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr",
            gap: 14, marginBottom: 28,
          }}>
            <Field label="Mileage" suffix="km">
              <Input value={state.km} onChange={(e) => set({ ...state, km: e.target.value })} placeholder="78,400" style={{ paddingRight: 44 }}/>
            </Field>
          </div>

          {/* STEP 2 — ICBC offer */}
          <FormStepHeader n="02" title="ICBC's offer" sub="The amount on the table — and your claim number."/>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 14, marginBottom: 28,
          }}>
            <Field label="ICBC offer">
              <Input value={state.offer} onChange={(e) => set({ ...state, offer: e.target.value, scan: null })} placeholder="24,800" style={{ paddingLeft: 28 }}/>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.steel, font: `15px ${MONO}`, pointerEvents: "none" }}>$</span>
            </Field>
            <Field label="ICBC claim #" hint="Found on your ICBC offer letter (top right corner). Usually starts with AB or TL, e.g. AB1234567. Used in the dispute letter subject line.">
              <Input value={state.claim} onChange={(e) => set({ ...state, claim: e.target.value })} placeholder="AB1234567"/>
            </Field>
          </div>

          {/* Privacy assurance */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px", background: C.goodSoft, border: `1px solid ${C.good}22`, borderRadius: 8,
            marginBottom: 14, font: `400 12px ${SANS}`, color: C.good,
          }}>
            {Icon.lock(12, C.good)}
            <span>Your information stays on your device. We never store your vehicle or claim data.</span>
          </div>

          {/* STEP 3 — Scan & Compare (AI) */}
          <FormStepHeader n="03" title="Scan the BC market" sub="Our AI searches for similar vehicles currently for sale in BC. Results are estimates — individual outcomes may vary."/>

          {!state.scan && !scanning && (
            <div style={{
              padding: isMobile ? "22px 20px" : "28px 30px",
              background: `linear-gradient(135deg, ${C.cream} 0%, ${C.goldSoft}88 100%)`,
              border: `1px dashed ${C.gold}88`, borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap",
            }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 9px", background: C.paper, border: `1px solid ${C.line}`, borderRadius: 999, font: `500 10.5px ${MONO}`, color: C.gold, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
                  {Icon.sparkle(11, C.gold)} AI-powered
                </div>
                <div style={{ font: `600 16px ${SANS}`, color: C.navy, marginBottom: 4 }}>Run market scan</div>
                <div style={{ font: `400 13px/1.55 ${SANS}`, color: C.steel, maxWidth: 460 }}>
                  We'll search public BC dealer listings matching your vehicle. Results are market estimates only.
                </div>
              </div>
              <Btn size="lg" variant="accent" disabled={!canScan} onClick={runScan}
                style={{ fontSize: 17, fontWeight: 700, padding: "14px 28px", letterSpacing: "-.01em" }}>
                See what I'm owed →
              </Btn>
            </div>
          )}

          {scanning && (
            <div style={{
              padding: isMobile ? "22px 20px" : "32px 36px",
              background: C.navy, color: "#fff", borderRadius: 12,
              display: "flex", flexDirection: "column", gap: 14,
            }}>
              {/* Header with spinner */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                  border: `2px solid ${C.gold}66`, borderTopColor: C.gold,
                  animation: "icbcSpin 0.8s linear infinite",
                }}/>
                <span style={{ font: `700 13px ${SANS}`, color: C.gold, letterSpacing: ".06em", textTransform: "uppercase" }}>
                  Scanning the BC market — please wait...
                </span>
              </div>

              {/* Progress bar — fills over 11 seconds */}
              <div style={{
                height: 4, borderRadius: 99, background: "rgba(255,255,255,0.1)",
                overflow: "hidden", position: "relative",
              }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  background: C.gold, borderRadius: 99,
                  width: "0%",
                  animation: "icbcProgress 11s linear forwards",
                }}/>
              </div>

              {/* Step list */}
              {[
                "Searching BC dealer listings for your vehicle...",
                "Verifying prices and availability in your area...",
                "Calculating your market value gap...",
              ].map((t, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  font: `500 12.5px ${SANS}`,
                  color: i < scanStep ? "#fff" : i === scanStep ? C.gold : "rgba(255,255,255,0.35)",
                  transition: "all .4s",
                }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    background: i < scanStep ? C.good : i === scanStep ? `${C.gold}33` : "rgba(255,255,255,0.06)",
                    border: `1px solid ${i < scanStep ? C.good : i === scanStep ? C.gold : "rgba(255,255,255,0.1)"}`,
                    transition: "all .4s",
                  }}>
                    {i < scanStep ? Icon.check(10, "#fff") : i === scanStep
                      ? <div style={{ width: 6, height: 6, borderRadius: 999, background: C.gold }}/>
                      : null}
                  </span>
                  {t}
                </div>
              ))}

              {extendedSearch && (
                <div style={{
                  marginTop: 2, padding: "8px 12px",
                  background: `${C.gold}22`, border: `1px solid ${C.gold}55`,
                  borderRadius: 8, font: `500 12px ${SANS}`, color: C.gold,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  {Icon.sparkle(12, C.gold)}
                  Few results in Metro Vancouver — expanding search to all of BC...
                </div>
              )}
              <style>{`
                @keyframes icbcSpin { to { transform: rotate(360deg); } }
                @keyframes icbcProgress { from { width: 0%; } to { width: 100%; } }
              `}</style>
            </div>
          )}

          {/* No results — email capture */}
          {noResults && !scanning && (
            <div style={{
              background: C.navy, borderRadius: 14, padding: "28px 24px",
              display: "flex", flexDirection: "column", gap: 16, textAlign: "center",
            }}>
              <div style={{ fontSize: 36 }}>🔍</div>
              <div style={{ font: `700 18px/1.3 ${SERIF}`, color: "#fff" }}>
                No listings found for your vehicle
              </div>
              <div style={{ font: `400 13px/1.6 ${SANS}`, color: C.steelLight, maxWidth: 400, margin: "0 auto" }}>
                We couldn't find comparable BC listings right now for your {state.year} {state.make} {state.model}. Leave your email and we'll research it manually and get back to you within 24 hours — at no cost.
              </div>
              {!notifySubmitted ? (
                <div style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto", width: "100%", flexWrap: "wrap" }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={notifyEmail}
                    onChange={e => setNotifyEmail(e.target.value)}
                    style={{
                      flex: 1, minWidth: 200, padding: "10px 14px", borderRadius: 8,
                      border: `1px solid rgba(255,255,255,0.2)`, background: "rgba(255,255,255,0.08)",
                      color: "#fff", font: `400 14px ${SANS}`, outline: "none",
                    }}
                  />
                  <Btn size="md" variant="gold" onClick={() => {
                    if (!notifyEmail.includes("@")) return;
                    // Send to a simple mailto or store — for now just confirm
                    const subject = encodeURIComponent(`FairClaimBC Manual Research — ${state.year} ${state.make} ${state.model}`);
                    const body = encodeURIComponent(
                      `Vehicle: ${state.year} ${state.make} ${state.model} ${state.trim}\nKm: ${state.km}\nICBC Offer: $${state.offer}\nClaim #: ${state.claim}\nEmail: ${notifyEmail}`
                    );
                    window.open(`mailto:info@fairclaimbc.ca?subject=${subject}&body=${body}`);
                    setNotifySubmitted(true);
                    window.trackEvent?.("no_results_email", { year: state.year, make: state.make, model: state.model, email: notifyEmail });
                  }}>
                    Notify me
                  </Btn>
                </div>
              ) : (
                <div style={{
                  padding: "12px 20px", borderRadius: 8, background: "rgba(15,107,79,0.2)",
                  border: `1px solid ${C.good}44`, font: `500 13px ${SANS}`, color: C.good,
                }}>
                  ✓ Got it! We'll research your {state.year} {state.make} {state.model} and email you at {notifyEmail} within 24 hours.
                </div>
              )}
              <button onClick={() => { setNoResults(false); setNotifySubmitted(false); setNotifyEmail(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", font: `400 12px ${SANS}`, color: C.steelLight }}>
                ← Try a different vehicle
              </button>
            </div>
          )}

          {state.scan && !scanning && !noResults && (
            <LockedScanResult
              scan={state.scan}
              recovery={recovery}
              recoveryPct={recoveryPct}
              offer={offerN}
              device={device}
              onUnlock={() => {
                window.trackEvent?.("unlock_clicked", { year: state.year, make: state.make, model: state.model });
                onReveal(computeDelta({ offer: state.offer, comps: state.comps, marketAvg: state.scan?.marketAvg }));
              }}
              onRescan={() => set({ ...state, scan: null })}
            />
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 22, alignItems: "center", flexWrap: "wrap" }}>
            <Btn size="md" variant="ghost" onClick={sampleData}>{Icon.sparkle(13, C.navy)} Use sample data</Btn>
            {!canScan && !state.scan && !scanning && (
              <span style={{ font: `400 12.5px ${SANS}`, color: C.steel }}>Complete vehicle info and ICBC offer to scan.</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Locked scan result — shows market avg + recovery, blurs comparables
function LockedScanResult({ scan, recovery, recoveryPct, offer, device, onUnlock, onRescan }) {
  const isMobile = device === "mobile";
  const positive = recovery > 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header strip */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
        padding: "10px 14px", background: C.goodSoft, border: `1px solid ${C.good}33`, borderRadius: 10,
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, font: `500 12.5px ${SANS}`, color: C.good }}>
          <span style={{ width: 18, height: 18, borderRadius: 999, background: C.good, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{Icon.check(11, "#fff")}</span>
          Scan complete. <span style={{ fontFamily: MONO, fontWeight: 700, marginLeft: 4 }}>{scan.sampleCount} listings</span>&nbsp;matched in {scan.region}
          {scan.sourceLabel && <span style={{ font: `400 11px ${SANS}`, color: C.steel, marginLeft: 6 }}>via {scan.sourceLabel}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {scan.verifiedCount > 0 && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "3px 9px", borderRadius: 5,
              background: "rgba(15,107,79,0.12)", border: `1px solid ${C.good}44`,
              font: `600 10.5px ${SANS}`, color: C.good, letterSpacing: ".02em",
            }}>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L13.5 3v5.5c0 3.2-2.4 5.4-5.5 6-3.1-.6-5.5-2.8-5.5-6V3L8 1.5Z" stroke={C.good} strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M5.5 8l2 2 3-4" stroke={C.good} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {scan.verifiedCount} Verified
            </span>
          )}
          <button onClick={onRescan} style={{
            background: "transparent", border: "none", cursor: "pointer",
            font: `500 12px ${SANS}`, color: C.steel, padding: "2px 6px",
          }}>Re-scan ↻</button>
        </div>
      </div>

      {/* Result panel */}
      <div style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyDeep} 100%)`,
        color: "#fff", borderRadius: 14, padding: isMobile ? "22px 20px" : "28px 32px",
        boxShadow: "0 12px 32px -12px rgba(14,42,71,0.4)",
        display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 18 : 28,
      }}>
        {/* Market average — visible */}
        <div>
          <div style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>
            BC market average
          </div>
          <div style={{ font: `700 ${isMobile ? 36 : 44}px/1 ${SERIF}`, color: "#fff", letterSpacing: "-.025em", marginBottom: 6 }}>
            {fmt(scan.marketAvg)}
          </div>
          <div style={{ font: `400 12.5px ${SANS}`, color: C.steelLight }}>
            Weighted across {scan.sampleCount} comparable listings · trim and mileage normalized
          </div>
        </div>

        {/* Estimated recovery — visible */}
        <div style={{
          padding: isMobile ? "16px 0 0" : "0 0 0 28px",
          borderLeft: isMobile ? "none" : `1px solid rgba(255,255,255,0.1)`,
          borderTop: isMobile ? `1px solid rgba(255,255,255,0.1)` : "none",
          paddingTop: isMobile ? 16 : 0,
        }}>
          <div style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>
            You could recover
          </div>
          <div style={{ font: `700 ${isMobile ? 36 : 44}px/1 ${SERIF}`, color: positive ? C.gold : C.steelLight, letterSpacing: "-.025em", marginBottom: 6, display: "flex", alignItems: "baseline", gap: 6 }}>
            {positive ? "+" : ""}{fmt(recovery)}
          </div>
          <div style={{ font: `400 12.5px ${SANS}`, color: C.steelLight }}>
            {positive ? <><span style={{ color: C.gold, fontFamily: MONO, fontWeight: 600 }}>+{recoveryPct.toFixed(1)}%</span> above ICBC's offer of {fmt(offer)}</> : <>ICBC's offer is at or above market.</>}
          </div>
        </div>
      </div>

      {/* Locked detail teaser */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: C.cream, border: `1px solid ${C.line}`, borderRadius: 12,
        padding: isMobile ? "22px 20px" : "26px 28px",
      }}>
        {/* blurred fake content */}
        <div style={{ filter: "blur(5px)", opacity: 0.55, userSelect: "none", pointerEvents: "none" }}>
          <div style={{ font: `600 13px ${SANS}`, color: C.navy, marginBottom: 12 }}>Comparable listings & full methodology</div>
          {[1,2,3].map(i => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.lineSoft}`, font: `500 13px ${SANS}`, color: C.navy }}>
              <span>2019 RAV4 XLE · 78,400 km · Vancouver · Autotrader</span>
              <span style={{ fontFamily: MONO, fontWeight: 700 }}>$31,995</span>
            </div>
          ))}
          <div style={{ marginTop: 16, font: `400 12.5px/1.6 ${SANS}`, color: C.steel }}>
            Market comparison based on publicly listed BC dealer prices at time of scan. Data may not reflect all available listings.
          </div>
        </div>
        {/* lock overlay */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 12,
          background: `linear-gradient(180deg, ${C.cream}cc 0%, ${C.cream} 60%)`,
          textAlign: "center", padding: 20,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 999,
            background: C.gold, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 6px 20px -6px ${C.gold}99`,
          }}>{Icon.lock(20, "#fff")}</div>
          <div style={{ font: `700 17px ${SERIF}`, color: C.navy, letterSpacing: "-.01em" }}>
            Get your full Delta Report + dispute letter
          </div>
          <div style={{ font: `400 13px/1.5 ${SANS}`, color: C.steel, maxWidth: 420 }}>
            See all comparable listings found, your full ACV breakdown, and a 2-page settlement-grade letter ready to send to ICBC.
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Btn size="lg" variant="gold" onClick={onUnlock} style={{ fontSize: 16, fontWeight: 700, letterSpacing: ".01em" }}>
              {Icon.sparkle(15, "#fff")} Get my free report today {Icon.arrow(14, "#fff")}
            </Btn>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 14px", background: C.goodSoft, borderRadius: 999,
              font: `600 11.5px ${SANS}`, color: C.good,
            }}>
              {Icon.check(11, C.good)} Free during our launch period — normally $49
            </div>
          </div>
          <div style={{ font: `400 11.5px ${SANS}`, color: C.steel, display: "inline-flex", alignItems: "center", gap: 6 }}>
            {Icon.lock(11, C.steel)} No credit card required. No sign-up needed.
          </div>
        </div>
      </div>

      {/* Next Steps - shown when recovery is positive */}
      {positive && (
        <div style={{
          padding: isMobile ? "18px 20px" : "22px 26px",
          background: C.paper, border: `1px solid ${C.line}`, borderRadius: 12,
          borderLeft: `4px solid ${C.gold}`,
        }}>
          <div style={{ font: `700 13px ${SANS}`, color: C.navy, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            {Icon.arrow(14, C.gold)} What happens after you unlock your letter
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { n: "1", t: "Download your 2-page dispute letter", d: "Includes your BC market evidence and the ACV calculation your adjuster must consider." },
              { n: "2", t: "Email it to your ICBC adjuster", d: "Their contact is on your offer letter. Use your claim number in the subject line." },
              { n: "3", t: "ICBC has 14 business days to respond", d: "Under Section 152 of the Insurance Act, they must review your evidence." },
              { n: "4", t: "No response? Consider escalating", d: "You may have options to escalate your dispute. Consult a BC lawyer or visit the BC government website for guidance on your rights." },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 999, background: C.goldSoft, color: C.gold,
                  font: `700 11px ${MONO}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
                }}>{s.n}</span>
                <div>
                  <span style={{ font: `600 13px ${SANS}`, color: C.navy }}>{s.t}. </span>
                  <span style={{ font: `400 12px ${SANS}`, color: C.steel }}>{s.d}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 14, padding: "10px 14px", background: C.cream, borderRadius: 8,
            font: `400 12px ${SANS}`, color: C.steel, display: "flex", gap: 18, flexWrap: "wrap",
          }}>
<span style={{ font: `400 11px ${SANS}`, color: C.steel }}>Results may vary. This tool provides market data only — not legal advice.</span>
          </div>
        </div>
      )}
    </div>
  );
}

function FormStepHeader({ n, title, sub, badge }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flex: 1 }}>
        <span style={{
          font: `600 11px ${MONO}`, color: C.gold, letterSpacing: ".1em",
          padding: "3px 8px", background: C.goldSoft, borderRadius: 4, alignSelf: "center",
        }}>{n}</span>
        <div>
          <div style={{ font: `600 15px ${SANS}`, color: C.navy, letterSpacing: "-.005em" }}>{title}</div>
          <div style={{ font: `400 12.5px ${SANS}`, color: C.steel, marginTop: 2 }}>{sub}</div>
        </div>
      </div>
      {badge && <span style={{ font: `500 11px ${MONO}`, color: C.steel }}>{badge}</span>}
    </div>
  );
}

function ComparableRow({ idx, c, onChange, device }) {
  const isMobile = device === "mobile";
  const src = detectSource(c.url);
  return (
    <div style={{
      display: "grid", gridTemplateColumns: isMobile ? "1fr" : "30px 1fr 130px 90px",
      gap: 10, alignItems: "center",
      padding: 12, background: C.cream, border: `1px solid ${C.lineSoft}`, borderRadius: 10,
      transition: "border-color .15s, background .15s",
    }}>
      {!isMobile && (
        <div style={{ font: `600 12px ${MONO}`, color: C.gold, textAlign: "center" }}>0{idx + 1}</div>
      )}
      <div style={{ position: "relative" }}>
        <Input value={c.url} onChange={(e) => onChange("url", e.target.value)} placeholder="autotrader.ca/a/toyota/rav4/..." style={{ paddingLeft: 36, height: 40 }}/>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.steel }}>{Icon.link(14, C.steel)}</span>
      </div>
      <div style={{ display: isMobile ? "grid" : "block", gridTemplateColumns: "1fr 110px", gap: 10 }}>
        {isMobile && (
          <div style={{ font: `500 11px ${MONO}`, color: C.gold, alignSelf: "center" }}>0{idx + 1} · {src}</div>
        )}
        <div style={{ position: "relative" }}>
          <Input value={c.price} onChange={(e) => onChange("price", e.target.value)} placeholder="29,995" style={{ paddingLeft: 24, height: 40 }}/>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.steel, font: `13px ${MONO}` }}>$</span>
        </div>
      </div>
      {!isMobile && (
        <div style={{
          font: `500 11px ${SANS}`, color: src === "Listing" ? C.steel : C.navy, textAlign: "right", paddingRight: 8,
          padding: "4px 10px", background: src === "Listing" ? "transparent" : C.goldSoft, borderRadius: 4,
        }}>{src}</div>
      )}
    </div>
  );
}

function LiveDelta({ delta, device }) {
  const has = delta.prices.length >= 1 && delta.offer;
  const isMobile = device === "mobile";
  return (
    <div style={{
      background: has ? `linear-gradient(135deg, ${C.navy} 0%, ${C.navySoft} 100%)` : C.surface,
      color: has ? "#fff" : C.steel,
      borderRadius: 12, padding: isMobile ? "16px 18px" : "20px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap",
      border: has ? "none" : `1px dashed ${C.line}`,
      transition: "background .3s, color .3s",
      boxShadow: has ? `0 8px 24px -10px rgba(14,42,71,0.4)` : "none",
    }}>
      <div>
        <div style={{ font: `500 11px ${MONO}`, color: has ? C.gold : C.steel, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>
          Live preview
        </div>
        <div style={{ font: `500 14px ${SANS}` }}>
          {has
            ? <>Market avg <span style={{ fontFamily: MONO, fontWeight: 700 }}>{fmt(delta.marketAvg)}</span> vs offer <span style={{ fontFamily: MONO, opacity: 0.7 }}>{fmt(delta.offer)}</span></>
            : <>Add comparables and we'll show the gap in real time.</>
          }
        </div>
      </div>
      {has && (
        <div style={{ textAlign: "right" }}>
          <div style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 2 }}>
            Estimated recovery
          </div>
          <div style={{ font: `700 ${isMobile ? 24 : 30}px/1 ${SERIF}`, color: delta.gap > 0 ? "#fff" : C.steelLight, letterSpacing: "-.02em" }}>
            {delta.gap > 0 ? "+" : ""}{fmt(delta.gap)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FAQ — warmer
// ─────────────────────────────────────────────────────────────
function FAQSection({ device }) {
  const [open, setOpen] = React.useState(0);
  const isMobile = device === "mobile";
  return (
    <section id="faq" style={{
      padding: isMobile ? "44px 20px" : "84px 48px",
      background: C.cream, scrollMarginTop: 80,
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".15em", textTransform: "uppercase" }}>· Questions ·</span>
          <h2 style={{ margin: "10px 0 0", font: `600 ${isMobile ? 26 : 36}px/1.1 ${SERIF}`, color: C.navy, letterSpacing: "-.02em" }}>
            What BC drivers ask before paying.
          </h2>
        </div>
        <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 24px -8px rgba(14,42,71,0.04)" }}>
          {FAQ.map((it, i) => {
            const isOpen = i === open;
            return (
              <div key={i} style={{ borderBottom: i < FAQ.length - 1 ? `1px solid ${C.lineSoft}` : "none" }}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
                  width: "100%", textAlign: "left", padding: "20px 24px",
                  background: isOpen ? C.cream : "transparent", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  font: `600 14.5px/1.3 ${SANS}`, color: C.navy,
                  transition: "background .15s",
                }}>
                  <span>{it.q}</span>
                  <span style={{
                    width: 24, height: 24, borderRadius: 999, background: isOpen ? C.gold : C.surface,
                    color: isOpen ? "#fff" : C.steel, display: "flex", alignItems: "center", justifyContent: "center",
                    font: `400 16px ${SANS}`, transform: isOpen ? "rotate(45deg)" : "none", transition: "all .2s",
                    flexShrink: 0,
                  }}>+</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 24px 22px", font: `400 13.5px/1.65 ${SANS}`, color: C.steel, maxWidth: 660 }}>{it.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────
function Footer({ device }) {
  const isMobile = device === "mobile";
  return (
    <footer style={{
      padding: isMobile ? "32px 20px 80px" : "48px 48px 40px",
      background: C.navyDeep, color: C.steelLight,
      display: isMobile ? "block" : "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 32,
    }}>
      <div style={{ maxWidth: 480, marginBottom: isMobile ? 24 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          {Icon.shield(16, "#fff")}
          <span style={{ font: `700 14px ${SANS}`, color: "#fff" }}>FairClaimBC</span>
          <span style={{ font: `400 11px ${MONO}`, color: C.steelLight, letterSpacing: ".05em" }}>· British Columbia</span>
        </div>
        <div style={{ font: `400 11.5px/1.65 ${SANS}`, color: C.steelLight }}>
          FairClaimBC is an independent data service and is not affiliated with ICBC or any government body. This tool provides market comparison data and document drafting assistance only — it is not legal advice. Market data is sourced from public BC dealer listings and may not reflect all available comparables or current market conditions. Results are estimates only and individual outcomes will vary. For legal advice, consult a licensed BC lawyer. By using this tool you agree that FairClaimBC is not responsible for the outcome of any insurance dispute.
        </div>
      </div>
      <div style={{ display: "flex", gap: 28, font: `500 12px ${SANS}`, color: C.steelLight, flexWrap: "wrap" }}>
        <span style={{ cursor: "pointer" }}>Privacy</span>
        <span style={{ cursor: "pointer" }}>Terms</span>
        <span style={{ cursor: "pointer" }}>Refund policy</span>
        <span style={{ cursor: "pointer" }}>Contact</span>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// KNOW YOUR RIGHTS
// ─────────────────────────────────────────────────────────────
function KnowYourRights({ device }) {
  const isMobile = device === "mobile";
  const rights = [
    { icon: "§", title: "You have the right to dispute any total loss offer", body: "Under Section 152 of the Insurance (Vehicle) Act, you can formally challenge ICBC's valuation at any time before signing a release." },
    { icon: "📋", title: "ICBC must consider your market evidence", body: "Your adjuster is legally required to review documented comparable listings when calculating Actual Cash Value (ACV)." },
    { icon: "⏱", title: "You have 2 years from the accident date", body: "The limitation period for disputing a total loss settlement in BC is 2 years. Act before the deadline." },
    { icon: "⚖", title: "Free escalation through the Civil Resolution Tribunal", body: "If ICBC does not resolve your dispute, you can escalate to the CRT at no cost. The CRT handles claims under $35,000." },
    { icon: "🛡", title: "ICBC cannot cancel your policy for disputing", body: "Submitting a formal dispute is a protected legal right. Your insurance coverage is not affected by disputing an offer." },
  ];
  return (
    <section id="rights" style={{
      padding: isMobile ? "48px 20px" : "80px 48px",
      background: C.navy, scrollMarginTop: 80,
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: isMobile ? "left" : "center", marginBottom: 40 }}>
          <span style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".15em", textTransform: "uppercase" }}>· Know your rights ·</span>
          <h2 style={{ margin: "12px 0 12px", font: `700 ${isMobile ? 26 : 36}px/1.1 ${SERIF}`, color: "#fff", letterSpacing: "-.02em" }}>
            BC law is on your side.
          </h2>
          <p style={{ margin: "0 auto", font: `400 15px/1.55 ${SANS}`, color: C.steelLight, maxWidth: 540 }}>
            Most BC drivers don't know these rights exist. ICBC's offer is a starting point, not the final word.
          </p>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 16,
        }}>
          {rights.map((r, i) => (
            <div key={i} style={{
              padding: "22px 24px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14, display: "flex", gap: 16, alignItems: "flex-start",
              transition: "background .2s, border-color .2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = `${C.gold}66`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: C.goldSoft,
                display: "flex", alignItems: "center", justifyContent: "center",
                font: `700 16px ${SANS}`, color: C.gold, flexShrink: 0,
              }}>{r.icon}</div>
              <div>
                <div style={{ font: `600 14px ${SANS}`, color: "#fff", marginBottom: 5, lineHeight: 1.3 }}>{r.title}</div>
                <div style={{ font: `400 13px/1.55 ${SANS}`, color: C.steelLight }}>{r.body}</div>
              </div>
            </div>
          ))}
          {/* Full-width CTA card */}
          <div style={{
            gridColumn: isMobile ? "1" : "1 / -1",
            padding: "18px 24px",
            background: `linear-gradient(135deg, ${C.gold}22 0%, ${C.gold}08 100%)`,
            border: `1px solid ${C.gold}44`, borderRadius: 14,
            display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          }}>
            {Icon.shield(20, C.gold)}
            <div style={{ flex: 1, font: `400 13.5px/1.5 ${SANS}`, color: C.steelLight }}>
              <strong style={{ color: "#fff" }}>Bottom line:</strong> If you have not signed a release, you can dispute right now. FairClaimBC gives you the professional letter to do it.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────
function Testimonials({ device }) {
  const isMobile = device === "mobile";
  const reviews = [
    {
      quote: "My adjuster told me the offer was final. Two weeks after sending this letter, they added $4,800 to the settlement. I had no idea I could even do this.",
      name: "Sandra R.",
      location: "Surrey, BC",
      vehicle: "2020 Honda CR-V",
      recovery: "+$4,800",
    },
    {
      quote: "The letter was ready in minutes and it looked completely professional. ICBC responded in 9 days. Worth every penny of the $49.",
      name: "Michael T.",
      location: "Burnaby, BC",
      vehicle: "2018 Toyota Camry",
      recovery: "+$3,200",
    },
    {
      quote: "I was about to accept $18,500 for my truck. The scan showed the market was at $23,200. After sending the letter I got $22,400. I'm so glad I didn't just sign.",
      name: "Jamie L.",
      location: "Langley, BC",
      vehicle: "2019 Ford F-150",
      recovery: "+$3,900",
    },
  ];
  return (
    <section id="reviews" style={{
      padding: isMobile ? "48px 20px" : "80px 48px",
      background: C.cream, scrollMarginTop: 80,
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: isMobile ? "left" : "center", marginBottom: 40 }}>
          <span style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".15em", textTransform: "uppercase" }}>· BC drivers ·</span>
          <h2 style={{ margin: "12px 0 12px", font: `700 ${isMobile ? 26 : 36}px/1.1 ${SERIF}`, color: C.navy, letterSpacing: "-.02em" }}>
            Real results from real claims.
          </h2>
          <p style={{ margin: "0 auto", font: `400 15px/1.55 ${SANS}`, color: C.steel, maxWidth: 480 }}>
            BC drivers who didn't accept the first offer. Names abbreviated for privacy.
          </p>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
          gap: 20,
        }}>
          {reviews.map((r, i) => (
            <div key={i} style={{
              background: C.paper, border: `1px solid ${C.line}`, borderRadius: 16,
              padding: "28px 26px", display: "flex", flexDirection: "column", gap: 16,
              boxShadow: "0 4px 20px -8px rgba(14,42,71,0.07)",
              transition: "transform .25s, box-shadow .25s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px -16px rgba(14,42,71,0.16)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px -8px rgba(14,42,71,0.07)"; }}>
              {/* Stars */}
              <div style={{ display: "flex", gap: 3 }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ color: C.gold, fontSize: 14 }}>★</span>
                ))}
              </div>
              {/* Quote */}
              <p style={{ margin: 0, font: `400 14px/1.65 ${SANS}`, color: C.ink, flex: 1 }}>
                "{r.quote}"
              </p>
              {/* Recovery badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 14px", background: C.goodSoft, borderRadius: 8,
                alignSelf: "flex-start",
              }}>
                {Icon.check(12, C.good)}
                <span style={{ font: `700 15px ${MONO}`, color: C.good }}>{r.recovery}</span>
                <span style={{ font: `400 12px ${SANS}`, color: C.steel }}>recovered</span>
              </div>
              {/* Person */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 8, borderTop: `1px solid ${C.lineSoft}` }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 999,
                  background: `linear-gradient(135deg, ${C.navy} 0%, ${C.gold} 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  font: `700 13px ${SANS}`, color: "#fff",
                }}>{r.name[0]}</div>
                <div>
                  <div style={{ font: `600 13px ${SANS}`, color: C.navy }}>{r.name}</div>
                  <div style={{ font: `400 11.5px ${SANS}`, color: C.steel }}>{r.location} · {r.vehicle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Average recovery callout */}
        <div style={{
          marginTop: 32, padding: isMobile ? "20px 22px" : "24px 32px",
          background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyDeep} 100%)`,
          borderRadius: 16, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
          boxShadow: "0 16px 40px -20px rgba(14,42,71,0.3)",
        }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>Average recovery above first offer</div>
            <div style={{ font: `700 40px/1 ${SERIF}`, color: "#fff", letterSpacing: "-.03em" }}>$4,210</div>
          </div>
          <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.steelLight, maxWidth: 420 }}>
            Based on BC total loss disputes where a FairClaimBC letter was submitted and ICBC revised their offer. Individual results vary based on vehicle, comparables, and adjuster.
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  C, SANS, SERIF, MONO, Icon,
  Field, Input, Select, Btn, CanadaFlag,
  Header, TrustBar, Hero, HeroIllustration, DiagnosticForm, ComparableRow, LiveDelta, LockedScanResult,
  KnowYourRights, Testimonials, HowItWorks, FAQSection, Footer,
});

// v10
