import { useEffect, useRef, useState } from "react";

// Flag emoji from ISO 2-letter country code
function countryFlag(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

type Region =
  | "All"
  | "Asia"
  | "Europe"
  | "Americas"
  | "Africa"
  | "Oceania"
  | "Middle East";

interface CountryShape {
  code: string;
  name: string;
  region: Region;
  // SVG path(s) - simplified but recognizable outlines on a 1000x500 Mercator-like projection
  d: string;
  // label position
  lx: number;
  ly: number;
}

// Simplified but shaped country outlines on 1000x500 viewbox
// Each path is a recognizable simplified polygon of the country's shape
const COUNTRIES: CountryShape[] = [
  // ── North America ──────────────────────────────────────────────
  {
    code: "CA",
    name: "Canada",
    region: "Americas",
    lx: 175,
    ly: 95,
    d: "M80,60 L95,55 L130,52 L160,48 L200,45 L240,42 L260,40 L280,42 L295,50 L290,65 L275,75 L255,80 L235,85 L215,88 L200,92 L185,88 L170,90 L155,95 L135,98 L110,100 L90,95 Z",
  },
  {
    code: "US",
    name: "United States",
    region: "Americas",
    lx: 175,
    ly: 135,
    d: "M90,105 L135,102 L175,100 L215,100 L255,95 L280,95 L285,110 L280,120 L260,125 L240,128 L215,130 L190,132 L165,132 L140,128 L120,125 L100,120 Z",
  },
  {
    code: "MX",
    name: "Mexico",
    region: "Americas",
    lx: 160,
    ly: 155,
    d: "M105,132 L150,130 L185,132 L205,135 L215,145 L210,155 L195,162 L175,165 L155,162 L138,155 L120,148 L108,140 Z",
  },
  {
    code: "GT",
    name: "Guatemala",
    region: "Americas",
    lx: 177,
    ly: 168,
    d: "M175,165 L188,163 L195,168 L192,175 L182,177 L175,172 Z",
  },
  {
    code: "CU",
    name: "Cuba",
    region: "Americas",
    lx: 210,
    ly: 158,
    d: "M195,153 L215,151 L228,154 L225,160 L210,162 L197,159 Z",
  },
  {
    code: "CO",
    name: "Colombia",
    region: "Americas",
    lx: 205,
    ly: 210,
    d: "M185,195 L205,192 L220,195 L225,208 L220,222 L205,228 L190,222 L182,210 Z",
  },
  {
    code: "VE",
    name: "Venezuela",
    region: "Americas",
    lx: 225,
    ly: 205,
    d: "M220,195 L245,193 L258,198 L255,210 L240,215 L225,212 L218,205 Z",
  },
  {
    code: "EC",
    name: "Ecuador",
    region: "Americas",
    lx: 188,
    ly: 228,
    d: "M182,222 L198,220 L205,228 L202,238 L190,240 L182,233 Z",
  },
  {
    code: "PE",
    name: "Peru",
    region: "Americas",
    lx: 196,
    ly: 255,
    d: "M182,235 L205,230 L218,238 L220,255 L215,268 L200,275 L185,268 L180,252 Z",
  },
  {
    code: "BR",
    name: "Brazil",
    region: "Americas",
    lx: 245,
    ly: 255,
    d: "M220,200 L255,195 L285,200 L300,215 L305,240 L300,265 L285,280 L265,288 L245,285 L225,275 L215,258 L218,238 L225,218 Z",
  },
  {
    code: "BO",
    name: "Bolivia",
    region: "Americas",
    lx: 218,
    ly: 268,
    d: "M205,250 L222,245 L235,252 L235,268 L225,278 L210,275 L203,262 Z",
  },
  {
    code: "PY",
    name: "Paraguay",
    region: "Americas",
    lx: 232,
    ly: 285,
    d: "M220,275 L235,272 L245,278 L242,292 L228,295 L218,288 Z",
  },
  {
    code: "AR",
    name: "Argentina",
    region: "Americas",
    lx: 222,
    ly: 320,
    d: "M210,285 L230,280 L248,285 L250,305 L248,325 L238,345 L222,355 L210,342 L205,320 L207,300 Z",
  },
  {
    code: "CL",
    name: "Chile",
    region: "Americas",
    lx: 204,
    ly: 320,
    d: "M205,272 L215,270 L218,290 L216,315 L210,340 L200,355 L196,335 L198,308 L200,285 Z",
  },
  {
    code: "UY",
    name: "Uruguay",
    region: "Americas",
    lx: 243,
    ly: 303,
    d: "M238,295 L252,292 L258,300 L252,310 L240,312 L235,305 Z",
  },

  // ── Europe ─────────────────────────────────────────────────────
  {
    code: "IS",
    name: "Iceland",
    region: "Europe",
    lx: 415,
    ly: 60,
    d: "M408,55 L425,52 L432,58 L428,65 L415,68 L408,62 Z",
  },
  {
    code: "NO",
    name: "Norway",
    region: "Europe",
    lx: 490,
    ly: 68,
    d: "M478,60 L490,55 L502,58 L505,68 L498,78 L485,82 L475,75 L474,65 Z",
  },
  {
    code: "SE",
    name: "Sweden",
    region: "Europe",
    lx: 498,
    ly: 78,
    d: "M490,68 L505,65 L512,72 L510,88 L502,96 L492,92 L486,82 Z",
  },
  {
    code: "FI",
    name: "Finland",
    region: "Europe",
    lx: 515,
    ly: 68,
    d: "M505,58 L522,55 L530,62 L528,75 L518,82 L508,78 L504,68 Z",
  },
  {
    code: "DK",
    name: "Denmark",
    region: "Europe",
    lx: 487,
    ly: 90,
    d: "M482,86 L492,84 L495,90 L490,96 L482,94 Z",
  },
  {
    code: "GB",
    name: "United Kingdom",
    region: "Europe",
    lx: 458,
    ly: 90,
    d: "M450,80 L460,76 L468,82 L466,92 L458,98 L450,94 L446,86 Z",
  },
  {
    code: "IE",
    name: "Ireland",
    region: "Europe",
    lx: 443,
    ly: 90,
    d: "M440,85 L448,82 L452,88 L448,96 L440,95 Z",
  },
  {
    code: "PT",
    name: "Portugal",
    region: "Europe",
    lx: 446,
    ly: 115,
    d: "M444,108 L452,106 L455,112 L452,120 L444,120 Z",
  },
  {
    code: "ES",
    name: "Spain",
    region: "Europe",
    lx: 462,
    ly: 112,
    d: "M452,104 L478,101 L485,106 L482,116 L468,120 L452,118 Z",
  },
  {
    code: "FR",
    name: "France",
    region: "Europe",
    lx: 472,
    ly: 102,
    d: "M460,96 L480,94 L488,100 L485,112 L470,114 L460,108 Z",
  },
  {
    code: "BE",
    name: "Belgium",
    region: "Europe",
    lx: 476,
    ly: 94,
    d: "M472,90 L482,88 L485,94 L478,98 L472,96 Z",
  },
  {
    code: "NL",
    name: "Netherlands",
    region: "Europe",
    lx: 480,
    ly: 87,
    d: "M477,84 L487,82 L490,88 L482,92 L476,89 Z",
  },
  {
    code: "DE",
    name: "Germany",
    region: "Europe",
    lx: 490,
    ly: 97,
    d: "M482,88 L498,86 L504,92 L502,104 L490,108 L480,104 L478,96 Z",
  },
  {
    code: "CH",
    name: "Switzerland",
    region: "Europe",
    lx: 484,
    ly: 108,
    d: "M480,104 L492,102 L496,108 L490,112 L480,110 Z",
  },
  {
    code: "AT",
    name: "Austria",
    region: "Europe",
    lx: 496,
    ly: 104,
    d: "M492,100 L508,98 L512,104 L506,108 L492,106 Z",
  },
  {
    code: "IT",
    name: "Italy",
    region: "Europe",
    lx: 496,
    ly: 115,
    d: "M485,108 L498,106 L505,112 L504,122 L498,130 L490,128 L484,120 Z",
  },
  {
    code: "PL",
    name: "Poland",
    region: "Europe",
    lx: 506,
    ly: 92,
    d: "M498,86 L518,84 L522,90 L518,100 L504,102 L498,96 Z",
  },
  {
    code: "CZ",
    name: "Czech Republic",
    region: "Europe",
    lx: 502,
    ly: 100,
    d: "M496,96 L512,94 L516,100 L508,106 L496,104 Z",
  },
  {
    code: "HU",
    name: "Hungary",
    region: "Europe",
    lx: 508,
    ly: 106,
    d: "M502,102 L518,100 L522,106 L515,112 L502,110 Z",
  },
  {
    code: "RO",
    name: "Romania",
    region: "Europe",
    lx: 520,
    ly: 104,
    d: "M514,98 L530,96 L535,103 L530,112 L516,114 L512,106 Z",
  },
  {
    code: "BG",
    name: "Bulgaria",
    region: "Europe",
    lx: 520,
    ly: 114,
    d: "M514,110 L528,108 L532,114 L524,120 L514,118 Z",
  },
  {
    code: "GR",
    name: "Greece",
    region: "Europe",
    lx: 516,
    ly: 122,
    d: "M510,116 L524,114 L528,120 L522,130 L512,130 L508,122 Z",
  },
  {
    code: "HR",
    name: "Croatia",
    region: "Europe",
    lx: 507,
    ly: 112,
    d: "M502,108 L515,106 L518,112 L510,117 L503,115 Z",
  },
  {
    code: "RS",
    name: "Serbia",
    region: "Europe",
    lx: 514,
    ly: 110,
    d: "M510,106 L522,104 L525,111 L518,116 L510,114 Z",
  },
  {
    code: "UA",
    name: "Ukraine",
    region: "Europe",
    lx: 530,
    ly: 95,
    d: "M518,88 L548,86 L555,92 L550,102 L530,106 L518,100 Z",
  },
  {
    code: "BY",
    name: "Belarus",
    region: "Europe",
    lx: 528,
    ly: 86,
    d: "M520,82 L538,80 L543,86 L538,94 L520,95 L517,88 Z",
  },
  {
    code: "MD",
    name: "Moldova",
    region: "Europe",
    lx: 537,
    ly: 102,
    d: "M533,98 L542,97 L544,103 L538,107 L533,104 Z",
  },
  {
    code: "LT",
    name: "Lithuania",
    region: "Europe",
    lx: 523,
    ly: 80,
    d: "M518,76 L530,75 L534,80 L528,86 L518,85 Z",
  },
  {
    code: "LV",
    name: "Latvia",
    region: "Europe",
    lx: 524,
    ly: 73,
    d: "M518,70 L532,68 L536,74 L528,78 L518,77 Z",
  },
  {
    code: "EE",
    name: "Estonia",
    region: "Europe",
    lx: 524,
    ly: 66,
    d: "M519,63 L532,61 L535,67 L526,71 L519,69 Z",
  },
  {
    code: "RU",
    name: "Russia",
    region: "Europe",
    lx: 620,
    ly: 72,
    d: "M530,55 L620,50 L720,48 L760,52 L770,60 L760,72 L720,78 L660,80 L600,78 L550,75 L530,68 Z",
  },

  // ── Middle East ────────────────────────────────────────────────
  {
    code: "TR",
    name: "Turkey",
    region: "Middle East",
    lx: 547,
    ly: 112,
    d: "M530,107 L558,104 L568,108 L565,118 L548,122 L530,118 Z",
  },
  {
    code: "GE",
    name: "Georgia",
    region: "Middle East",
    lx: 562,
    ly: 107,
    d: "M556,103 L570,101 L574,107 L565,111 L556,109 Z",
  },
  {
    code: "AM",
    name: "Armenia",
    region: "Middle East",
    lx: 567,
    ly: 113,
    d: "M562,110 L572,108 L575,114 L568,118 L562,115 Z",
  },
  {
    code: "AZ",
    name: "Azerbaijan",
    region: "Middle East",
    lx: 574,
    ly: 110,
    d: "M569,106 L580,105 L584,111 L577,116 L569,113 Z",
  },
  {
    code: "SY",
    name: "Syria",
    region: "Middle East",
    lx: 556,
    ly: 122,
    d: "M548,118 L564,116 L568,122 L562,128 L548,127 Z",
  },
  {
    code: "LB",
    name: "Lebanon",
    region: "Middle East",
    lx: 551,
    ly: 128,
    d: "M549,124 L556,123 L558,128 L553,131 L549,129 Z",
  },
  {
    code: "IL",
    name: "Israel",
    region: "Middle East",
    lx: 551,
    ly: 133,
    d: "M548,129 L556,128 L558,134 L552,138 L547,135 Z",
  },
  {
    code: "JO",
    name: "Jordan",
    region: "Middle East",
    lx: 557,
    ly: 133,
    d: "M554,128 L566,127 L569,133 L562,140 L554,138 Z",
  },
  {
    code: "IQ",
    name: "Iraq",
    region: "Middle East",
    lx: 566,
    ly: 127,
    d: "M560,120 L578,118 L582,126 L576,135 L560,136 Z",
  },
  {
    code: "IR",
    name: "Iran",
    region: "Middle East",
    lx: 582,
    ly: 122,
    d: "M572,113 L600,110 L608,118 L605,132 L585,138 L570,133 L568,122 Z",
  },
  {
    code: "KW",
    name: "Kuwait",
    region: "Middle East",
    lx: 574,
    ly: 137,
    d: "M571,134 L578,133 L580,138 L574,140 Z",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    region: "Middle East",
    lx: 572,
    ly: 150,
    d: "M556,135 L588,132 L600,140 L598,162 L578,170 L558,162 L550,148 Z",
  },
  {
    code: "AE",
    name: "UAE",
    region: "Middle East",
    lx: 596,
    ly: 152,
    d: "M590,148 L604,146 L608,152 L600,158 L589,156 Z",
  },
  {
    code: "OM",
    name: "Oman",
    region: "Middle East",
    lx: 604,
    ly: 158,
    d: "M600,148 L614,146 L618,156 L612,168 L600,165 Z",
  },
  {
    code: "YE",
    name: "Yemen",
    region: "Middle East",
    lx: 578,
    ly: 168,
    d: "M558,162 L590,160 L598,165 L590,175 L565,178 L555,170 Z",
  },
  {
    code: "QA",
    name: "Qatar",
    region: "Middle East",
    lx: 592,
    ly: 148,
    d: "M589,144 L595,143 L597,149 L592,152 L589,148 Z",
  },
  {
    code: "BH",
    name: "Bahrain",
    region: "Middle East",
    lx: 586,
    ly: 147,
    d: "M584,144 L588,143 L589,147 L585,148 Z",
  },

  // ── Africa ─────────────────────────────────────────────────────
  {
    code: "MA",
    name: "Morocco",
    region: "Africa",
    lx: 453,
    ly: 125,
    d: "M444,118 L462,116 L466,124 L460,134 L446,135 L440,127 Z",
  },
  {
    code: "DZ",
    name: "Algeria",
    region: "Africa",
    lx: 472,
    ly: 130,
    d: "M462,118 L490,116 L495,126 L490,145 L466,148 L460,136 Z",
  },
  {
    code: "TN",
    name: "Tunisia",
    region: "Africa",
    lx: 485,
    ly: 120,
    d: "M482,115 L492,114 L495,121 L490,130 L482,128 Z",
  },
  {
    code: "LY",
    name: "Libya",
    region: "Africa",
    lx: 498,
    ly: 128,
    d: "M490,118 L520,116 L526,124 L524,148 L496,152 L490,138 Z",
  },
  {
    code: "EG",
    name: "Egypt",
    region: "Africa",
    lx: 533,
    ly: 130,
    d: "M520,118 L545,116 L549,124 L547,145 L522,147 L518,135 Z",
  },
  {
    code: "SD",
    name: "Sudan",
    region: "Africa",
    lx: 540,
    ly: 155,
    d: "M524,145 L550,143 L556,152 L552,172 L530,178 L520,165 Z",
  },
  {
    code: "SS",
    name: "South Sudan",
    region: "Africa",
    lx: 540,
    ly: 175,
    d: "M524,170 L550,168 L554,176 L548,186 L524,187 L520,179 Z",
  },
  {
    code: "ET",
    name: "Ethiopia",
    region: "Africa",
    lx: 553,
    ly: 178,
    d: "M546,170 L568,168 L574,176 L568,188 L550,192 L543,183 Z",
  },
  {
    code: "SO",
    name: "Somalia",
    region: "Africa",
    lx: 571,
    ly: 185,
    d: "M564,174 L578,172 L585,180 L580,198 L566,202 L558,192 Z",
  },
  {
    code: "KE",
    name: "Kenya",
    region: "Africa",
    lx: 556,
    ly: 195,
    d: "M547,185 L564,183 L568,192 L562,206 L548,208 L543,198 Z",
  },
  {
    code: "UG",
    name: "Uganda",
    region: "Africa",
    lx: 548,
    ly: 193,
    d: "M541,188 L554,186 L558,193 L552,200 L540,200 Z",
  },
  {
    code: "TZ",
    name: "Tanzania",
    region: "Africa",
    lx: 553,
    ly: 208,
    d: "M541,200 L562,198 L566,207 L560,220 L542,222 L537,212 Z",
  },
  {
    code: "RW",
    name: "Rwanda",
    region: "Africa",
    lx: 544,
    ly: 202,
    d: "M540,199 L548,198 L551,203 L545,207 L540,205 Z",
  },
  {
    code: "MZ",
    name: "Mozambique",
    region: "Africa",
    lx: 552,
    ly: 230,
    d: "M543,220 L558,218 L562,228 L556,248 L544,250 L538,238 Z",
  },
  {
    code: "ZA",
    name: "South Africa",
    region: "Africa",
    lx: 536,
    ly: 255,
    d: "M520,245 L548,243 L556,252 L550,268 L528,272 L515,262 Z",
  },
  {
    code: "NA",
    name: "Namibia",
    region: "Africa",
    lx: 525,
    ly: 242,
    d: "M514,232 L534,230 L538,240 L532,252 L514,254 L508,244 Z",
  },
  {
    code: "BW",
    name: "Botswana",
    region: "Africa",
    lx: 537,
    ly: 246,
    d: "M528,238 L546,237 L550,244 L544,254 L528,255 L524,247 Z",
  },
  {
    code: "ZW",
    name: "Zimbabwe",
    region: "Africa",
    lx: 545,
    ly: 237,
    d: "M537,231 L552,229 L557,236 L550,244 L536,245 Z",
  },
  {
    code: "ZM",
    name: "Zambia",
    region: "Africa",
    lx: 536,
    ly: 225,
    d: "M524,217 L548,215 L554,224 L548,234 L524,236 L518,226 Z",
  },
  {
    code: "AO",
    name: "Angola",
    region: "Africa",
    lx: 518,
    ly: 215,
    d: "M505,205 L528,203 L534,212 L528,228 L506,230 L498,220 Z",
  },
  {
    code: "CD",
    name: "DR Congo",
    region: "Africa",
    lx: 527,
    ly: 205,
    d: "M512,192 L540,190 L548,200 L542,220 L516,222 L506,212 Z",
  },
  {
    code: "CG",
    name: "Congo",
    region: "Africa",
    lx: 512,
    ly: 195,
    d: "M506,188 L520,186 L525,193 L518,202 L506,202 Z",
  },
  {
    code: "CM",
    name: "Cameroon",
    region: "Africa",
    lx: 502,
    ly: 182,
    d: "M494,176 L512,174 L517,182 L510,192 L494,193 Z",
  },
  {
    code: "NG",
    name: "Nigeria",
    region: "Africa",
    lx: 490,
    ly: 175,
    d: "M480,165 L506,163 L512,172 L505,184 L480,186 L472,177 Z",
  },
  {
    code: "NE",
    name: "Niger",
    region: "Africa",
    lx: 483,
    ly: 155,
    d: "M466,145 L504,142 L510,152 L502,166 L468,168 L460,158 Z",
  },
  {
    code: "ML",
    name: "Mali",
    region: "Africa",
    lx: 460,
    ly: 152,
    d: "M445,140 L474,138 L480,148 L472,168 L448,170 L438,160 Z",
  },
  {
    code: "SN",
    name: "Senegal",
    region: "Africa",
    lx: 435,
    ly: 162,
    d: "M430,158 L446,157 L449,163 L443,170 L430,168 Z",
  },
  {
    code: "GH",
    name: "Ghana",
    region: "Africa",
    lx: 462,
    ly: 172,
    d: "M456,166 L470,165 L473,172 L467,181 L456,181 L452,174 Z",
  },
  {
    code: "CI",
    name: "Ivory Coast",
    region: "Africa",
    lx: 454,
    ly: 172,
    d: "M445,165 L460,164 L464,172 L458,181 L444,182 L440,174 Z",
  },
  {
    code: "TD",
    name: "Chad",
    region: "Africa",
    lx: 504,
    ly: 156,
    d: "M496,142 L518,140 L522,150 L516,170 L496,172 L490,162 Z",
  },
  {
    code: "CF",
    name: "Central African Republic",
    region: "Africa",
    lx: 514,
    ly: 178,
    d: "M500,172 L528,170 L533,178 L525,187 L502,188 L497,180 Z",
  },
  {
    code: "MG",
    name: "Madagascar",
    region: "Africa",
    lx: 568,
    ly: 225,
    d: "M562,212 L572,210 L578,220 L574,240 L563,244 L557,232 Z",
  },

  // ── Asia ───────────────────────────────────────────────────────
  {
    code: "KZ",
    name: "Kazakhstan",
    region: "Asia",
    lx: 620,
    ly: 92,
    d: "M580,82 L640,78 L655,86 L648,102 L610,108 L580,105 Z",
  },
  {
    code: "TM",
    name: "Turkmenistan",
    region: "Asia",
    lx: 600,
    ly: 115,
    d: "M584,108 L612,106 L618,113 L612,122 L585,124 Z",
  },
  {
    code: "UZ",
    name: "Uzbekistan",
    region: "Asia",
    lx: 612,
    ly: 108,
    d: "M600,103 L624,101 L629,108 L622,116 L600,118 Z",
  },
  {
    code: "KG",
    name: "Kyrgyzstan",
    region: "Asia",
    lx: 632,
    ly: 106,
    d: "M624,102 L640,100 L644,107 L636,113 L624,111 Z",
  },
  {
    code: "TJ",
    name: "Tajikistan",
    region: "Asia",
    lx: 632,
    ly: 115,
    d: "M624,110 L638,108 L642,115 L634,121 L624,118 Z",
  },
  {
    code: "AF",
    name: "Afghanistan",
    region: "Asia",
    lx: 622,
    ly: 122,
    d: "M606,114 L636,111 L642,120 L635,132 L607,134 L600,125 Z",
  },
  {
    code: "PK",
    name: "Pakistan",
    region: "Asia",
    lx: 630,
    ly: 135,
    d: "M614,126 L644,123 L650,132 L644,148 L618,152 L610,140 Z",
  },
  {
    code: "IN",
    name: "India",
    region: "Asia",
    lx: 645,
    ly: 152,
    d: "M628,140 L660,138 L668,148 L665,172 L645,185 L625,178 L618,160 Z",
  },
  {
    code: "NP",
    name: "Nepal",
    region: "Asia",
    lx: 658,
    ly: 138,
    d: "M646,134 L668,132 L672,138 L660,143 L646,141 Z",
  },
  {
    code: "BD",
    name: "Bangladesh",
    region: "Asia",
    lx: 673,
    ly: 149,
    d: "M665,144 L678,142 L682,149 L675,157 L664,155 Z",
  },
  {
    code: "LK",
    name: "Sri Lanka",
    region: "Asia",
    lx: 651,
    ly: 180,
    d: "M647,176 L655,174 L658,181 L652,187 L647,183 Z",
  },
  {
    code: "MM",
    name: "Myanmar",
    region: "Asia",
    lx: 681,
    ly: 152,
    d: "M673,140 L690,138 L696,148 L692,165 L676,168 L669,157 Z",
  },
  {
    code: "TH",
    name: "Thailand",
    region: "Asia",
    lx: 690,
    ly: 168,
    d: "M682,158 L700,156 L705,165 L700,180 L685,183 L678,173 Z",
  },
  {
    code: "LA",
    name: "Laos",
    region: "Asia",
    lx: 697,
    ly: 158,
    d: "M690,150 L705,148 L710,156 L704,168 L690,168 Z",
  },
  {
    code: "VN",
    name: "Vietnam",
    region: "Asia",
    lx: 708,
    ly: 162,
    d: "M702,148 L718,146 L722,156 L718,178 L704,180 L698,168 Z",
  },
  {
    code: "KH",
    name: "Cambodia",
    region: "Asia",
    lx: 700,
    ly: 175,
    d: "M694,170 L710,168 L714,175 L708,183 L694,183 Z",
  },
  {
    code: "MY",
    name: "Malaysia",
    region: "Asia",
    lx: 700,
    ly: 190,
    d: "M690,185 L720,183 L724,190 L716,197 L690,197 Z",
  },
  {
    code: "SG",
    name: "Singapore",
    region: "Asia",
    lx: 706,
    ly: 198,
    d: "M703,196 L710,195 L712,199 L706,201 Z",
  },
  {
    code: "ID",
    name: "Indonesia",
    region: "Asia",
    lx: 718,
    ly: 205,
    d: "M695,198 L740,195 L760,200 L765,210 L740,215 L700,213 L690,207 Z",
  },
  {
    code: "PH",
    name: "Philippines",
    region: "Asia",
    lx: 738,
    ly: 175,
    d: "M730,165 L746,163 L752,172 L746,185 L730,187 L724,177 Z",
  },
  {
    code: "TW",
    name: "Taiwan",
    region: "Asia",
    lx: 742,
    ly: 148,
    d: "M738,143 L746,141 L750,148 L744,155 L738,152 Z",
  },
  {
    code: "CN",
    name: "China",
    region: "Asia",
    lx: 702,
    ly: 118,
    d: "M645,88 L700,85 L740,90 L752,100 L748,125 L720,138 L688,140 L655,135 L638,122 L640,105 Z",
  },
  {
    code: "MN",
    name: "Mongolia",
    region: "Asia",
    lx: 700,
    ly: 85,
    d: "M650,78 L716,74 L730,80 L725,93 L695,98 L650,98 Z",
  },
  {
    code: "KP",
    name: "North Korea",
    region: "Asia",
    lx: 742,
    ly: 105,
    d: "M734,98 L750,96 L756,103 L750,112 L734,113 Z",
  },
  {
    code: "KR",
    name: "South Korea",
    region: "Asia",
    lx: 747,
    ly: 113,
    d: "M741,109 L754,107 L758,113 L752,120 L740,119 Z",
  },
  {
    code: "JP",
    name: "Japan",
    region: "Asia",
    lx: 762,
    ly: 108,
    d: "M756,96 L770,94 L776,103 L770,115 L756,117 L750,108 Z",
  },

  // ── Oceania ────────────────────────────────────────────────────
  {
    code: "AU",
    name: "Australia",
    region: "Oceania",
    lx: 760,
    ly: 252,
    d: "M730,225 L785,220 L808,230 L812,255 L800,272 L765,278 L736,268 L722,252 Z",
  },
  {
    code: "NZ",
    name: "New Zealand",
    region: "Oceania",
    lx: 835,
    ly: 272,
    d: "M828,263 L840,260 L845,270 L838,282 L828,280 Z",
  },
  {
    code: "PG",
    name: "Papua New Guinea",
    region: "Oceania",
    lx: 782,
    ly: 210,
    d: "M770,203 L795,200 L802,208 L796,218 L771,219 Z",
  },
];

const REGIONS: Region[] = [
  "All",
  "Asia",
  "Europe",
  "Americas",
  "Africa",
  "Oceania",
  "Middle East",
];

const REGION_COLORS: Record<
  Region,
  { fill: string; glow: string; hover: string; active: string }
> = {
  All: {
    fill: "#1a4a6a",
    glow: "#00d4ff",
    hover: "#00ffcc",
    active: "#ff4444",
  },
  Asia: {
    fill: "#1a3a5a",
    glow: "#00aaff",
    hover: "#00e5ff",
    active: "#0088ff",
  },
  Europe: {
    fill: "#2a2a5a",
    glow: "#8888ff",
    hover: "#aaaaff",
    active: "#5555ff",
  },
  Americas: {
    fill: "#1a4a2a",
    glow: "#00cc88",
    hover: "#00ffaa",
    active: "#00aa44",
  },
  Africa: {
    fill: "#4a2a1a",
    glow: "#ffaa44",
    hover: "#ffcc66",
    active: "#ff8800",
  },
  Oceania: {
    fill: "#1a3a4a",
    glow: "#00ccaa",
    hover: "#00eebb",
    active: "#00aaaa",
  },
  "Middle East": {
    fill: "#3a2a1a",
    glow: "#ffcc44",
    hover: "#ffee88",
    active: "#ffaa00",
  },
};

interface HoverLabel {
  code: string;
  name: string;
  region: Region;
  x: number;
  y: number;
}

interface ActiveCountry {
  code: string;
  name: string;
  region: Region;
  x: number;
  y: number;
}

const VIEWBOX_W = 1000;
const VIEWBOX_H = 500;

export function WorldMapSVG() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region>("All");
  const [hoveredCountry, setHoveredCountry] = useState<HoverLabel | null>(null);
  const [activeCountry, setActiveCountry] = useState<ActiveCountry | null>(
    null,
  );
  const [glowSet, setGlowSet] = useState<Set<string>>(new Set());
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ambient glow animation
  useEffect(() => {
    const interval = setInterval(() => {
      const filtered = COUNTRIES.filter(
        (c) => selectedRegion === "All" || c.region === selectedRegion,
      );
      if (filtered.length === 0) return;
      const count = Math.min(
        Math.floor(Math.random() * 4) + 2,
        filtered.length,
      );
      const s = new Set<string>();
      while (s.size < count) {
        s.add(filtered[Math.floor(Math.random() * filtered.length)].code);
      }
      setGlowSet(s);
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedRegion]);

  const visibleCountries =
    selectedRegion === "All"
      ? COUNTRIES
      : COUNTRIES.filter((c) => c.region === selectedRegion);

  const handleMouseEnter = (
    c: CountryShape,
    e: React.MouseEvent<SVGGElement>,
  ) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const svg = e.currentTarget.closest("svg");
    if (!svg) return;
    const pt = (svg as SVGSVGElement).createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = (svg as SVGSVGElement).getScreenCTM();
    if (!ctm) return;
    const svgPt = pt.matrixTransform(ctm.inverse());
    setHoveredCountry({
      code: c.code,
      name: c.name,
      region: c.region,
      x: svgPt.x,
      y: svgPt.y,
    });
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
  };

  const handleClick = (c: CountryShape, e: React.MouseEvent<SVGGElement>) => {
    const svg = e.currentTarget.closest("svg");
    if (!svg) return;
    const pt = (svg as SVGSVGElement).createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = (svg as SVGSVGElement).getScreenCTM();
    if (!ctm) return;
    const svgPt = pt.matrixTransform(ctm.inverse());
    setActiveCountry({
      code: c.code,
      name: c.name,
      region: c.region,
      x: svgPt.x,
      y: svgPt.y,
    });
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popupTimerRef.current = setTimeout(() => setActiveCountry(null), 4500);
  };

  const getCountryColor = (
    c: CountryShape,
    isHovered: boolean,
    isActive: boolean,
    isGlowing: boolean,
  ) => {
    const col = REGION_COLORS[c.region];
    if (isActive) return col.active;
    if (isHovered) return col.hover;
    if (isGlowing) return col.glow;
    return col.fill;
  };

  const getCountryOpacity = (c: CountryShape) => {
    if (selectedRegion === "All") return 0.82;
    return c.region === selectedRegion ? 0.92 : 0.15;
  };

  return (
    <div className="w-full mt-8" ref={containerRef}>
      <style>{`
        @keyframes wmCountryGlow {
          0%,100% { opacity: 0.82; filter: brightness(1.3) drop-shadow(0 0 4px var(--wm-glow,#00d4ff)); }
          50% { opacity: 1; filter: brightness(2.2) drop-shadow(0 0 12px var(--wm-glow,#00d4ff)) drop-shadow(0 0 24px var(--wm-glow,#00d4ff88)); }
        }
        @keyframes wmCountryActive {
          0%,100% { filter: brightness(2) drop-shadow(0 0 8px #ff4444) drop-shadow(0 0 20px #ff222288); }
          50% { filter: brightness(2.8) drop-shadow(0 0 18px #ff6666) drop-shadow(0 0 40px #ff444488); }
        }
        @keyframes wmHoverPop {
          0% { opacity: 0; transform: translateY(6px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes wmScan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        @keyframes wmCornerFlicker {
          0%,100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes wmRegionPulse {
          0%,100% { box-shadow: 0 0 0 rgba(0,212,255,0); }
          50% { box-shadow: 0 0 12px rgba(0,212,255,0.5); }
        }
        .wm-country { cursor: pointer; transition: opacity 0.25s ease; }
        .wm-country path { transition: fill 0.2s ease, filter 0.2s ease; }
        .wm-country:hover path { stroke-width: 1.5 !important; }
        .wm-region-btn { transition: all 0.2s ease; }
        .wm-region-btn:hover { transform: translateY(-1px); }
        .wm-region-btn.active { transform: translateY(-2px); }
      `}</style>

      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-2 mb-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            style={{
              boxShadow: "0 0 6px #00d4ff",
              animation: "wmRegionPulse 2s ease infinite",
            }}
          />
          <span
            className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400"
            style={{ textShadow: "0 0 8px #00d4ff88" }}
          >
            Global Coverage
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            style={{
              boxShadow: "0 0 6px #00d4ff",
              animation: "wmRegionPulse 2s ease infinite 1s",
            }}
          />
        </div>
        <h3
          className="font-bold text-xl sm:text-2xl mb-1"
          style={{
            background: "linear-gradient(90deg, #00d4ff, #0099ff, #00ffcc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ClawPro Available Worldwide
        </h3>
        <p className="text-xs text-muted-foreground">
          Hover to see country name · Click to confirm availability ·{" "}
          {COUNTRIES.length}+ countries
        </p>
      </div>

      {/* Region Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {REGIONS.map((region) => {
          const col = REGION_COLORS[region];
          const isActive = selectedRegion === region;
          const count =
            region === "All"
              ? COUNTRIES.length
              : COUNTRIES.filter((c) => c.region === region).length;
          return (
            <button
              key={region}
              type="button"
              onClick={() => {
                setSelectedRegion(region);
                setActiveCountry(null);
              }}
              className={`wm-region-btn px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${isActive ? "active" : ""}`}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${col.fill}, ${col.glow}22)`
                  : "rgba(0,10,25,0.6)",
                border: isActive
                  ? `1.5px solid ${col.glow}`
                  : "1px solid rgba(255,255,255,0.1)",
                color: isActive ? col.hover : "rgba(180,200,220,0.7)",
                boxShadow: isActive
                  ? `0 0 16px ${col.glow}44, 0 0 32px ${col.glow}22`
                  : "none",
                textShadow: isActive ? `0 0 8px ${col.glow}88` : "none",
              }}
              data-ocid={`worldmap.region.${region.toLowerCase().replace(" ", "_")}.toggle`}
            >
              {region}
              <span className="ml-1 opacity-60 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Map Container */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #020b18 0%, #030d22 50%, #010a15 100%)",
          border: "1px solid rgba(0,180,255,0.15)",
          boxShadow:
            "0 0 40px rgba(0,100,200,0.1), inset 0 0 60px rgba(0,50,100,0.06)",
        }}
      >
        {/* Corner accents */}
        {(["tl", "tr", "bl", "br"] as const).map((pos) => {
          const s: Record<string, React.CSSProperties> = {
            tl: { top: 0, left: 0 },
            tr: { top: 0, right: 0, transform: "scaleX(-1)" },
            bl: { bottom: 0, left: 0, transform: "scaleY(-1)" },
            br: { bottom: 0, right: 0, transform: "scale(-1,-1)" },
          };
          return (
            <div
              key={pos}
              className="absolute pointer-events-none w-10 h-10"
              style={s[pos]}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
              >
                <title>corner</title>
                <path
                  d="M2 38 L2 6 Q2 2 6 2 L38 2"
                  stroke="url(#wmCornerGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    animation: "wmCornerFlicker 2.5s ease-in-out infinite",
                    filter: "drop-shadow(0 0 5px #00d4ff88)",
                  }}
                />
                <defs>
                  <linearGradient
                    id="wmCornerGrad"
                    x1="0%"
                    y1="100%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#0055ff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          );
        })}

        {/* Scan line */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, rgba(0,212,255,0.2), rgba(0,180,255,0.45), rgba(0,212,255,0.2), transparent)",
              animation: "wmScan 7s linear infinite",
              top: "0%",
            }}
          />
        </div>

        {/* SVG World Map */}
        <svg
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          className="w-full h-auto block"
          style={{ maxHeight: "460px" }}
          aria-label="Interactive world map showing ClawPro global coverage"
          role="img"
        >
          <title>World Map - ClawPro Global Coverage</title>
          <defs>
            <radialGradient id="wmOcean" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#0a1f3a" />
              <stop offset="60%" stopColor="#061428" />
              <stop offset="100%" stopColor="#020b18" />
            </radialGradient>
            <pattern
              id="wmGrid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="50"
                y2="0"
                stroke="rgba(0,180,255,0.04)"
                strokeWidth="0.4"
                strokeDasharray="3,10"
              />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="50"
                stroke="rgba(0,180,255,0.04)"
                strokeWidth="0.4"
                strokeDasharray="3,10"
              />
            </pattern>
            <filter id="wmGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="wmActiveGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ocean */}
          <rect
            x="0"
            y="0"
            width={VIEWBOX_W}
            height={VIEWBOX_H}
            fill="url(#wmOcean)"
          />
          <rect
            x="0"
            y="0"
            width={VIEWBOX_W}
            height={VIEWBOX_H}
            fill="url(#wmGrid)"
          />

          {/* Latitude lines */}
          {[-60, -30, 0, 30, 60].map((lat) => {
            const y = ((90 - lat) / 180) * VIEWBOX_H;
            return (
              <line
                key={`lat-${lat}`}
                x1="0"
                y1={y}
                x2={VIEWBOX_W}
                y2={y}
                stroke={
                  lat === 0 ? "rgba(0,200,255,0.35)" : "rgba(0,150,200,0.12)"
                }
                strokeWidth={lat === 0 ? 0.8 : 0.35}
                strokeDasharray={lat === 0 ? "" : "5,12"}
              />
            );
          })}
          {/* Longitude lines */}
          {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => {
            const x = ((lon + 180) / 360) * VIEWBOX_W;
            return (
              <line
                key={`lon-${lon}`}
                x1={x}
                y1="0"
                x2={x}
                y2={VIEWBOX_H}
                stroke="rgba(0,150,200,0.08)"
                strokeWidth="0.35"
                strokeDasharray="5,14"
              />
            );
          })}

          {/* All country shapes (dimmed non-selected) */}
          {COUNTRIES.map((c) => {
            const isVisible =
              selectedRegion === "All" || c.region === selectedRegion;
            const isHov = hoveredCountry?.code === c.code;
            const isAct = activeCountry?.code === c.code;
            const isGlow = glowSet.has(c.code);
            const col = REGION_COLORS[c.region];
            const fillColor = getCountryColor(c, isHov, isAct, isGlow);
            const opacity = getCountryOpacity(c);

            return (
              <g
                key={c.code}
                className="wm-country"
                style={{ opacity }}
                onClick={(e) => isVisible && handleClick(c, e)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && isVisible) {
                    handleClick(
                      c,
                      e as unknown as React.MouseEvent<SVGGElement>,
                    );
                  }
                }}
                onMouseEnter={(e) => isVisible && handleMouseEnter(c, e)}
                onMouseLeave={() => isVisible && handleMouseLeave()}
                data-ocid={`worldmap.${c.code.toLowerCase()}.map_marker`}
                aria-label={`${c.name} (${c.region})`}
                tabIndex={isVisible ? 0 : -1}
              >
                {/* Country shape */}
                <path
                  d={c.d}
                  fill={fillColor}
                  stroke={
                    isAct
                      ? col.active
                      : isHov
                        ? col.hover
                        : isGlow
                          ? col.glow
                          : "rgba(0,180,255,0.25)"
                  }
                  strokeWidth={isAct ? 1.5 : isHov ? 1.2 : 0.6}
                  filter={
                    isAct
                      ? "url(#wmActiveGlow)"
                      : isGlow || isHov
                        ? "url(#wmGlow)"
                        : undefined
                  }
                  style={
                    isAct
                      ? { animation: "wmCountryActive 1s ease-in-out infinite" }
                      : isGlow
                        ? {
                            animation: "wmCountryGlow 2s ease-in-out infinite",
                            ["--wm-glow" as string]: col.glow,
                          }
                        : undefined
                  }
                />
                {/* Country name label always visible on the map for selected region */}
                {isVisible && selectedRegion !== "All" && (
                  <text
                    x={c.lx}
                    y={c.ly + 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="5.5"
                    fontFamily="monospace"
                    fontWeight="600"
                    fill={
                      isAct
                        ? "#ffffff"
                        : isHov
                          ? col.hover
                          : "rgba(180,220,255,0.7)"
                    }
                    style={{
                      pointerEvents: "none",
                      userSelect: "none",
                      textShadow: `0 0 4px ${col.glow}`,
                    }}
                  >
                    {c.name.length > 12 ? c.code : c.name}
                  </text>
                )}
                {/* Hover inline label (country code) for "All" mode */}
                {isHov && selectedRegion === "All" && (
                  <text
                    x={c.lx}
                    y={c.ly - 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="5.5"
                    fontFamily="monospace"
                    fontWeight="700"
                    fill={col.hover}
                    style={{
                      pointerEvents: "none",
                      userSelect: "none",
                      filter: `drop-shadow(0 0 3px ${col.glow})`,
                    }}
                  >
                    {c.code}
                  </text>
                )}
                {/* Center dot */}
                <circle
                  cx={c.lx}
                  cy={c.ly}
                  r={isAct ? 3.5 : isHov ? 3 : 1.8}
                  fill={
                    isAct
                      ? col.active
                      : isHov
                        ? col.hover
                        : isGlow
                          ? col.glow
                          : "rgba(0,180,255,0.5)"
                  }
                  filter={isAct || isHov ? "url(#wmGlow)" : undefined}
                />
              </g>
            );
          })}

          {/* Floating hover label tooltip */}
          {hoveredCountry && (
            <g style={{ pointerEvents: "none" }}>
              {(() => {
                const col = REGION_COLORS[hoveredCountry.region];
                const lx = Math.min(
                  Math.max(hoveredCountry.x, 60),
                  VIEWBOX_W - 60,
                );
                const ly = Math.max(hoveredCountry.y - 30, 20);
                const labelW = Math.min(
                  hoveredCountry.name.length * 5.2 + 18,
                  120,
                );
                return (
                  <>
                    <rect
                      x={lx - labelW / 2}
                      y={ly - 11}
                      width={labelW}
                      height={20}
                      rx="4"
                      fill="rgba(2,12,30,0.92)"
                      stroke={col.glow}
                      strokeWidth="0.8"
                      style={{ filter: `drop-shadow(0 0 6px ${col.glow}66)` }}
                    />
                    <text
                      x={lx}
                      y={ly - 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="7"
                      fontFamily="system-ui, sans-serif"
                      fontWeight="700"
                      fill={col.hover}
                      style={{ userSelect: "none" }}
                    >
                      {hoveredCountry.name}
                    </text>
                    <text
                      x={lx + labelW / 2 - 16}
                      y={ly - 7}
                      fontSize="5.5"
                      fontFamily="monospace"
                      fill={col.glow}
                      style={{ userSelect: "none", opacity: 0.7 }}
                    >
                      {hoveredCountry.code}
                    </text>
                    {/* Arrow */}
                    <polygon
                      points={`${lx - 4},${ly + 9} ${lx + 4},${ly + 9} ${lx},${ly + 14}`}
                      fill="rgba(2,12,30,0.92)"
                      stroke={col.glow}
                      strokeWidth="0.5"
                    />
                  </>
                );
              })()}
            </g>
          )}

          {/* Tropic labels */}
          <text
            x="8"
            y={((90 - 23.5) / 180) * VIEWBOX_H - 3}
            fontSize="6"
            fill="rgba(0,200,255,0.25)"
            fontFamily="monospace"
          >
            Tropic of Cancer
          </text>
          <text
            x="8"
            y={((90 + 23.5) / 180) * VIEWBOX_H - 3}
            fontSize="6"
            fill="rgba(0,200,255,0.25)"
            fontFamily="monospace"
          >
            Tropic of Capricorn
          </text>
          <text
            x="8"
            y={(90 / 180) * VIEWBOX_H - 3}
            fontSize="6"
            fill="rgba(0,200,255,0.35)"
            fontFamily="monospace"
          >
            Equator
          </text>
        </svg>

        {/* Click popup overlay */}
        {activeCountry &&
          (() => {
            const col = REGION_COLORS[activeCountry.region];
            const containerW = containerRef.current?.clientWidth ?? 600;
            const containerH = containerRef.current?.clientHeight ?? 400;
            // Convert SVG coords to container coords
            const svgEl = containerRef.current?.querySelector("svg");
            let px = containerW * 0.5;
            let py = containerH * 0.3;
            if (svgEl) {
              const svgRect = svgEl.getBoundingClientRect();
              const scaleX = svgRect.width / VIEWBOX_W;
              const scaleY = svgRect.height / VIEWBOX_H;
              px = activeCountry.x * scaleX;
              py = activeCountry.y * scaleY;
            }
            return (
              <div
                className="absolute z-30 pointer-events-none"
                style={{
                  left: Math.min(Math.max(px - 85, 8), containerW - 178),
                  top: Math.max(py - 130, 8),
                  animation: "wmHoverPop 0.2s ease-out forwards",
                }}
              >
                <div
                  className="rounded-xl px-4 py-3 text-center min-w-[170px]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(2,12,30,0.97), rgba(3,18,42,0.97))",
                    border: `1.5px solid ${col.glow}`,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.85), 0 0 24px ${col.glow}44, 0 0 50px ${col.glow}22`,
                  }}
                >
                  {/* Region badge */}
                  <div
                    className="inline-flex items-center gap-1 mb-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                    style={{
                      background: `${col.glow}18`,
                      border: `1px solid ${col.glow}55`,
                      color: col.glow,
                    }}
                  >
                    {activeCountry.region}
                  </div>
                  {/* Flag */}
                  <div className="text-3xl mb-1 leading-none">
                    {countryFlag(activeCountry.code)}
                  </div>
                  {/* Name */}
                  <p
                    className="text-sm font-bold mb-0.5"
                    style={{ color: "rgba(210,235,255,0.95)" }}
                  >
                    {activeCountry.name}
                  </p>
                  {/* Code */}
                  <p
                    className="text-xs font-mono mb-2"
                    style={{ color: col.glow, opacity: 0.8 }}
                  >
                    {activeCountry.code}
                  </p>
                  {/* Status */}
                  <div
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold"
                    style={{
                      color: "#00ffcc",
                      textShadow: "0 0 6px #00ffcc88",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#00ffcc",
                        boxShadow: "0 0 6px #00ffcc",
                        display: "inline-block",
                      }}
                    />
                    ClawPro Available
                  </div>
                </div>
                {/* Arrow */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 rotate-45"
                  style={{
                    background: "rgba(3,18,42,0.97)",
                    borderRight: `1.5px solid ${col.glow}`,
                    borderBottom: `1.5px solid ${col.glow}`,
                  }}
                />
              </div>
            );
          })()}

        {/* Bottom status bar */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            borderTop: "1px solid rgba(0,150,200,0.12)",
            background: "rgba(0,8,20,0.7)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#00ffcc",
                boxShadow: "0 0 8px #00ffcc",
                display: "inline-block",
                animation: "wmRegionPulse 1.5s ease-in-out infinite",
              }}
            />
            <span
              className="text-xs font-mono"
              style={{ color: "rgba(0,200,200,0.8)" }}
            >
              LIVE · {visibleCountries.length}
              {selectedRegion !== "All" ? ` ${selectedRegion}` : ""} countries
            </span>
          </div>
          <span
            className="text-xs font-mono"
            style={{ color: "rgba(0,150,200,0.55)" }}
          >
            Hover = name · Click = details
          </span>
        </div>
      </div>
    </div>
  );
}
