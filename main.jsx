// main.jsx — screen state machine + Delta / Checkout / Letter screens + canvas mount

const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────
// DELTA REPORT (Phase 2) — the reveal, warmer
// ─────────────────────────────────────────────────────────────
function DeltaReport({ state, delta, device, onPay, onShowCheckout, onBack, price, paid }) {
  const isMobile = device === "mobile";
  const sorted = [...state.comps].filter(c => parseNum(c.price)).map(c => ({ ...c, price: parseNum(c.price) })).sort((a, b) => b.price - a.price);

  return (
    <div style={{ background: C.cream }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "14px 20px" : "18px 48px", borderBottom: `1px solid ${C.line}`,
        background: C.paper,
      }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "none", cursor: "pointer",
          font: `500 13px ${SANS}`, color: C.steel, display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 10px", borderRadius: 6, transition: "color .15s, background .15s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.color = C.navy; e.currentTarget.style.background = C.surface; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = C.steel; e.currentTarget.style.background = "transparent"; }}>
          ← Edit inputs
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Stepper current={2} device={device}/>
        </div>
      </div>

      {/* Hero — "leaving on the table" */}
      <section style={{
        padding: isMobile ? "40px 20px 48px" : "76px 48px 64px",
        background: `linear-gradient(160deg, ${C.navy} 0%, ${C.navyDeep} 100%)`,
        color: "#fff", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative gold beam */}
        <div style={{
          position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.gold}33 0%, transparent 60%)`,
          pointerEvents: "none",
        }}/>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18,
            padding: "5px 12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 999, font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".1em", textTransform: "uppercase",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: C.gold }}/>
            Your Delta Report
          </div>
          <div style={{ font: `500 13px ${SANS}`, color: C.steelLight, marginBottom: 12 }}>
            For your {state.year} {state.make} {state.model}
          </div>
          {delta.gap < 500 ? (
            /* ── Fair offer — celebrate ── */
            <>
              <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 8 }}>🎉</div>
              <div style={{ font: `700 32px/1.2 ${SERIF}`, color: "#fff", letterSpacing: "-.02em", marginBottom: 16 }}>
                ICBC's offer looks fair!
              </div>
              <div style={{ font: `400 16px/1.6 ${SANS}`, color: C.steelLight, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
                Based on {delta.prices.length} comparable{delta.prices.length !== 1 ? "s" : ""} in BC, your offer is{" "}
                <span style={{ color: "#fff", fontWeight: 600 }}>within $500 of market value</span>.
                {" "}That's a fair settlement — no dispute needed.
              </div>
              <div style={{
                marginTop: 28, display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 20px", borderRadius: 999,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                font: `500 13px ${SANS}`, color: C.steelLight,
              }}>
                ✓ You're in good hands — accept with confidence
              </div>
            </>
          ) : (
            /* ── Real gap — show the money ── */
            <>
              <div style={{ font: `400 16px ${SANS}`, color: C.steelLight, marginBottom: 20 }}>
                {delta.gap > 0 ? "You're leaving on the table" : "ICBC's offer is at or above market"}
              </div>
              <BigNumber n={delta.gap} device={device}/>
              <div style={{ marginTop: 24, font: `400 15px/1.6 ${SANS}`, color: C.steelLight, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
                Your offer is{" "}
                <span style={{ color: "#fff", fontWeight: 700 }}>
                  {Math.abs(delta.gapPct).toFixed(1)}% {delta.gap > 0 ? "below" : "above"}
                </span>{" "}
                the BC market average from your {delta.prices.length} comparable{delta.prices.length !== 1 ? "s" : ""}.
                {delta.gap > 0
                  ? <><br/><span style={{ color: C.gold, fontWeight: 600 }}>You have technical grounds for a successful dispute.</span></>
                  : <><br/><span style={{ color: C.steelLight, fontWeight: 600 }}>We found limited comparables — consider trying a broader trim or year range.</span></>
                }
              </div>
            </>
          )}

          {/* Comparison bars */}
          <div style={{
            maxWidth: 580, margin: "36px auto 0",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14, padding: "22px 26px",
            backdropFilter: "blur(8px)",
          }}>
            <CompareBars offer={delta.offer} marketAvg={delta.marketAvg}/>
          </div>
        </div>
      </section>

      {/* Comparable evidence */}
      <section style={{ padding: isMobile ? "40px 20px" : "72px 48px", background: C.surface }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 22, gap: 12, flexWrap: "wrap" }}>
            <div>
              <span style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".15em", textTransform: "uppercase" }}>· Evidence ·</span>
              <h3 style={{ margin: "8px 0 0", font: `600 ${isMobile ? 22 : 28}px/1.15 ${SERIF}`, color: C.navy, letterSpacing: "-.02em" }}>
                Your comparables — what justifies the gap
              </h3>
            </div>
            <span style={{ font: `500 11px ${MONO}`, color: C.steel, padding: "6px 10px", background: C.paper, borderRadius: 6, border: `1px solid ${C.line}` }}>
              avg: {fmt(delta.marketAvg)}
            </span>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 16,
          }}>
            {sorted.map((c, i) => {
              const diff = c.price - delta.offer;
              const pct = ((c.price - delta.marketAvg) / delta.marketAvg) * 100;
              return (
                <div key={i} style={{
                  background: C.paper, border: `1px solid ${C.line}`, borderRadius: 14,
                  padding: 22, display: "flex", flexDirection: "column", gap: 10,
                  transition: "transform .25s, box-shadow .25s",
                  boxShadow: "0 2px 8px rgba(14,42,71,0.04)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 28px -10px rgba(14,42,71,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(14,42,71,0.04)"; }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, flexWrap: "wrap" }}>
                    <span style={{
                      font: `600 11px ${SANS}`, color: C.navy, letterSpacing: ".05em", textTransform: "uppercase",
                      padding: "3px 8px", background: C.goldSoft, borderRadius: 4,
                    }}>
                      {c.source || detectSource(c.url)}
                    </span>
                    <span style={{
                      font: `600 10px ${MONO}`, color: pct > 0 ? C.good : C.steel,
                      padding: "3px 8px", borderRadius: 4,
                      background: pct > 0 ? C.goodSoft : C.surface,
                    }}>
                      {pct > 0 ? "+" : ""}{pct.toFixed(1)}% vs avg
                    </span>
                  </div>
                  {/* ── Verified Link badge ───────────────────────────────── */}
                  {c.verified === true && (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "4px 10px", borderRadius: 6,
                      background: C.goodSoft, border: `1px solid ${C.good}44`,
                      font: `600 10.5px ${SANS}`, color: C.good, letterSpacing: ".03em",
                      alignSelf: "flex-start",
                    }}>
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1.5L13.5 3v5.5c0 3.2-2.4 5.4-5.5 6-3.1-.6-5.5-2.8-5.5-6V3L8 1.5Z" stroke={C.good} strokeWidth="1.4" strokeLinejoin="round"/>
                        <path d="M5.5 8l2 2 3-4" stroke={C.good} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Verified Link · HTTP 200
                    </div>
                  )}
                  {c.verified === false && (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "4px 10px", borderRadius: 6,
                      background: C.goldSoft, border: `1px solid ${C.gold}55`,
                      font: `500 10.5px ${SANS}`, color: C.gold, letterSpacing: ".02em",
                      alignSelf: "flex-start",
                    }}>
                      ≈ Estimated
                    </div>
                  )}
                  {/* Dealer name — clickable link to listing */}
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" style={{
                      font: `600 13px ${SANS}`, color: C.accent, textDecoration: "none",
                      display: "inline-flex", alignItems: "center", gap: 5, transition: "color .15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = C.navy}
                    onMouseLeave={(e) => e.currentTarget.style.color = C.accent}>
                      {c.dealer || detectSource(c.url)}
                      {Icon.link(11, C.accent)}
                    </a>
                  ) : (
                    <span style={{ font: `600 13px ${SANS}`, color: C.navy }}>
                      {c.dealer || detectSource(c.url)}
                    </span>
                  )}
                  {/* Price (km-adjusted) */}
                  <div style={{ font: `700 30px/1 ${SERIF}`, color: C.navy, letterSpacing: "-.025em", marginTop: 2 }}>{fmt(c.price)}</div>
                  {/* Km badge + adjustment */}
                  {c.km && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{
                        font: `500 11px ${MONO}`, color: C.steel,
                        padding: "2px 7px", background: C.surface, borderRadius: 4, border: `1px solid ${C.line}`,
                      }}>
                        {Number(c.km).toLocaleString("en-CA")} km
                      </span>

                    </div>
                  )}
                  <div style={{
                    font: `600 12px ${SANS}`, color: C.good, marginTop: 6,
                    padding: "6px 10px", background: C.goodSoft, borderRadius: 6,
                    display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start",
                  }}>
                    {Icon.arrow(11, C.good)} +{fmt(diff)} above offer
                  </div>
                  {/* View listing button — always visible at the bottom */}
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" style={{
                      marginTop: 6,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      padding: "9px 14px", borderRadius: 8,
                      background: "transparent",
                      border: `1px solid ${C.line}`,
                      font: `600 12px ${SANS}`, color: C.navy,
                      textDecoration: "none", cursor: "pointer",
                      transition: "background .18s, border-color .18s, color .18s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.navy;
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor = C.navy;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = C.navy;
                      e.currentTarget.style.borderColor = C.line;
                    }}>
                      {Icon.link(12, "currentColor")}
                      Ver veh&iacute;culo en {c.source || detectSource(c.url)}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? "32px 20px 40px" : "64px 48px 84px", background: C.cream }}>
        <div style={{
          maxWidth: 920, margin: "0 auto",
          background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navySoft} 100%)`,
          color: "#fff", borderRadius: 18, padding: isMobile ? "32px 24px" : "44px 52px",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: isMobile ? 28 : 44, alignItems: "center",
          position: "relative", overflow: "hidden",
          boxShadow: "0 24px 60px -20px rgba(14,42,71,0.4)",
        }}>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14 }}>
              · Generate the letter ·
            </div>
            <h3 style={{ margin: "0 0 12px", font: `700 ${isMobile ? 24 : 30}px/1.15 ${SERIF}`, color: "#fff", letterSpacing: "-.02em" }}>
              Recover {fmt(delta.gap)}. Your dispute letter, ready in 90 seconds.
            </h3>
            <p style={{ margin: 0, font: `400 14.5px/1.6 ${SANS}`, color: C.steelLight, maxWidth: 440 }}>
              A 2-page technical letter citing the Insurance (Vehicle) Act §152, your comparables, and a formal request for revised settlement.
            </p>
            <div style={{ display: "flex", gap: 18, marginTop: 18, flexWrap: "wrap" }}>
              <span style={{ font: `500 12.5px ${SANS}`, color: C.steelLight, display: "inline-flex", alignItems: "center", gap: 6 }}>
                {Icon.check(12, C.gold)} PDF + Word
              </span>
              <span style={{ font: `500 12.5px ${SANS}`, color: C.steelLight, display: "inline-flex", alignItems: "center", gap: 6 }}>
                {Icon.check(12, C.gold)} Cited & formatted
              </span>
              <span style={{ font: `500 12.5px ${SANS}`, color: C.steelLight, display: "inline-flex", alignItems: "center", gap: 6 }}>
                {Icon.check(12, C.gold)} Money-back guarantee
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: isMobile ? "stretch" : "flex-end", position: "relative", zIndex: 1 }}>
            {paid ? (
              // Already paid — just show the action button, no price
              <>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "6px 14px", background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999,
                  font: `500 11px ${SANS}`, color: C.gold, letterSpacing: ".08em",
                }}>
                  {Icon.check(11, C.good)} Letter unlocked
                </div>
                <Btn size="lg" variant="gold" onClick={onPay} full={isMobile}
                  style={{ background: C.gold, borderColor: C.gold }}>
                  View my letter {Icon.arrow(14, "#fff")}
                </Btn>
              </>
            ) : (
              // First time — show price and trigger CHECKOUT (never go directly to letter)
              <>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ font: `700 48px/1 ${SERIF}`, color: "#fff", letterSpacing: "-.03em" }}>${price}</span>
                  <span style={{ font: `400 13px ${SANS}`, color: C.steelLight }}>USD · one-time</span>
                </div>
                <Btn size="lg" variant="gold" onClick={onShowCheckout} full={isMobile}
                  style={{ background: C.gold, borderColor: C.gold }}>
                  Generate my letter {Icon.arrow(14, "#fff")}
                </Btn>
                <span style={{ font: `400 11.5px ${SANS}`, color: C.steelLight, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {Icon.lock(11, C.steelLight)} Secured by Stripe
                </span>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// Stepper component — visual progress indicator
function Stepper({ current, device }) {
  const steps = ["Diagnostic", "Delta Report", "Letter"];
  const isMobile = device === "mobile";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {steps.map((s, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 999,
                background: done || active ? C.gold : C.surface,
                color: done || active ? "#fff" : C.steel,
                display: "flex", alignItems: "center", justifyContent: "center",
                font: `600 11px ${SANS}`,
                border: active ? `2px solid ${C.goldSoft}` : "none",
                boxShadow: active ? `0 0 0 3px ${C.gold}25` : "none",
                transition: "all .2s",
              }}>
                {done ? Icon.check(12, "#fff") : n}
              </div>
              {!isMobile && (
                <span style={{
                  font: `${active ? 600 : 500} 12px ${SANS}`,
                  color: active ? C.navy : C.steel,
                }}>{s}</span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: isMobile ? 14 : 24, height: 1, background: C.line }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Animated count-up for the big number
function BigNumber({ n, device }) {
  const isNeg  = (n || 0) < 0;
  const target = Math.round(Math.abs(n || 0));
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 1100;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return (
    <div style={{
      font: `700 ${device === "mobile" ? 72 : 120}px/1 ${SERIF}`,
      color: "#fff", letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums",
      display: "inline-flex", alignItems: "baseline", gap: 8,
    }}>
      <span style={{ color: isNeg ? "#ef4444" : C.gold, fontSize: device === "mobile" ? 36 : 60, fontWeight: 600 }}>
        {isNeg ? "−" : "+"}
      </span>
      <span>{fmt(v)}</span>
    </div>
  );
}

function CompareBars({ offer, marketAvg }) {
  const max = Math.max(offer, marketAvg);
  const offerPct = (offer / max) * 100;
  const marketPct = (marketAvg / max) * 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <BarRow label="ICBC offer" value={offer} pct={offerPct} color={C.alert}/>
      <BarRow label="BC market average" value={marketAvg} pct={marketPct} color={C.gold} emphasis/>
    </div>
  );
}
function BarRow({ label, value, pct, color, emphasis }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", font: `500 12.5px ${SANS}`, color: emphasis ? "#fff" : "rgba(255,255,255,0.7)", marginBottom: 7 }}>
        <span>{label}</span>
        <span style={{ fontFamily: MONO, fontWeight: 600 }}>{fmt(value)}</span>
      </div>
      <div style={{ height: 14, background: "rgba(255,255,255,0.08)", borderRadius: 7, overflow: "hidden" }}>
        <div style={{
          width: pct + "%", height: "100%",
          background: color, borderRadius: 7,
          transition: "width 1s cubic-bezier(.2,.7,.3,1)",
          boxShadow: emphasis ? `0 0 12px ${color}80` : "none",
        }}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHECKOUT MODAL (Phase 3a) — warmer
// ─────────────────────────────────────────────────────────────
function Checkout({ price, onClose, onPaid, state, delta }) {
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12/27");
  const [cvc, setCvc] = useState("123");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = (e) => {
    e?.preventDefault();
    setBusy(true);
    setTimeout(() => onPaid(), 800);
  };

  return (
    <div style={{
      position: "absolute", inset: 0, background: "rgba(8,26,47,0.6)",
      backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, zIndex: 50, animation: "icbc-fade .2s ease",
    }}>
      <style>{`@keyframes icbc-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes icbc-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}
      </style>
      <div style={{
        background: C.paper, borderRadius: 16, width: "100%", maxWidth: 460,
        boxShadow: "0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset",
        overflow: "hidden",
        animation: "icbc-rise .3s cubic-bezier(.2,.7,.3,1)",
      }}>
        <div style={{
          padding: "18px 22px", borderBottom: `1px solid ${C.lineSoft}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: C.cream,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>{Icon.shield(13, "#fff")}</div>
            <span style={{ font: `600 13px ${SANS}`, color: C.navy }}>FairClaimBC</span>
            <span style={{ font: `400 11px ${MONO}`, color: C.steel }}>· secure checkout</span>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: "none", cursor: "pointer", color: C.steel,
            font: `400 22px ${SANS}`, lineHeight: 1, padding: "4px 8px", borderRadius: 4,
          }}>×</button>
        </div>

        <div style={{ padding: "24px 24px 8px" }}>
          <div style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>One-time payment</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ font: `700 36px/1 ${SERIF}`, color: C.navy, letterSpacing: "-.025em" }}>${price}.00</span>
            <span style={{ font: `400 13px ${SANS}`, color: C.steel }}>USD</span>
          </div>
          <div style={{
            marginTop: 16, padding: "14px 16px", background: C.cream,
            border: `1px solid ${C.lineSoft}`, borderRadius: 10,
            font: `400 13px/1.55 ${SANS}`, color: C.steel,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: C.navy, fontWeight: 600 }}>Dispute letter</span>
              <span style={{ fontFamily: MONO, color: C.navy }}>${price}.00</span>
            </div>
            <div style={{ font: `400 12px ${SANS}`, color: C.steel }}>
              {state.year} {state.make} {state.model} · est. recovery <span style={{ fontFamily: MONO, color: C.good, fontWeight: 600 }}>{fmt(delta.gap)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={submit} style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="Email"><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" type="email" required/></Field>
          <Field label="Card information">
            <Input value={card} onChange={(e) => setCard(e.target.value)} placeholder="1234 1234 1234 1234"/>
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Expiry"><Input value={exp} onChange={(e) => setExp(e.target.value)} placeholder="MM / YY"/></Field>
            <Field label="CVC"><Input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123"/></Field>
          </div>
          <Btn size="lg" variant="accent" full disabled={busy}>
            {busy ? <>Processing your payment…</> : <>Pay ${price}.00 securely {Icon.lock(12, "#fff")}</>}
          </Btn>
          <div style={{
            font: `400 11.5px/1.5 ${SANS}`, color: C.steel, textAlign: "center", marginTop: 4,
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            {Icon.lock(11, C.steel)} Secured by Stripe · 7-day money-back guarantee
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LETTER SCREEN (Phase 3b) — warmer
// ─────────────────────────────────────────────────────────────
function LetterScreen({ state, delta, device, tone, onRestart }) {
  const [status, setStatus] = useState("loading");
  const [letterText, setLetterText] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const args = {
        vehicle: {
          year: state.year, make: state.make,
          model: state.model === "Other" && state.modelOther ? state.modelOther : [state.model, state.trim].filter(Boolean).join(" "),
          km: state.km
        },
        offer: delta.offer, claim: state.claim, comps: state.comps,
        marketAvg: delta.marketAvg, gap: delta.gap, tone,
      };
      const res = await generateLetter(args);
      if (cancelled) return;
      if (res.ok) { setLetterText(res.text); setStatus("ready"); }
      else { setLetterText(fallbackLetter(args)); setStatus("ready"); }
    })();
    return () => { cancelled = true; };
  }, []);

  const isMobile = device === "mobile";
  return (
    <div style={{ background: C.surface, minHeight: "100%" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "14px 20px" : "18px 48px", borderBottom: `1px solid ${C.line}`, background: C.paper,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: C.goodSoft, color: C.good, display: "flex", alignItems: "center", justifyContent: "center" }}>{Icon.check(15, C.good)}</div>
          <span style={{ font: `600 13px ${SANS}`, color: C.navy }}>Payment confirmed · letter ready</span>
        </div>
        <Stepper current={3} device={device}/>
      </div>

      <section style={{ padding: isMobile ? "28px 20px" : "56px 48px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ marginBottom: 28, textAlign: isMobile ? "left" : "center" }}>
          <span style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".15em", textTransform: "uppercase" }}>· Your letter ·</span>
          <h2 style={{ margin: "10px 0 10px", font: `700 ${isMobile ? 26 : 36}px/1.15 ${SERIF}`, color: C.navy, letterSpacing: "-.02em" }}>
            Your dispute letter is ready.
          </h2>
          <p style={{ margin: "0 auto", font: `400 15px/1.55 ${SANS}`, color: C.steel, maxWidth: 580 }}>
            Two pages, cited, and ready to send. Tone: <span style={{ color: C.navy, fontWeight: 600 }}>{tone === "assertive" ? "Assertive" : "Measured"}</span>.
            Reply to your adjuster's email and attach the PDF.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: 28, alignItems: "start" }}>
          {/* Letter preview — paper */}
          <div style={{
            background: "#fff", border: `1px solid ${C.line}`, borderRadius: 12,
            padding: isMobile ? "32px 26px" : "64px 72px",
            font: `400 13.5px/1.7 ${SERIF}`, color: "#1a1a1a",
            minHeight: 480, position: "relative",
            boxShadow: "0 12px 40px -16px rgba(14,42,71,0.12)",
          }}>
            {/* Watermark seal */}


            {status === "loading" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 380, gap: 16 }}>
                <Spinner/>
                <div style={{ font: `600 14px ${SANS}`, color: C.navy }}>Drafting your letter…</div>
                <div style={{ font: `400 12.5px/1.55 ${SANS}`, color: C.steel, textAlign: "center", maxWidth: 340 }}>
                  Cross-referencing your comparables against the Insurance (Vehicle) Act §152 and ICBC Claims Manual standards.
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: 999, background: C.gold,
                      animation: `icbc-pulse 1.2s ${i * 0.2}s infinite ease-in-out`,
                    }}/>
                  ))}
                </div>
                <style>{`@keyframes icbc-pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }`}</style>
              </div>
            )}
            {status === "ready" && (
              <pre style={{
                whiteSpace: "pre-wrap", margin: 0,
                font: `inherit`, color: "inherit", fontFamily: SERIF, position: "relative", zIndex: 1,
              }}>{letterText}</pre>
            )}
          </div>

          {/* Side panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: isMobile ? "static" : "sticky", top: 24 }}>
            <div style={{
              background: C.paper, border: `1px solid ${C.line}`, borderRadius: 14, padding: 20,
              boxShadow: "0 4px 16px -8px rgba(14,42,71,0.06)",
            }}>
              <div style={{ font: `600 11px ${MONO}`, color: C.gold, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>Download</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Btn variant="primary" full onClick={() => downloadAsPdfStub(letterText)} disabled={status !== "ready"}>
                  {Icon.doc(14, "#fff")} Download PDF
                </Btn>
                <Btn variant="light" full onClick={() => downloadAsWord(letterText)} disabled={status !== "ready"}>
                  {Icon.doc(14, C.navy)} Download .doc (Word)
                </Btn>
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navySoft} 100%)`,
              color: "#fff", borderRadius: 14, padding: 22, position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ font: `500 11px ${MONO}`, color: C.gold, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>Recovery target</div>
                <div style={{ font: `700 32px/1 ${SERIF}`, color: "#fff", letterSpacing: "-.025em" }}>{fmt(delta.marketAvg)}</div>
                <div style={{ marginTop: 8, font: `400 12px/1.55 ${SANS}`, color: C.steelLight }}>
                  Revised settlement at BC market avg —<br/>
                  <span style={{ color: C.gold, fontWeight: 600 }}>+{fmt(delta.gap)}</span> over the initial offer.
                </div>
              </div>
            </div>

            <div style={{
              background: C.goldSoft, border: `1px solid ${C.gold}40`, borderRadius: 12, padding: 16,
              font: `400 12px/1.6 ${SANS}`, color: C.navy,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, font: `600 12px ${SANS}` }}>
                {Icon.sparkle(12, C.gold)} What to do next
              </div>
              Reply to your adjuster's email and attach the PDF. Include your claim number in the subject line. ICBC must respond within 14 business days.
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4, font: `400 11.5px ${SANS}`, color: C.navy }}>
                <span>ICBC Claims: <strong>1-800-910-4222</strong></span>
                <span>Free escalation: <strong>civilresolutionbc.ca</strong></span>
              </div>
            </div>

            <button onClick={onRestart} style={{
              background: "transparent", border: "none", cursor: "pointer",
              font: `500 12.5px ${SANS}`, color: C.steel, padding: "8px 0", textAlign: "center",
            }}>← Start over with a different vehicle</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 36, height: 36, border: `3px solid ${C.lineSoft}`,
      borderTopColor: C.gold, borderRadius: "50%",
      animation: "icbc-spin 0.8s linear infinite",
    }}>
      <style>{`@keyframes icbc-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// APP ORCHESTRATOR
// ─────────────────────────────────────────────────────────────
function ICBCShieldApp({ device, heroVariant, price, letterTone, showTrustBar }) {
  const [state, setState] = useState({
    year: "", make: "", model: "", trim: "", modelOther: "", km: "", offer: "", claim: "",
    scan: null,
    comps: [{ url: "", price: "" }, { url: "", price: "" }, { url: "", price: "" }],
  });
  const [screen, setScreen] = useState("landing");
  const [showCheckout, setShowCheckout] = useState(false);
  const [paid, setPaid] = useState(false);   // once paid, never show checkout again
  const [pendingDelta, setPendingDelta] = useState(null); // holds delta while checkout is open
  const [delta, setDelta] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [screen]);

  const scrollToId = (id) => {
    const el = document.getElementById(id) || containerRef.current?.querySelector("#" + id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const jumpToForm = () => {
    // Small delay so React finishes rendering before scroll
    setTimeout(() => scrollToId("diagnostic"), 50);
  };

  return (
    <div ref={containerRef} className="icbc-scroll" style={{
      width: "100%", height: "100%", overflow: "auto", overflowX: "hidden",
      background: C.cream, color: C.ink, fontFamily: SANS, position: "relative",
    }}>
      {screen === "landing" && (
        <>
          <Header device={device} onJump={jumpToForm} onScrollTo={scrollToId}/>
          <Hero device={device} heroVariant={heroVariant} onStart={jumpToForm}/>
          {showTrustBar && <TrustBar device={device}/>}
          <DiagnosticForm device={device} state={state} set={setState}
            onReveal={(d) => {
              // Show free celebration modal first
              setPendingDelta(d);
              setShowCheckout(true);
            }}
          />
          <KnowYourRights device={device}/>
          <Testimonials device={device}/>
          <HowItWorks device={device}/>
          <FAQSection device={device}/>
          <Footer device={device}/>
        </>
      )}

      {screen === "delta" && delta && (
        <DeltaReport
          device={device} state={state} delta={delta} price={price}
          paid={paid}
          onPay={() => setScreen("letter")}  // only reached when already paid
          onShowCheckout={() => {
            // Free during launch — go directly to letter
            setScreen("letter");
          }}
          onBack={() => setScreen("landing")}
        />
      )}

      {screen === "letter" && delta && (
        <LetterScreen
          device={device} state={state} delta={delta} tone={letterTone}
          onRestart={() => { setScreen("landing"); setDelta(null); setPendingDelta(null); setPaid(false); }}
        />
      )}

      {/* Free Launch Celebration Modal — always show, regardless of gap */}
      {showCheckout && !paid && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
          background: "rgba(14,42,71,0.55)",
          backdropFilter: "blur(4px)",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) { setShowCheckout(false); setPendingDelta(null); } }}
        >
          <div style={{
            background: C.paper, borderRadius: 20, padding: "40px 36px",
            maxWidth: 420, width: "100%", textAlign: "center",
            boxShadow: "0 32px 80px -20px rgba(14,42,71,0.35)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            animation: "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <style>{`@keyframes popIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>

            {/* Celebration icon */}
            <div style={{ fontSize: 52, lineHeight: 1 }}>🎉</div>

            {/* Title */}
            <div style={{ font: `700 24px/1.2 ${SERIF}`, color: C.navy, letterSpacing: "-.015em" }}>
              Your report is free today!
            </div>

            {/* Subtitle */}
            <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.steel, maxWidth: 340 }}>
              We're in launch mode — get your full Delta Report and dispute letter at no cost. Normally <span style={{ fontFamily: MONO, fontWeight: 700, color: C.navy }}>$49</span>.
            </div>

            {/* Value pills */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                "✓ Full comparables report",
                "✓ 2-page dispute letter",
                "✓ No credit card",
              ].map((item, i) => (
                <span key={i} style={{
                  padding: "5px 12px", borderRadius: 999,
                  background: C.goodSoft, border: `1px solid ${C.good}33`,
                  font: `500 12px ${SANS}`, color: C.good,
                }}>{item}</span>
              ))}
            </div>

            {/* CTA button */}
            <Btn size="lg" variant="gold" full onClick={() => {
              setPaid(true);
              setShowCheckout(false);
              if (pendingDelta) { setDelta(pendingDelta); setPendingDelta(null); }
              setScreen("delta");
            }} style={{ marginTop: 4, fontSize: 16 }}>
              {Icon.sparkle(15, "#fff")} Unlock my free report {Icon.arrow(14, "#fff")}
            </Btn>

            {/* Close link */}
            <button onClick={() => { setShowCheckout(false); setPendingDelta(null); }}
              style={{ background: "none", border: "none", cursor: "pointer", font: `400 12px ${SANS}`, color: C.steel }}>
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CANVAS MOUNT
// ─────────────────────────────────────────────────────────────
function CanvasApp() {
  const [t] = useTweaks(window.__TWEAKS_DEFAULTS);
  return (
    <DesignCanvas>
      <DCSection id="overview" title="FairClaimBC" subtitle="Total loss dispute assistant — desktop and mobile flows. Both artboards are fully interactive; expand any to focus.">
        <DCArtboard id="desktop" label="Desktop · landing → delta → letter" width={1280} height={900}>
          <ChromeWindow url="fairclaim.bc.ca" tabs={[{ title: "FairClaimBC — Recover your total loss" }]} width={1280} height={900}>
            <ICBCShieldApp device="desktop" heroVariant={t.heroVariant} price={t.price} letterTone={t.letterTone} showTrustBar={t.showTrustBar}/>
          </ChromeWindow>
        </DCArtboard>
        <DCArtboard id="mobile" label="Mobile · same flow, mobile-first" width={402} height={874}>
          <IOSDevice width={402} height={874}>
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
              <IOSStatusBar/>
              <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                <ICBCShieldApp device="mobile" heroVariant={t.heroVariant} price={t.price} letterTone={t.letterTone} showTrustBar={t.showTrustBar}/>
              </div>
            </div>
          </IOSDevice>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

function Root() {
  const [t] = useTweaks(window.__TWEAKS_DEFAULTS);
  applyTheme(t.theme || "warm");

  // Detect real device size — render app directly, no canvas
  const isMobile = window.innerWidth < 768;
  const device   = isMobile ? "mobile" : "desktop";

  return (
    <ICBCShieldApp
      device={device}
      heroVariant={t.heroVariant || "directQuestion"}
      price={t.price || 49}
      letterTone={t.letterTone || "assertive"}
      showTrustBar={t.showTrustBar !== false}
    />
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root/>);

// v7
