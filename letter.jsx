// letter.jsx — letter generation (real Claude call), rendering, and download

const buildPrompt = ({ vehicle, offer, claim, comps, marketAvg, gap, tone, ownerName }) => {
  const compLines = comps
    .filter(c => c.url || c.price)
    .map((c, i) => {
      const src = detectSource(c.url);
      const px = c.price ? fmt(c.price) : "(price not provided)";
      return `   ${i + 1}. ${src} — ${px} — ${c.url || "(URL not provided)"}`;
    }).join("\n");

  const toneLine = tone === "assertive"
    ? "Tone: assertive, technical, and uncompromising on ACV. Use direct language. Cite the Insurance (Vehicle) Act of BC and the ICBC Claims Manual obligation to settle at fair market value."
    : "Tone: measured, professional, and cooperative. Frame the dispute as a request for revaluation supported by documented market evidence. Still cite the Insurance (Vehicle) Act of BC where relevant.";

  return `You are an expert vehicle appraiser specializing in British Columbia total-loss disputes under the Insurance (Vehicle) Act and ICBC's claims handling regulations. Draft a 2-page formal dispute letter.

CLAIMANT VEHICLE
Year/Make/Model: ${vehicle.year} ${vehicle.make} ${vehicle.model}
Mileage: ${vehicle.km ? Number(vehicle.km).toLocaleString("en-CA") + " km" : "(not provided)"}
ICBC Claim #: ${claim || "[Insert Claim Number]"}
ICBC Initial Offer: ${fmt(offer)}

MARKET EVIDENCE (comparable listings provided by the claimant)
${compLines}

Computed market average from comparables: ${fmt(marketAvg)}
Estimated value gap (market − offer): ${fmt(gap)}

${toneLine}

LETTER STRUCTURE (use these section headings, in order):

1. RE line: "RE: Claim ${claim || "[Insert Claim Number]"} — Dispute of Total Loss Settlement Offer"
2. Opening paragraph: identify the claimant, the vehicle, and reference the date of the initial offer. State that the claimant disputes the offer as inconsistent with Actual Cash Value (ACV) under the Insurance (Vehicle) Act of BC.
3. **I. Statement of Position** — concise paragraph: the offered amount of ${fmt(offer)} does not reflect ACV. The claimant requires settlement at the documented market average of ${fmt(marketAvg)}, representing a gap of ${fmt(gap)}.
4. **II. Technical Argument — Actual Cash Value** — explain ACV per Section 152 of the Insurance (Vehicle) Act of BC: the price a willing buyer would pay a willing seller in the local market immediately before the loss. Reference ICBC's obligation under its own Claims Manual to assess fair market value, not internal valuation tool output. Note that internal valuation tools (e.g., Audatex/CCC) consistently undervalue trim, condition, and regional pricing.
5. **III. Market Comparables** — present the ${comps.filter(c => c.url || c.price).length} comparable listings as a numbered list with source and listing price. Note that all comparables are publicly listed in British Columbia at the time of the dispute.
6. **IV. Requested Resolution** — request revised settlement at ${fmt(marketAvg)}, plus reasonable taxes/fees if applicable. Offer to provide additional comparables on request. Reference the dispute resolution process under ICBC's Fair Practices and the right to escalate to the Civil Resolution Tribunal.
7. **V. Closing** — formal closing requesting written response within 14 days. Sign off with the claimant's name placeholder.

FORMATTING RULES:
- Use plain text. NO markdown bold/italic in the letter body — only the section headings (I, II, III, IV, V) should be in caps.
- Address block at top: "[Claimant Name]" and "[Claimant Address]" placeholders. Then "ICBC Claims Department".
- Date line: today's date, formatted "Month DD, YYYY".
- Use Canadian English spelling.
- Cite "Section 152 of the Insurance (Vehicle) Act, R.S.B.C. 1996" at least once.
- 600–800 words total.
- Return ONLY the letter text — no preamble, no commentary, no markdown fences.

Begin the letter now.`;
};

// ──────────────────────────────────────────────────────────────
async function generateLetter(args) {
  const prompt = buildPrompt(args);
  try {
    const text = await window.claude.complete(prompt);
    return { ok: true, text };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

// ──────────────────────────────────────────────────────────────
// Fallback letter (used if Claude call fails or for instant preview)
function fallbackLetter({ vehicle, offer, claim, comps, marketAvg, gap }) {
  const today = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
  const compList = comps.filter(c => c.url || c.price).map((c, i) =>
    `   ${i + 1}. ${detectSource(c.url)} — ${c.price ? fmt(c.price) : "price on request"}\n      ${c.url || ""}`
  ).join("\n");

  return `[Claimant Name]
[Claimant Address]
[City, BC, Postal Code]

${today}

ICBC Claims Department
151 West Esplanade
North Vancouver, BC V7M 3H9

RE: Claim ${claim || "[Insert Claim Number]"} — Dispute of Total Loss Settlement Offer

Dear Adjuster,

I am writing to formally dispute the total loss settlement offer of ${fmt(offer)} extended on my ${vehicle.year} ${vehicle.make} ${vehicle.model}. After review of comparable market listings in British Columbia, the offered amount does not reflect the Actual Cash Value (ACV) of the vehicle as required under the Insurance (Vehicle) Act, R.S.B.C. 1996.

I. STATEMENT OF POSITION

The settlement amount of ${fmt(offer)} is inconsistent with the documented fair market value of comparable vehicles in the local British Columbia market. Based on three publicly available comparable listings, the average ACV for a ${vehicle.year} ${vehicle.make} ${vehicle.model} with similar mileage is ${fmt(marketAvg)} — a gap of ${fmt(gap)} from the current offer.

II. TECHNICAL ARGUMENT — ACTUAL CASH VALUE

Section 152 of the Insurance (Vehicle) Act defines settlement at the value a willing buyer would have paid a willing seller for the specific vehicle in its local market, immediately before the loss. This is the regulatory standard for ACV in British Columbia. Internal automated valuation tools (Audatex, CCC, or analogous) systematically underweight trim level, regional pricing variance, and documented condition. The ICBC Claims Manual explicitly requires the adjuster to consider market evidence supplied by the insured.

The vehicle in question, with ${vehicle.km ? Number(vehicle.km).toLocaleString("en-CA") + " km" : "documented mileage"}, falls squarely within the band of the comparables presented below.

III. MARKET COMPARABLES

The following comparable listings are publicly available in British Columbia as of the date of this letter:

${compList}

The arithmetic mean of these comparables is ${fmt(marketAvg)}.

IV. REQUESTED RESOLUTION

I respectfully request that the settlement offer be revised to ${fmt(marketAvg)}, reflecting the documented Actual Cash Value of the vehicle. I am prepared to provide additional comparable listings, photographs, or service records on request. Should this matter not be resolved at the adjuster level, I reserve the right to escalate through ICBC's Fair Practices process and, if necessary, to the Civil Resolution Tribunal of British Columbia.

V. CLOSING

I would appreciate a written response within fourteen (14) days of receipt of this letter. I remain available to discuss the matter and to provide further documentation in support of the revised valuation.

Respectfully,


[Claimant Name]
[Claimant Phone]
[Claimant Email]

— Generated with FairClaimBC · Market evidence-based dispute drafting`;
}

// ──────────────────────────────────────────────────────────────
// Trigger a download (in-memory blob, no server)
function downloadAs(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Plain-text letter, but with a .doc extension Word will happily open
function downloadAsWord(letter) {
  const html = `<html><head><meta charset="utf-8"><style>
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; max-width: 6.5in; }
    h2, h3 { font-size: 12pt; margin-top: 16pt; }
  </style></head><body><pre style="white-space:pre-wrap;font-family:'Times New Roman',serif;font-size:12pt">${letter.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre></body></html>`;
  downloadAs("ICBC-Dispute-Letter.doc", html, "application/msword");
}

function downloadAsPdfStub(letter) {
  // We don't ship a full PDF lib in this prototype; instead trigger a print-friendly window.
  const w = window.open("", "_blank");
  if (!w) { alert("Pop-up blocked — allow pop-ups to print to PDF."); return; }
  w.document.write(`<!doctype html><html><head><title>ICBC Dispute Letter</title>
    <style>
      @page { size: letter; margin: 1in; }
      body { font-family: 'Times New Roman', Georgia, serif; font-size: 11.5pt; line-height: 1.55; color: #111; }
      pre { white-space: pre-wrap; font-family: inherit; font-size: inherit; }
    </style></head><body><pre>${letter.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre>
    <script>setTimeout(() => window.print(), 250)<\/script>
    </body></html>`);
  w.document.close();
}

Object.assign(window, {
  generateLetter, fallbackLetter, downloadAsWord, downloadAsPdfStub,
});
