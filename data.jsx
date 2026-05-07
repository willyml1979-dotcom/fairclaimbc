// data.jsx — sample data, copy variants, helpers for FairClaimBC

const HERO_VARIANTS = {
  directQuestion: {
    eyebrow: "ICBC Total Loss Claim · British Columbia",
    title: "ICBC offered too little for your claim?",
    subtitle: "See how your offer compares to real BC market listings. Get a professional dispute letter ready to send to ICBC, in 90 seconds. No sign-up required.",
    cta: "Get More For Your Claim",
  },
  recoveryFocused: {
    eyebrow: "ICBC Total Loss Dispute · British Columbia",
    title: "You may be owed more than ICBC offered.",
    subtitle: "Compare your ICBC offer to live BC market listings. If there is a gap, get a dispute letter ready to send, in 90 seconds. No sign-up required.",
    cta: "Compare My ICBC Offer",
  },
  authoritative: {
    eyebrow: "Based on Section 152, Insurance (Vehicle) Act of BC",
    title: "ICBC's first offer is not always their best offer.",
    subtitle: "FairClaimBC compares your claim against real BC listings and prepares a dispute letter citing the law your ICBC adjuster must follow.",
    cta: "Check My Claim Now",
  },
};

const FAQ = [
  {
    q: "Is this legal advice?",
    a: "No. FairClaimBC is a data-driven drafting assistant. We help you prepare a settlement negotiation letter using market comparables and the language ICBC adjusters expect. For binding legal advice, consult a BC lawyer or the Civil Resolution Tribunal.",
  },
  {
    q: "What is 'Actual Cash Value' (ACV)?",
    a: "ACV is the fair market value of your vehicle immediately before the loss, meaning what a willing buyer would have paid a willing seller for your specific vehicle in your local market. ICBC's first offer is based on internal valuation tools that frequently undercount trim, condition, and regional pricing.",
  },
  {
    q: "Will this work for my claim?",
    a: "FairClaimBC is built for total loss disputes in British Columbia where the insured has a documented offer and access to 3 or more comparable listings. It works for owned vehicles and financed vehicles where the owner is the claimant.",
  },
  {
    q: "What's the money-back guarantee?",
    a: "If you are not satisfied with your dispute letter, contact us and we will work with you to make it right. Please see our refund policy for full details.",
  },
  {
    q: "How long until I get my letter?",
    a: "Typically under 90 seconds after payment. The letter arrives as both a PDF (for sending to ICBC) and a Word document (so you can edit details if needed).",
  },
  {
    q: "What does ICBC say about disputing offers?",
    a: "Section 152 of the Insurance (Vehicle) Act and ICBC's own Claims Handbook acknowledge the insured's right to negotiate ACV. Your adjuster is required to consider documented market evidence, which is exactly what this letter provides.",
  },
  {
    q: "How do I send the letter to ICBC?",
    a: "Email your letter directly to your assigned adjuster (their contact is on your ICBC offer letter). Use your claim number in the subject line. ICBC has 14 business days to respond. If you don't have your adjuster's email, call ICBC Claims at 1-800-910-4222 and ask for your file number and adjuster contact.",
  },
  {
    q: "What if ICBC ignores my dispute or says no?",
    a: "If ICBC doesn't revise their offer within 14 business days, you can escalate for free to the Civil Resolution Tribunal (CRT) at civilresolutionbc.ca. The CRT handles claims under $35,000 and has a strong track record for documented ACV disputes. You have up to 2 years from your accident date to file.",
  },
  {
    q: "What if I already accepted ICBC's offer?",
    a: "If you signed a release form, the settlement may be final. However, if you only received a verbal or written offer but have NOT signed a release, you can still dispute. We recommend acting quickly. Call your adjuster or ICBC Claims at 1-800-910-4222 to confirm your status.",
  },
];

const HOW_IT_WORKS = [
  { n: "01", t: "Enter your vehicle and ICBC's offer", d: "Year, make, model, kilometres, and the dollar amount on the table. Takes about 60 seconds." },
  { n: "02", t: "We scan the BC market in real time", d: "Our system searches Autotrader, Kijiji and Marketplace for comparable BC listings, then normalizes for trim and mileage." },
  { n: "03", t: "See the gap between their offer and market value", d: "We calculate the difference and draft a 2-page professional letter citing the Insurance (Vehicle) Act, ready to send to your ICBC adjuster." },
  { n: "04", t: "Send the letter and follow up", d: "Email it to your assigned adjuster with your claim number in the subject line. ICBC has 14 business days to respond. We include the contact template and the ICBC Claims number (1-800-910-4222) so you are never left wondering what to do next." },
];

const SAMPLE_PREFILL = {
  year: "2019",
  make: "Toyota",
  model: "RAV4 XLE AWD",
  km: "78400",
  offer: "24800",
  claim: "AB1234567",
  comps: [
    { url: "autotrader.ca/a/toyota/rav4/vancouver/...", price: "31995" },
    { url: "facebook.com/marketplace/item/1029384756", price: "30500" },
    { url: "craigslist.org/van/cto/d/2019-rav4-xle/...", price: "29900" },
  ],
};

// ── Helpers ──────────────────────────────────────────────────
const fmt = (n) => {
  if (n == null || isNaN(n)) return "—";
  return "$" + Math.round(Number(n)).toLocaleString("en-CA");
};
const parseNum = (s) => {
  if (!s) return null;
  const n = Number(String(s).replace(/[^0-9.]/g, ""));
  return isFinite(n) && n > 0 ? n : null;
};

const computeDelta = ({ offer, comps, marketAvg: precomputedAvg }) => {
  const offerN = parseNum(offer);
  // Use adjustedPrice for market average (km-normalized) — same as Worker calculation
  const prices = (comps || []).map(c => parseNum(c.adjustedPrice || c.price)).filter(Boolean);
  if (!offerN || prices.length === 0) {
    return { offer: offerN, marketAvg: null, gap: null, gapPct: null, prices };
  }
  // Prefer pre-computed marketAvg from Worker (already km-adjusted and rounded)
  const marketAvg = precomputedAvg || Math.round(prices.reduce((a, b) => a + b, 0) / prices.length / 5) * 5;
  const gap = marketAvg - offerN;
  const gapPct = (gap / offerN) * 100;
  return { offer: offerN, marketAvg, gap, gapPct, prices };
};

// Domain detection for comparable URLs
const detectSource = (url) => {
  if (!url) return "Listing";
  const u = url.toLowerCase();
  if (u.includes("autotrader")) return "Autotrader";
  if (u.includes("facebook")) return "Marketplace";
  if (u.includes("craigslist")) return "Craigslist";
  if (u.includes("kijiji")) return "Kijiji";
  if (u.includes("cargurus")) return "CarGurus";
  return "Listing";
};

// ── Canadian make / model / trim catalog ─────────────────────
// Curated for the Canadian market (BC). Makes alphabetical. Models alphabetical within each make.
// "Other" is always the last option in every list.
const VEHICLES = {
  "Acura": {
    "ILX":      ["Base","Premium","Tech","A-Spec","Other"],
    "Integra":  ["Base","A-Spec","A-Spec Tech","Type S","Other"],
    "MDX":      ["Base","Tech","A-Spec","Platinum Elite","Type S","Other"],
    "RDX":      ["Base","Tech","A-Spec","Platinum Elite","Other"],
    "TLX":      ["Base","Tech","A-Spec","Platinum Elite","Type S","Other"],
    "Other":    ["Other"],
  },
  "Audi": {
    "A3":       ["Komfort","Progressiv","Technik","S3","RS 3","Other"],
    "A4":       ["Komfort","Progressiv","Technik","S4","Other"],
    "A5":       ["Komfort","Progressiv","Technik","S5","RS 5","Other"],
    "A6":       ["Komfort","Progressiv","Technik","S6","RS 6","Other"],
    "A7":       ["Progressiv","Technik","S7","RS 7","Other"],
    "A8":       ["Base","L","S8","Other"],
    "Q3":       ["Komfort","Progressiv","Technik","Other"],
    "Q5":       ["Komfort","Progressiv","Technik","SQ5","Other"],
    "Q7":       ["Komfort","Progressiv","Technik","SQ7","Other"],
    "Q8":       ["Progressiv","Technik","SQ8","RS Q8","Other"],
    "e-tron":   ["Progressiv","Technik","S","GT","RS GT","Other"],
    "Q4 e-tron":["Progressiv","Technik","Other"],
    "Other":    ["Other"],
  },
  "BMW": {
    "2 Series": ["228i xDrive","M235i xDrive","M2","Other"],
    "3 Series": ["330i","330i xDrive","330e","M340i","M3","M3 Competition","Other"],
    "4 Series": ["430i","430i xDrive","M440i","M4","Other"],
    "5 Series": ["530i","540i","M550i","i5","M5","Other"],
    "7 Series": ["740i","750e","760i","i7","Other"],
    "8 Series": ["840i","M850i","M8","Other"],
    "X1":       ["xDrive28i","M35i","Other"],
    "X2":       ["xDrive28i","M35i","Other"],
    "X3":       ["xDrive30i","M40i","X3 M","Other"],
    "X4":       ["xDrive30i","M40i","X4 M","Other"],
    "X5":       ["xDrive40i","xDrive50e","M60i","X5 M","Other"],
    "X6":       ["xDrive40i","M60i","X6 M","Other"],
    "X7":       ["xDrive40i","M60i","Alpina XB7","Other"],
    "i4":       ["eDrive35","eDrive40","M50","Other"],
    "iX":       ["xDrive50","M60","Other"],
    "Z4":       ["sDrive30i","M40i","Other"],
    "Other":    ["Other"],
  },
  "Buick": {
    "Encore GX":["Preferred","Sport Touring","Avenir","Other"],
    "Envision": ["Preferred","Sport Touring","Avenir","Other"],
    "Enclave":  ["Essence","Premium","Avenir","Other"],
    "Other":    ["Other"],
  },
  "Cadillac": {
    "CT4":      ["Luxury","Premium Luxury","Sport","V","V Blackwing","Other"],
    "CT5":      ["Luxury","Premium Luxury","Sport","V","V Blackwing","Other"],
    "Escalade": ["Luxury","Premium Luxury","Sport","Sport Platinum","V","Other"],
    "LYRIQ":    ["Tech","Luxury","Sport","Other"],
    "XT4":      ["Luxury","Premium Luxury","Sport","Other"],
    "XT5":      ["Luxury","Premium Luxury","Sport","Other"],
    "XT6":      ["Luxury","Premium Luxury","Sport","Other"],
    "Other":    ["Other"],
  },
  "Chevrolet": {
    "Blazer":   ["LT","RS","Premier","Other"],
    "Bolt EUV": ["LT","Premier","Other"],
    "Bolt EV":  ["1LT","2LT","Other"],
    "Camaro":   ["1LT","2LT","3LT","SS","ZL1","Other"],
    "Colorado": ["WT","LT","Z71","Trail Boss","ZR2","Other"],
    "Corvette": ["Stingray","Z06","E-Ray","Other"],
    "Equinox":  ["LS","LT","RS","Premier","Other"],
    "Malibu":   ["LS","LT","RS","Premier","Other"],
    "Silverado 1500": ["WT","Custom","LT","RST","LT Trail Boss","LTZ","High Country","ZR2","Other"],
    "Silverado 2500HD":["WT","Custom","LT","LTZ","High Country","ZR2","Other"],
    "Suburban": ["LS","LT","RST","Z71","Premier","High Country","Other"],
    "Tahoe":    ["LS","LT","RST","Z71","Premier","High Country","Other"],
    "Trailblazer":["LS","LT","Activ","RS","Other"],
    "Traverse": ["LS","LT","RS","Premier","High Country","Other"],
    "Trax":     ["LS","LT","Activ","RS","Other"],
    "Other":    ["Other"],
  },
  "Chrysler": {
    "300":      ["Touring","Touring L","S","C","Other"],
    "Pacifica": ["Touring","Touring L","Limited","Pinnacle","Hybrid","Other"],
    "Other":    ["Other"],
  },
  "Dodge": {
    "Challenger":["SXT","GT","R/T","R/T Scat Pack","SRT Hellcat","Other"],
    "Charger":  ["SXT","GT","R/T","Scat Pack","SRT Hellcat","Daytona EV","Other"],
    "Durango":  ["SXT","GT","R/T","Citadel","SRT 392","SRT Hellcat","Other"],
    "Hornet":   ["GT","R/T","Other"],
    "Other":    ["Other"],
  },
  "Fiat": {
    "500":      ["Pop","Lounge","Sport","Abarth","Other"],
    "500X":     ["Pop","Sport","Trekking","Other"],
    "Other":    ["Other"],
  },
  "Ford": {
    "Bronco":   ["Base","Big Bend","Black Diamond","Outer Banks","Heritage","Wildtrak","Badlands","Raptor","Other"],
    "Bronco Sport":["Base","Big Bend","Heritage","Outer Banks","Badlands","Other"],
    "Edge":     ["SE","SEL","ST-Line","Titanium","ST","Other"],
    "Escape":   ["S","SE","SEL","Titanium","ST-Line","Hybrid","PHEV","Other"],
    "Expedition":["XL","XLT","Limited","King Ranch","Platinum","Timberline","Other"],
    "Explorer": ["Base","XLT","Limited","Timberline","ST-Line","ST","Platinum","King Ranch","Other"],
    "F-150":    ["XL","XLT","Lariat","King Ranch","Platinum","Limited","Tremor","Raptor","Raptor R","Other"],
    "F-150 Lightning":["Pro","XLT","Flash","Lariat","Platinum","Other"],
    "F-250":    ["XL","XLT","Lariat","King Ranch","Platinum","Limited","Tremor","Other"],
    "F-350":    ["XL","XLT","Lariat","King Ranch","Platinum","Limited","Other"],
    "Maverick": ["XL","XLT","Lariat","Tremor","Other"],
    "Mustang":  ["EcoBoost","EcoBoost Premium","GT","GT Premium","Dark Horse","Other"],
    "Mustang Mach-E":["Select","Premium","California Route 1","GT","Rally","Other"],
    "Ranger":   ["XL","XLT","Lariat","Tremor","Raptor","Other"],
    "Transit Connect":["XL","XLT","Titanium","Other"],
    "Other":    ["Other"],
  },
  "Genesis": {
    "G70":      ["Advanced","Sport","Sport Plus","Other"],
    "G80":      ["Advanced","Prestige","Sport","Other"],
    "G90":      ["3.5T","3.5T Premium","Other"],
    "GV60":     ["Advanced","Performance","Other"],
    "GV70":     ["Advanced","Sport","Prestige","Other"],
    "GV80":     ["Advanced","Prestige","Other"],
    "Other":    ["Other"],
  },
  "GMC": {
    "Acadia":   ["Elevation","AT4","Denali","Other"],
    "Canyon":   ["Elevation","AT4","Denali","AT4X","Other"],
    "Hummer EV":["EV2","EV3X","Edition 1","Other"],
    "Sierra 1500":["Pro","SLE","Elevation","SLT","AT4","Denali","Denali Ultimate","AT4X","Other"],
    "Sierra 2500HD":["Pro","SLE","SLT","AT4","Denali","Denali Ultimate","Other"],
    "Terrain":  ["SLE","SLT","AT4","Denali","Other"],
    "Yukon":    ["SLE","SLT","AT4","Denali","Denali Ultimate","Other"],
    "Yukon XL": ["SLE","SLT","AT4","Denali","Denali Ultimate","Other"],
    "Other":    ["Other"],
  },
  "Honda": {
    "Accord":   ["LX","Sport","EX-L","Sport-L","Touring","Hybrid","Other"],
    "Civic":    ["LX","EX","Sport","Sport Touring","Touring","Si","Type R","Hybrid","Other"],
    "CR-V":     ["LX","EX","EX-L","Sport","Sport Touring","Touring","Hybrid EX-L","Hybrid Touring","Other"],
    "HR-V":     ["LX","Sport","EX-L","Other"],
    "Odyssey":  ["EX","EX-L","Touring","Black Edition","Other"],
    "Passport": ["EX-L","TrailSport","Black Edition","Other"],
    "Pilot":    ["LX","Sport","EX-L","TrailSport","Touring","Black Edition","Other"],
    "Prologue": ["EX","Touring","Elite","Other"],
    "Ridgeline":["Sport","EX-L","TrailSport","Black Edition","Other"],
    "Other":    ["Other"],
  },
  "Hyundai": {
    "Elantra":  ["Essential","Preferred","Luxury","Ultimate","N Line","N","Hybrid","Other"],
    "Ioniq 5":  ["Essential","Preferred","Preferred Long Range","Ultimate","N","Other"],
    "Ioniq 6":  ["Preferred","Preferred Long Range","Ultimate","Other"],
    "Kona":     ["Essential","Preferred","N Line","Ultimate","Electric","Other"],
    "Palisade": ["Essential","Preferred","Luxury","Ultimate Calligraphy","Other"],
    "Santa Cruz":["Preferred","Trend","Ultimate","XRT","Other"],
    "Santa Fe": ["Essential","Preferred","Trend","Luxury","Calligraphy","Hybrid","XRT","Other"],
    "Sonata":   ["Preferred","Sport","Luxury","Ultimate","N Line","Hybrid","Other"],
    "Tucson":   ["Essential","Preferred","Trend","N Line","Luxury","Ultimate","Hybrid","PHEV","Other"],
    "Venue":    ["Essential","Preferred","Trend","Ultimate","Other"],
    "Other":    ["Other"],
  },
  "Infiniti": {
    "Q50":      ["Pure","Luxe","Sensory","Red Sport 400","Other"],
    "QX50":     ["Pure","Luxe","Essential","Sensory","Autograph","Other"],
    "QX55":     ["Luxe","Essential","Sensory","Other"],
    "QX60":     ["Pure","Luxe","Sensory","Autograph","Other"],
    "QX80":     ["Luxe","Sensory","Autograph","Other"],
    "Other":    ["Other"],
  },
  "Jeep": {
    "Cherokee": ["Sport","North","Trailhawk","Limited","Altitude","Other"],
    "Compass":  ["Sport","North","Altitude","Limited","Trailhawk","Other"],
    "Gladiator":["Sport","Willys","Rubicon","Mojave","Other"],
    "Grand Cherokee":["Laredo","Altitude","Limited","Overland","Summit","Summit Reserve","Trailhawk","SRT","Other"],
    "Grand Cherokee L":["Laredo","Altitude","Limited","Overland","Summit","Summit Reserve","Other"],
    "Grand Wagoneer":["Series I","Series II","Series III","Obsidian","Other"],
    "Renegade": ["Sport","North","Altitude","Trailhawk","Other"],
    "Wagoneer": ["Series I","Series II","Series III","Other"],
    "Wrangler": ["Sport","Sport S","Willys","Sahara","Rubicon","Rubicon X","4xe","Rubicon 392","Other"],
    "Other":    ["Other"],
  },
  "Kia": {
    "Carnival": ["LX","LX+","EX","SX","SX+","Other"],
    "EV6":      ["Light","Wind","Land","GT-Line","GT","Other"],
    "EV9":      ["Light","Land","Wind","GT-Line","Other"],
    "Forte":    ["LX","EX","GT-Line","GT","Other"],
    "K5":       ["LX","EX","GT-Line","GT","Other"],
    "Niro":     ["LX","EX","SX","SX Touring","EV","PHEV","Other"],
    "Seltos":   ["LX","EX","SX","X-Line","Other"],
    "Sorento":  ["LX","EX","SX","X-Line","X-Pro","Hybrid","PHEV","Other"],
    "Soul":     ["LX","EX","GT-Line","Other"],
    "Sportage": ["LX","EX","SX","X-Line","Hybrid","PHEV","Other"],
    "Stinger":  ["GT-Line","GT","GT Limited","Other"],
    "Telluride":["EX","SX","X-Line","X-Pro","Other"],
    "Other":    ["Other"],
  },
  "Land Rover": {
    "Defender": ["90","110","130","P400","V8","Other"],
    "Discovery":["S","Dynamic SE","Dynamic HSE","Metropolitan","Other"],
    "Discovery Sport":["S","Dynamic SE","Dynamic HSE","Other"],
    "Range Rover":["SE","HSE","Autobiography","SV","Other"],
    "Range Rover Evoque":["S","Dynamic SE","Dynamic HSE","Autobiography","Other"],
    "Range Rover Sport":["SE","Dynamic SE","Dynamic HSE","Autobiography","SV","Other"],
    "Range Rover Velar":["S","Dynamic SE","Dynamic HSE","Autobiography","Other"],
    "Other":    ["Other"],
  },
  "Lexus": {
    "ES":       ["250","350","300h","350 F Sport","Other"],
    "GX":       ["Premium","Premium+","Overtrail","Overtrail+","Luxury","Other"],
    "IS":       ["300","350 F Sport","500 F Sport Performance","Other"],
    "LC":       ["500","500 Convertible","Other"],
    "LS":       ["500","500h","Other"],
    "LX":       ["600","600 F Sport","600 Ultra Luxury","Other"],
    "NX":       ["250","350","350h","450h+","350 F Sport","Other"],
    "RC":       ["350","350 F Sport","Other"],
    "RX":       ["350","350h","450h+","500h F Sport","Other"],
    "RZ":       ["300e","450e","Other"],
    "TX":       ["350","500h F Sport","550h+","Other"],
    "UX":       ["250h","250h F Sport","Other"],
    "Other":    ["Other"],
  },
  "Lincoln": {
    "Aviator":  ["Reserve","Black Label","Other"],
    "Corsair":  ["Reserve","Grand Touring","Other"],
    "Nautilus": ["Reserve","Reserve I","Black Label","Other"],
    "Navigator":["Reserve","Black Label","Other"],
    "Other":    ["Other"],
  },
  "Mazda": {
    "CX-30":    ["GX","GS","GT","Turbo","Other"],
    "CX-5":     ["GX","GS","GT","Signature","Other"],
    "CX-50":    ["GS-L","GT","Meridian","Turbo","Hybrid","Other"],
    "CX-70":    ["GS-L","GT","Signature","PHEV","Other"],
    "CX-90":    ["GS","GS-L","GT","Signature","PHEV","Other"],
    "Mazda3":   ["GX","GS","GT","Turbo","Other"],
    "MX-30":    ["GS","Other"],
    "MX-5":     ["GS","GS-P","GT","Other"],
    "Other":    ["Other"],
  },
  "Mercedes-Benz": {
    "A-Class":  ["A 220","A 220 4MATIC","AMG A 35","Other"],
    "C-Class":  ["C 300","C 300 4MATIC","AMG C 43","AMG C 63 S E","Other"],
    "CLA":      ["CLA 250","AMG CLA 35","AMG CLA 45","Other"],
    "CLS":      ["CLS 450","AMG CLS 53","Other"],
    "E-Class":  ["E 350","E 450","AMG E 53","AMG E 63 S","Other"],
    "EQB":      ["250+","300 4MATIC","350 4MATIC","Other"],
    "EQE":      ["350 4MATIC","500 4MATIC","AMG","Other"],
    "EQS":      ["450 4MATIC","580 4MATIC","AMG","Other"],
    "G-Class":  ["G 550","AMG G 63","Other"],
    "GLA":      ["GLA 250","AMG GLA 35","AMG GLA 45","Other"],
    "GLB":      ["GLB 250","AMG GLB 35","Other"],
    "GLC":      ["GLC 300","AMG GLC 43","AMG GLC 63","Other"],
    "GLE":      ["GLE 350","GLE 450","GLE 580","AMG GLE 53","AMG GLE 63 S","Other"],
    "GLS":      ["GLS 450","GLS 580","AMG GLS 63","Maybach","Other"],
    "Sprinter": ["1500","2500","3500","4500","Other"],
    "Other":    ["Other"],
  },
  "Mini": {
    "Cooper":   ["Classic","Signature","Iconic","JCW","SE Electric","Other"],
    "Countryman":["Classic","Signature","Iconic","JCW","SE Electric","Other"],
    "Other":    ["Other"],
  },
  "Mitsubishi": {
    "Eclipse Cross":["ES","SE","LE","SEL","GT","Other"],
    "Mirage":   ["ES","SE","GT","Other"],
    "Outlander":["ES","SE","LE","SEL","GT","Other"],
    "Outlander PHEV":["ES","LE","SEL","GT","Other"],
    "RVR":      ["ES","SE","LE","GT","Other"],
    "Other":    ["Other"],
  },
  "Nissan": {
    "Altima":   ["S","SV","SR","SL","Platinum","Other"],
    "Ariya":    ["Engage","Venture+","Evolve+","Empower+","Platinum+","Other"],
    "Armada":   ["SV","SL","Platinum","Other"],
    "Frontier": ["S","SV","Pro-4X","Pro-X","SL","Other"],
    "Kicks":    ["S","SV","SR","Other"],
    "Leaf":     ["S","SV Plus","Other"],
    "Murano":   ["S","SV","SL","Platinum","Other"],
    "Pathfinder":["S","SV","SL","Platinum","Rock Creek","Other"],
    "Rogue":    ["S","SV","SL","Platinum","Other"],
    "Sentra":   ["S","SV","SR","Other"],
    "Titan":    ["S","SV","Pro-4X","Platinum Reserve","Other"],
    "Versa":    ["S","SV","SR","Other"],
    "Z":        ["Sport","Performance","Nismo","Other"],
    "Other":    ["Other"],
  },
  "Polestar": {
    "Polestar 2":["Long Range Single Motor","Long Range Dual Motor","Other"],
    "Polestar 3":["Long Range Dual Motor","Performance","Other"],
    "Other":    ["Other"],
  },
  "Porsche": {
    "718 Boxster":["Base","S","GTS 4.0","Spyder","Other"],
    "718 Cayman":["Base","S","GTS 4.0","GT4","GT4 RS","Other"],
    "911":      ["Carrera","Carrera S","Carrera 4S","Targa 4S","Turbo","Turbo S","GT3","GT3 RS","Other"],
    "Cayenne":  ["Base","E-Hybrid","S","GTS","Turbo E-Hybrid","Other"],
    "Macan":    ["Base","T","S","GTS","Turbo","Other"],
    "Panamera": ["Base","4","4S","GTS","Turbo E-Hybrid","Other"],
    "Taycan":   ["Base","4S","GTS","Turbo","Turbo S","Other"],
    "Other":    ["Other"],
  },
  "Ram": {
    "1500":     ["Tradesman","Big Horn","Laramie","Rebel","Limited Longhorn","Limited","TRX","Other"],
    "2500":     ["Tradesman","Big Horn","Laramie","Limited Longhorn","Limited","Power Wagon","Rebel","Other"],
    "3500":     ["Tradesman","Big Horn","Laramie","Limited Longhorn","Limited","Other"],
    "ProMaster":["1500","2500","3500","Other"],
    "Other":    ["Other"],
  },
  "Subaru": {
    "Ascent":   ["Convenience","Touring","Limited","Premier","Onyx","Other"],
    "BRZ":      ["Sport-Tech","tS","Other"],
    "Crosstrek":["Convenience","Touring","Sport","Limited","Wilderness","Other"],
    "Forester": ["Convenience","Touring","Sport","Limited","Wilderness","Premier","Other"],
    "Impreza":  ["Convenience","Touring","Sport","RS","Other"],
    "Legacy":   ["Touring","Sport","Limited","Premier GT","Other"],
    "Outback":  ["Convenience","Touring","Limited","Premier","Wilderness","Onyx","Other"],
    "Solterra": ["AWD","Luxury","Technology","Other"],
    "WRX":      ["Base","Sport","Sport-Tech","tS","Other"],
    "Other":    ["Other"],
  },
  "Tesla": {
    "Cybertruck":["RWD","All-Wheel Drive","Cyberbeast","Other"],
    "Model 3":  ["Standard Range","Long Range","Performance","Other"],
    "Model S":  ["Long Range","Plaid","Other"],
    "Model X":  ["Long Range","Plaid","Other"],
    "Model Y":  ["Standard Range","Long Range","Performance","Other"],
    "Other":    ["Other"],
  },
  "Toyota": {
    "4Runner":  ["SR5","TRD Sport","TRD Off-Road","Limited","TRD Pro","TRDx","Other"],
    "bZ4X":     ["LE","XLE","Limited","Other"],
    "Camry":    ["LE","SE","XLE","XSE","TRD","Hybrid LE","Hybrid SE","Hybrid XLE","Hybrid XSE","Other"],
    "Corolla":  ["L","LE","SE","XLE","XSE","Hybrid LE","Hybrid SE","Hybrid XSE","Other"],
    "Corolla Cross":["L","LE","XLE","Hybrid SE","Hybrid XSE","Other"],
    "Crown":    ["XLE","Limited","Platinum","Other"],
    "GR86":     ["Base","Premium","Other"],
    "GR Corolla":["Core","Circuit","Premium","Morizo","Other"],
    "GR Supra": ["3.0","3.0 Premium","45th Anniversary","Other"],
    "Grand Highlander":["XLE","Limited","Platinum","Hybrid Limited","Hybrid MAX Platinum","Other"],
    "Highlander":["LE","XLE","Limited","Platinum","XSE","Hybrid XLE","Hybrid Limited","Hybrid Platinum","Other"],
    "Mirai":    ["XLE","Limited","Other"],
    "Prius":    ["LE","XLE","Limited","Prime SE","Prime XSE","Other"],
    "RAV4":     ["LE","XLE","XLE Premium","Limited","TRD Off-Road","Hybrid LE","Hybrid XLE","Hybrid Limited","Prime SE","Prime XSE","Other"],
    "Sequoia":  ["SR5","Limited","Platinum","TRD Pro","Capstone","Other"],
    "Sienna":   ["LE","XLE","XSE","Limited","Platinum","Other"],
    "Tacoma":   ["SR","SR5","TRD PreRunner","TRD Sport","TRD Off-Road","Limited","Trailhunter","TRD Pro","Other"],
    "Tundra":   ["SR","SR5","Limited","Platinum","1794 Edition","TRD Pro","Capstone","Other"],
    "Venza":    ["LE","XLE","Limited","Other"],
    "Other":    ["Other"],
  },
  "Volkswagen": {
    "Atlas":    ["Trendline","Comfortline","Highline","Execline","Peak Edition","Other"],
    "Atlas Cross Sport":["Trendline","Comfortline","Highline","Execline","Other"],
    "GTI":      ["Base","Autobahn","Other"],
    "Golf R":   ["Base","Other"],
    "ID.4":     ["Pro","Pro S","Other"],
    "Jetta":    ["Trendline","Comfortline","Highline","GLI","Other"],
    "Taos":     ["Trendline","Comfortline","Highline","Other"],
    "Tiguan":   ["Trendline","Comfortline","Highline","R-Line","Other"],
    "Other":    ["Other"],
  },
  "Volvo": {
    "C40":      ["Core","Plus","Ultimate","Other"],
    "S60":      ["Core","Plus","Ultimate","Polestar Engineered","Other"],
    "S90":      ["Core","Plus","Ultimate","Other"],
    "V60":      ["Core Cross Country","Plus Cross Country","Ultimate Cross Country","Other"],
    "V90":      ["Cross Country Plus","Cross Country Ultimate","Other"],
    "XC40":     ["Core","Plus","Ultimate","Other"],
    "XC60":     ["Core","Plus","Ultimate","Polestar Engineered","Other"],
    "XC90":     ["Core","Plus","Ultimate","Other"],
    "EX30":     ["Core","Plus","Ultra","Other"],
    "EX90":     ["Plus","Ultra","Other"],
    "Other":    ["Other"],
  },
  "Other": {
    "Other":    ["Other"],
  },
};

// Build alphabetically-sorted MAKES with "Other" guaranteed last
const MAKES = (() => {
  const keys = Object.keys(VEHICLES).filter(k => k !== "Other").sort((a, b) => a.localeCompare(b));
  keys.push("Other");
  return keys;
})();

// Models alphabetical with "Other" last
const MODELS_FOR = (make) => {
  if (!make || !VEHICLES[make]) return [];
  const keys = Object.keys(VEHICLES[make]).filter(k => k !== "Other").sort((a, b) => a.localeCompare(b));
  keys.push("Other");
  return keys;
};

// Trims as authored, "Other" already last in source data
const TRIMS_FOR = (make, model) => (make && model && VEHICLES[make]?.[model]) ? VEHICLES[make][model] : [];

// Years: current year + 1 down to 1995
const CURRENT_YEAR = 2026;
const YEARS = Array.from({ length: CURRENT_YEAR - 1994 }, (_, i) => String(CURRENT_YEAR + 1 - i));

Object.assign(window, {
  HERO_VARIANTS, FAQ, HOW_IT_WORKS, SAMPLE_PREFILL,
  VEHICLES, MAKES, MODELS_FOR, TRIMS_FOR, YEARS,
  fmt, parseNum, computeDelta, detectSource,
});

// v5
