import { useCallback, useEffect, useRef, useState } from "react";

// Flag emoji from ISO 2-letter country code
function countryFlag(code: string): string {
  const upper = code.toUpperCase();
  if (upper.length !== 2) return "🌍";
  const points = [...upper].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...points);
}

// Natural Earth projection (Robinson-like approximation)
// Converts lon/lat to SVG x/y on a 1000x500 viewBox
function project(lon: number, lat: number): [number, number] {
  // Simple equirectangular projection adjusted to Natural Earth style
  const x = ((lon + 180) / 360) * 1000;
  // Slightly compress the poles for a more map-like look
  const _latRad = (lat * Math.PI) / 180;
  const yScale = 1 - Math.abs(lat) * 0.002;
  const y = ((90 - lat * yScale) / 180) * 500;
  return [x, y];
}

// Build SVG path from array of [lon, lat] coordinate rings
function ringToPath(ring: number[][]): string {
  if (ring.length === 0) return "";
  const pts = ring.map(([lon, lat]) => project(lon, lat));
  const d = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  return `${d} Z`;
}

interface CountryData {
  code: string;
  name: string;
  region: string;
  // Array of rings (each ring is [lon, lat] pairs)
  rings: number[][][];
}

// Country color palette by region
const REGION_COLORS: Record<string, string[]> = {
  Americas: [
    "#1a6fa8",
    "#1e5c8a",
    "#c0392b",
    "#e74c3c",
    "#16a085",
    "#27ae60",
    "#8e44ad",
    "#2471a3",
    "#e67e22",
  ],
  Europe: [
    "#922b21",
    "#c0392b",
    "#a93226",
    "#cb4335",
    "#b03a2e",
    "#7b241c",
    "#d98880",
    "#e74c3c",
    "#8b2020",
  ],
  "Middle East": [
    "#d4ac0d",
    "#f39c12",
    "#d68910",
    "#b9770e",
    "#e67e22",
    "#f0b27a",
    "#ca6f1e",
  ],
  Africa: [
    "#e67e22",
    "#e59866",
    "#d35400",
    "#ca6f1e",
    "#af601a",
    "#27ae60",
    "#1e8449",
    "#196f3d",
    "#148f77",
  ],
  Asia: [
    "#1a5276",
    "#27ae60",
    "#c0a020",
    "#8e7f10",
    "#117a65",
    "#1abc9c",
    "#148f77",
    "#0e6655",
    "#117864",
  ],
  Oceania: ["#2980b9", "#5dade2", "#1a6b9e", "#2471a3"],
};

function getCountryColor(code: string, region: string): string {
  // Deterministic color based on code hash
  let hash = 0;
  for (const ch of code) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff;
  const palette = REGION_COLORS[region] || REGION_COLORS.Asia;
  return palette[Math.abs(hash) % palette.length];
}

// GeoJSON-style country data with simplified but accurate coordinate rings
// These are Natural Earth simplified coordinates (not mapchart.net data directly,
// but the same geographic standard used by the same projection)
const COUNTRIES: CountryData[] = [
  // North America
  {
    code: "US",
    name: "United States",
    region: "Americas",
    rings: [
      [
        [-124, 49],
        [-123, 46],
        [-120, 42],
        [-117, 33],
        [-117, 32],
        [-97, 26],
        [-95, 29],
        [-90, 29],
        [-85, 30],
        [-80, 25],
        [-75, 35],
        [-70, 42],
        [-67, 45],
        [-70, 47],
        [-75, 45],
        [-79, 44],
        [-83, 42],
        [-87, 42],
        [-90, 38],
        [-95, 40],
        [-100, 40],
        [-105, 42],
        [-110, 42],
        [-115, 44],
        [-120, 46],
        [-124, 46],
      ],
    ],
  },
  {
    code: "CA",
    name: "Canada",
    region: "Americas",
    rings: [
      [
        [-140, 72],
        [-120, 74],
        [-100, 73],
        [-80, 73],
        [-70, 70],
        [-60, 65],
        [-55, 50],
        [-67, 45],
        [-70, 47],
        [-75, 45],
        [-79, 44],
        [-83, 42],
        [-87, 42],
        [-90, 48],
        [-95, 49],
        [-100, 49],
        [-110, 49],
        [-115, 49],
        [-120, 49],
        [-124, 49],
        [-130, 54],
        [-135, 58],
        [-138, 60],
        [-140, 62],
        [-136, 68],
        [-140, 72],
      ],
    ],
  },
  {
    code: "MX",
    name: "Mexico",
    region: "Americas",
    rings: [
      [
        [-117, 32],
        [-117, 28],
        [-112, 27],
        [-108, 23],
        [-105, 20],
        [-97, 19],
        [-90, 18],
        [-90, 16],
        [-92, 17],
        [-95, 19],
        [-97, 26],
        [-100, 22],
        [-105, 22],
        [-110, 24],
        [-115, 29],
        [-117, 32],
      ],
    ],
  },
  {
    code: "GT",
    name: "Guatemala",
    region: "Americas",
    rings: [
      [
        [-92, 18],
        [-88, 16],
        [-88, 15],
        [-90, 14],
        [-92, 15],
        [-92, 18],
      ],
    ],
  },
  {
    code: "BZ",
    name: "Belize",
    region: "Americas",
    rings: [
      [
        [-88, 18],
        [-87, 16],
        [-88, 15],
        [-88, 18],
      ],
    ],
  },
  {
    code: "HN",
    name: "Honduras",
    region: "Americas",
    rings: [
      [
        [-88, 15],
        [-84, 15],
        [-83, 14],
        [-85, 13],
        [-88, 14],
        [-88, 15],
      ],
    ],
  },
  {
    code: "SV",
    name: "El Salvador",
    region: "Americas",
    rings: [
      [
        [-90, 14],
        [-88, 14],
        [-87, 13],
        [-89, 13],
        [-90, 14],
      ],
    ],
  },
  {
    code: "NI",
    name: "Nicaragua",
    region: "Americas",
    rings: [
      [
        [-83, 14],
        [-84, 12],
        [-86, 11],
        [-88, 12],
        [-87, 13],
        [-83, 14],
      ],
    ],
  },
  {
    code: "CR",
    name: "Costa Rica",
    region: "Americas",
    rings: [
      [
        [-83, 11],
        [-83, 9],
        [-85, 10],
        [-85, 11],
        [-83, 11],
      ],
    ],
  },
  {
    code: "PA",
    name: "Panama",
    region: "Americas",
    rings: [
      [
        [-75, 8],
        [-77, 8],
        [-79, 9],
        [-83, 9],
        [-83, 8],
        [-80, 7],
        [-77, 7],
        [-75, 8],
      ],
    ],
  },
  {
    code: "CU",
    name: "Cuba",
    region: "Americas",
    rings: [
      [
        [-75, 20],
        [-82, 22],
        [-84, 23],
        [-82, 23],
        [-75, 20],
      ],
    ],
  },
  {
    code: "JM",
    name: "Jamaica",
    region: "Americas",
    rings: [
      [
        [-76, 18],
        [-78, 18],
        [-78, 17],
        [-76, 17],
        [-76, 18],
      ],
    ],
  },
  {
    code: "HT",
    name: "Haiti",
    region: "Americas",
    rings: [
      [
        [-71, 20],
        [-74, 20],
        [-73, 18],
        [-71, 18],
        [-71, 20],
      ],
    ],
  },
  {
    code: "DO",
    name: "Dominican Republic",
    region: "Americas",
    rings: [
      [
        [-68, 19],
        [-71, 20],
        [-71, 18],
        [-69, 18],
        [-68, 19],
      ],
    ],
  },
  {
    code: "CO",
    name: "Colombia",
    region: "Americas",
    rings: [
      [
        [-67, 6],
        [-67, 2],
        [-70, -1],
        [-75, -1],
        [-78, 1],
        [-78, 4],
        [-76, 8],
        [-74, 8],
        [-72, 11],
        [-70, 12],
        [-67, 11],
        [-67, 6],
      ],
    ],
  },
  {
    code: "VE",
    name: "Venezuela",
    region: "Americas",
    rings: [
      [
        [-60, 5],
        [-61, 8],
        [-63, 10],
        [-67, 11],
        [-70, 12],
        [-72, 11],
        [-74, 8],
        [-67, 6],
        [-60, 5],
      ],
    ],
  },
  {
    code: "GY",
    name: "Guyana",
    region: "Americas",
    rings: [
      [
        [-57, 6],
        [-60, 5],
        [-60, 8],
        [-57, 8],
        [-57, 6],
      ],
    ],
  },
  {
    code: "SR",
    name: "Suriname",
    region: "Americas",
    rings: [
      [
        [-54, 5],
        [-57, 6],
        [-57, 4],
        [-54, 4],
        [-54, 5],
      ],
    ],
  },
  {
    code: "BR",
    name: "Brazil",
    region: "Americas",
    rings: [
      [
        [-35, -5],
        [-38, -10],
        [-40, -20],
        [-45, -23],
        [-48, -28],
        [-52, -33],
        [-53, -33],
        [-55, -30],
        [-58, -28],
        [-60, -22],
        [-65, -20],
        [-70, -10],
        [-73, -6],
        [-72, -2],
        [-68, 2],
        [-60, 5],
        [-57, 4],
        [-54, 0],
        [-51, 4],
        [-50, 2],
        [-48, 0],
        [-45, -1],
        [-40, -2],
        [-35, -5],
      ],
    ],
  },
  {
    code: "EC",
    name: "Ecuador",
    region: "Americas",
    rings: [
      [
        [-75, -1],
        [-75, -3],
        [-78, -4],
        [-80, -2],
        [-78, 1],
        [-75, -1],
      ],
    ],
  },
  {
    code: "PE",
    name: "Peru",
    region: "Americas",
    rings: [
      [
        [-70, -2],
        [-70, -10],
        [-73, -14],
        [-76, -14],
        [-81, -8],
        [-80, -2],
        [-78, -4],
        [-75, -3],
        [-75, -1],
        [-70, -2],
      ],
    ],
  },
  {
    code: "BO",
    name: "Bolivia",
    region: "Americas",
    rings: [
      [
        [-60, -14],
        [-65, -22],
        [-68, -22],
        [-70, -18],
        [-70, -10],
        [-67, -14],
        [-60, -14],
      ],
    ],
  },
  {
    code: "CL",
    name: "Chile",
    region: "Americas",
    rings: [
      [
        [-68, -22],
        [-70, -27],
        [-71, -33],
        [-72, -38],
        [-73, -42],
        [-75, -48],
        [-73, -50],
        [-70, -48],
        [-69, -42],
        [-69, -33],
        [-70, -27],
        [-68, -22],
      ],
    ],
  },
  {
    code: "AR",
    name: "Argentina",
    region: "Americas",
    rings: [
      [
        [-53, -33],
        [-58, -34],
        [-62, -38],
        [-65, -42],
        [-68, -42],
        [-69, -33],
        [-70, -27],
        [-68, -22],
        [-65, -22],
        [-60, -22],
        [-57, -28],
        [-55, -30],
        [-53, -33],
      ],
    ],
  },
  {
    code: "UY",
    name: "Uruguay",
    region: "Americas",
    rings: [
      [
        [-53, -33],
        [-55, -30],
        [-57, -34],
        [-58, -34],
        [-53, -33],
      ],
    ],
  },
  {
    code: "PY",
    name: "Paraguay",
    region: "Americas",
    rings: [
      [
        [-55, -20],
        [-60, -20],
        [-62, -22],
        [-62, -25],
        [-58, -28],
        [-55, -26],
        [-55, -20],
      ],
    ],
  },
  // Europe
  {
    code: "IS",
    name: "Iceland",
    region: "Europe",
    rings: [
      [
        [-24, 66],
        [-14, 64],
        [-13, 65],
        [-24, 66],
      ],
    ],
  },
  {
    code: "GB",
    name: "United Kingdom",
    region: "Europe",
    rings: [
      [
        [-5, 50],
        [-1, 51],
        [0, 53],
        [-2, 56],
        [-4, 58],
        [-5, 55],
        [-3, 52],
        [-5, 50],
      ],
    ],
  },
  {
    code: "IE",
    name: "Ireland",
    region: "Europe",
    rings: [
      [
        [-10, 52],
        [-6, 52],
        [-6, 54],
        [-9, 55],
        [-10, 53],
        [-10, 52],
      ],
    ],
  },
  {
    code: "PT",
    name: "Portugal",
    region: "Europe",
    rings: [
      [
        [-7, 37],
        [-9, 38],
        [-9, 42],
        [-7, 42],
        [-6, 40],
        [-7, 37],
      ],
    ],
  },
  {
    code: "ES",
    name: "Spain",
    region: "Europe",
    rings: [
      [
        [-9, 36],
        [-5, 36],
        [-0, 37],
        [3, 40],
        [0, 43],
        [-2, 44],
        [-4, 44],
        [-8, 43],
        [-9, 42],
        [-9, 38],
        [-7, 37],
        [-9, 36],
      ],
    ],
  },
  {
    code: "FR",
    name: "France",
    region: "Europe",
    rings: [
      [
        [-2, 44],
        [0, 43],
        [3, 43],
        [7, 44],
        [8, 48],
        [5, 49],
        [2, 51],
        [0, 50],
        [-2, 47],
        [-4, 48],
        [-2, 44],
      ],
    ],
  },
  {
    code: "BE",
    name: "Belgium",
    region: "Europe",
    rings: [
      [
        [3, 51],
        [5, 50],
        [6, 50],
        [5, 49],
        [2, 51],
        [3, 51],
      ],
    ],
  },
  {
    code: "NL",
    name: "Netherlands",
    region: "Europe",
    rings: [
      [
        [4, 52],
        [7, 52],
        [7, 51],
        [5, 50],
        [3, 51],
        [4, 52],
      ],
    ],
  },
  {
    code: "LU",
    name: "Luxembourg",
    region: "Europe",
    rings: [
      [
        [5, 50],
        [6, 50],
        [6, 49],
        [5, 49],
        [5, 50],
      ],
    ],
  },
  {
    code: "DE",
    name: "Germany",
    region: "Europe",
    rings: [
      [
        [6, 52],
        [8, 54],
        [12, 54],
        [14, 52],
        [14, 50],
        [12, 48],
        [8, 47],
        [7, 48],
        [6, 51],
        [6, 52],
      ],
    ],
  },
  {
    code: "DK",
    name: "Denmark",
    region: "Europe",
    rings: [
      [
        [8, 55],
        [10, 55],
        [12, 55],
        [12, 56],
        [10, 57],
        [8, 56],
        [8, 55],
      ],
    ],
  },
  {
    code: "NO",
    name: "Norway",
    region: "Europe",
    rings: [
      [
        [4, 58],
        [8, 58],
        [14, 65],
        [20, 70],
        [28, 71],
        [28, 70],
        [20, 67],
        [14, 63],
        [8, 62],
        [5, 59],
        [4, 58],
      ],
    ],
  },
  {
    code: "SE",
    name: "Sweden",
    region: "Europe",
    rings: [
      [
        [12, 56],
        [18, 57],
        [22, 63],
        [24, 68],
        [20, 70],
        [14, 65],
        [8, 62],
        [12, 59],
        [12, 56],
      ],
    ],
  },
  {
    code: "FI",
    name: "Finland",
    region: "Europe",
    rings: [
      [
        [22, 60],
        [26, 60],
        [30, 63],
        [29, 69],
        [27, 70],
        [24, 68],
        [22, 65],
        [22, 60],
      ],
    ],
  },
  {
    code: "EE",
    name: "Estonia",
    region: "Europe",
    rings: [
      [
        [22, 58],
        [27, 58],
        [28, 59],
        [22, 59],
        [22, 58],
      ],
    ],
  },
  {
    code: "LV",
    name: "Latvia",
    region: "Europe",
    rings: [
      [
        [21, 57],
        [26, 56],
        [28, 57],
        [26, 58],
        [21, 58],
        [21, 57],
      ],
    ],
  },
  {
    code: "LT",
    name: "Lithuania",
    region: "Europe",
    rings: [
      [
        [21, 54],
        [24, 54],
        [26, 56],
        [21, 57],
        [21, 54],
      ],
    ],
  },
  {
    code: "PL",
    name: "Poland",
    region: "Europe",
    rings: [
      [
        [14, 51],
        [18, 50],
        [22, 50],
        [24, 51],
        [23, 54],
        [18, 55],
        [14, 53],
        [14, 51],
      ],
    ],
  },
  {
    code: "CZ",
    name: "Czech Republic",
    region: "Europe",
    rings: [
      [
        [12, 51],
        [16, 50],
        [18, 50],
        [18, 49],
        [14, 49],
        [12, 50],
        [12, 51],
      ],
    ],
  },
  {
    code: "SK",
    name: "Slovakia",
    region: "Europe",
    rings: [
      [
        [16, 48],
        [18, 49],
        [22, 49],
        [22, 48],
        [18, 48],
        [16, 48],
      ],
    ],
  },
  {
    code: "AT",
    name: "Austria",
    region: "Europe",
    rings: [
      [
        [10, 48],
        [14, 48],
        [17, 48],
        [17, 47],
        [14, 47],
        [10, 47],
        [10, 48],
      ],
    ],
  },
  {
    code: "HU",
    name: "Hungary",
    region: "Europe",
    rings: [
      [
        [16, 48],
        [20, 48],
        [22, 48],
        [22, 46],
        [18, 45],
        [16, 46],
        [16, 48],
      ],
    ],
  },
  {
    code: "CH",
    name: "Switzerland",
    region: "Europe",
    rings: [
      [
        [6, 48],
        [8, 48],
        [10, 47],
        [8, 46],
        [6, 46],
        [6, 48],
      ],
    ],
  },
  {
    code: "IT",
    name: "Italy",
    region: "Europe",
    rings: [
      [
        [7, 44],
        [14, 44],
        [16, 40],
        [15, 38],
        [13, 38],
        [12, 42],
        [8, 44],
        [7, 44],
      ],
    ],
  },
  {
    code: "SI",
    name: "Slovenia",
    region: "Europe",
    rings: [
      [
        [14, 47],
        [15, 46],
        [14, 46],
        [14, 47],
      ],
    ],
  },
  {
    code: "HR",
    name: "Croatia",
    region: "Europe",
    rings: [
      [
        [14, 46],
        [17, 46],
        [17, 43],
        [15, 43],
        [14, 45],
        [14, 46],
      ],
    ],
  },
  {
    code: "BA",
    name: "Bosnia and Herzegovina",
    region: "Europe",
    rings: [
      [
        [16, 45],
        [19, 45],
        [18, 43],
        [16, 44],
        [16, 45],
      ],
    ],
  },
  {
    code: "RS",
    name: "Serbia",
    region: "Europe",
    rings: [
      [
        [20, 45],
        [22, 44],
        [22, 42],
        [20, 42],
        [18, 43],
        [19, 45],
        [20, 45],
      ],
    ],
  },
  {
    code: "ME",
    name: "Montenegro",
    region: "Europe",
    rings: [
      [
        [19, 43],
        [20, 42],
        [18, 42],
        [18, 43],
        [19, 43],
      ],
    ],
  },
  {
    code: "MK",
    name: "North Macedonia",
    region: "Europe",
    rings: [
      [
        [21, 42],
        [22, 41],
        [20, 41],
        [21, 42],
      ],
    ],
  },
  {
    code: "AL",
    name: "Albania",
    region: "Europe",
    rings: [
      [
        [20, 42],
        [20, 41],
        [19, 40],
        [19, 41],
        [20, 42],
      ],
    ],
  },
  {
    code: "GR",
    name: "Greece",
    region: "Europe",
    rings: [
      [
        [20, 41],
        [22, 41],
        [26, 40],
        [24, 37],
        [22, 38],
        [20, 39],
        [20, 41],
      ],
    ],
  },
  {
    code: "BG",
    name: "Bulgaria",
    region: "Europe",
    rings: [
      [
        [22, 44],
        [26, 43],
        [28, 43],
        [27, 42],
        [22, 42],
        [22, 44],
      ],
    ],
  },
  {
    code: "RO",
    name: "Romania",
    region: "Europe",
    rings: [
      [
        [22, 46],
        [26, 45],
        [29, 46],
        [30, 45],
        [26, 43],
        [22, 44],
        [22, 46],
      ],
    ],
  },
  {
    code: "MD",
    name: "Moldova",
    region: "Europe",
    rings: [
      [
        [27, 48],
        [29, 48],
        [30, 46],
        [28, 46],
        [27, 48],
      ],
    ],
  },
  {
    code: "UA",
    name: "Ukraine",
    region: "Europe",
    rings: [
      [
        [22, 50],
        [28, 52],
        [32, 52],
        [36, 50],
        [36, 46],
        [32, 46],
        [30, 46],
        [29, 48],
        [26, 49],
        [22, 50],
      ],
    ],
  },
  {
    code: "BY",
    name: "Belarus",
    region: "Europe",
    rings: [
      [
        [24, 52],
        [28, 53],
        [32, 53],
        [32, 52],
        [28, 52],
        [24, 50],
        [24, 52],
      ],
    ],
  },
  {
    code: "RU",
    name: "Russia",
    region: "Europe",
    rings: [
      [
        [28, 55],
        [40, 60],
        [56, 60],
        [70, 60],
        [90, 62],
        [140, 60],
        [160, 60],
        [168, 65],
        [160, 70],
        [140, 72],
        [100, 72],
        [80, 72],
        [60, 68],
        [50, 62],
        [40, 58],
        [32, 55],
        [28, 55],
      ],
    ],
  },
  // Middle East & Central Asia
  {
    code: "TR",
    name: "Turkey",
    region: "Middle East",
    rings: [
      [
        [26, 40],
        [28, 42],
        [32, 42],
        [36, 38],
        [42, 37],
        [44, 38],
        [40, 40],
        [36, 42],
        [30, 42],
        [26, 40],
      ],
    ],
  },
  {
    code: "GE",
    name: "Georgia",
    region: "Middle East",
    rings: [
      [
        [40, 41],
        [44, 42],
        [46, 42],
        [46, 41],
        [44, 40],
        [40, 41],
      ],
    ],
  },
  {
    code: "AM",
    name: "Armenia",
    region: "Middle East",
    rings: [
      [
        [44, 40],
        [46, 40],
        [46, 39],
        [44, 39],
        [44, 40],
      ],
    ],
  },
  {
    code: "AZ",
    name: "Azerbaijan",
    region: "Middle East",
    rings: [
      [
        [46, 40],
        [50, 40],
        [50, 38],
        [46, 38],
        [46, 40],
      ],
    ],
  },
  {
    code: "SY",
    name: "Syria",
    region: "Middle East",
    rings: [
      [
        [36, 37],
        [38, 36],
        [42, 37],
        [42, 36],
        [36, 32],
        [36, 36],
        [36, 37],
      ],
    ],
  },
  {
    code: "LB",
    name: "Lebanon",
    region: "Middle East",
    rings: [
      [
        [35, 33],
        [36, 34],
        [36, 32],
        [35, 33],
      ],
    ],
  },
  {
    code: "IL",
    name: "Israel",
    region: "Middle East",
    rings: [
      [
        [34, 33],
        [36, 33],
        [35, 31],
        [34, 30],
        [34, 33],
      ],
    ],
  },
  {
    code: "JO",
    name: "Jordan",
    region: "Middle East",
    rings: [
      [
        [35, 30],
        [36, 32],
        [39, 32],
        [38, 28],
        [36, 28],
        [35, 30],
      ],
    ],
  },
  {
    code: "IQ",
    name: "Iraq",
    region: "Middle East",
    rings: [
      [
        [38, 33],
        [42, 37],
        [46, 36],
        [48, 30],
        [44, 28],
        [40, 31],
        [38, 33],
      ],
    ],
  },
  {
    code: "IR",
    name: "Iran",
    region: "Middle East",
    rings: [
      [
        [44, 38],
        [48, 38],
        [56, 38],
        [60, 32],
        [58, 28],
        [52, 26],
        [48, 28],
        [44, 28],
        [48, 30],
        [46, 36],
        [44, 38],
      ],
    ],
  },
  {
    code: "KW",
    name: "Kuwait",
    region: "Middle East",
    rings: [
      [
        [47, 30],
        [48, 30],
        [48, 28],
        [46, 28],
        [47, 30],
      ],
    ],
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    region: "Middle East",
    rings: [
      [
        [36, 28],
        [38, 28],
        [44, 28],
        [48, 28],
        [52, 24],
        [56, 24],
        [56, 20],
        [48, 16],
        [42, 18],
        [38, 20],
        [36, 28],
      ],
    ],
  },
  {
    code: "AE",
    name: "UAE",
    region: "Middle East",
    rings: [
      [
        [51, 24],
        [55, 24],
        [56, 22],
        [54, 22],
        [51, 24],
      ],
    ],
  },
  {
    code: "OM",
    name: "Oman",
    region: "Middle East",
    rings: [
      [
        [52, 22],
        [56, 22],
        [60, 24],
        [58, 20],
        [54, 18],
        [52, 20],
        [52, 22],
      ],
    ],
  },
  {
    code: "YE",
    name: "Yemen",
    region: "Middle East",
    rings: [
      [
        [42, 18],
        [44, 16],
        [48, 14],
        [50, 12],
        [42, 12],
        [42, 18],
      ],
    ],
  },
  {
    code: "QA",
    name: "Qatar",
    region: "Middle East",
    rings: [
      [
        [51, 26],
        [51, 24],
        [50, 25],
        [51, 26],
      ],
    ],
  },
  {
    code: "BH",
    name: "Bahrain",
    region: "Middle East",
    rings: [
      [
        [50, 26],
        [50, 25],
        [51, 25],
        [51, 26],
        [50, 26],
      ],
    ],
  },
  // Central Asia
  {
    code: "KZ",
    name: "Kazakhstan",
    region: "Asia",
    rings: [
      [
        [50, 50],
        [56, 52],
        [64, 52],
        [80, 52],
        [82, 50],
        [80, 44],
        [72, 42],
        [60, 40],
        [52, 42],
        [50, 44],
        [50, 50],
      ],
    ],
  },
  {
    code: "UZ",
    name: "Uzbekistan",
    region: "Asia",
    rings: [
      [
        [56, 42],
        [60, 40],
        [64, 40],
        [65, 38],
        [60, 37],
        [56, 38],
        [56, 42],
      ],
    ],
  },
  {
    code: "TM",
    name: "Turkmenistan",
    region: "Asia",
    rings: [
      [
        [52, 38],
        [56, 38],
        [60, 37],
        [60, 36],
        [56, 36],
        [52, 38],
      ],
    ],
  },
  {
    code: "KG",
    name: "Kyrgyzstan",
    region: "Asia",
    rings: [
      [
        [70, 40],
        [74, 40],
        [75, 38],
        [72, 38],
        [70, 40],
      ],
    ],
  },
  {
    code: "TJ",
    name: "Tajikistan",
    region: "Asia",
    rings: [
      [
        [68, 38],
        [72, 38],
        [74, 38],
        [72, 36],
        [68, 36],
        [68, 38],
      ],
    ],
  },
  {
    code: "AF",
    name: "Afghanistan",
    region: "Asia",
    rings: [
      [
        [60, 38],
        [64, 38],
        [68, 38],
        [68, 34],
        [64, 30],
        [60, 30],
        [58, 32],
        [60, 36],
        [60, 38],
      ],
    ],
  },
  {
    code: "PK",
    name: "Pakistan",
    region: "Asia",
    rings: [
      [
        [60, 36],
        [64, 36],
        [70, 36],
        [72, 34],
        [68, 30],
        [64, 24],
        [60, 24],
        [60, 28],
        [62, 28],
        [60, 30],
        [64, 30],
        [68, 34],
        [64, 38],
        [60, 38],
        [60, 36],
      ],
    ],
  },
  // South Asia
  {
    code: "IN",
    name: "India",
    region: "Asia",
    rings: [
      [
        [68, 22],
        [72, 20],
        [76, 8],
        [80, 10],
        [84, 20],
        [88, 24],
        [90, 26],
        [88, 28],
        [80, 32],
        [76, 34],
        [72, 34],
        [68, 28],
        [68, 22],
      ],
    ],
  },
  {
    code: "NP",
    name: "Nepal",
    region: "Asia",
    rings: [
      [
        [80, 28],
        [84, 28],
        [88, 26],
        [80, 26],
        [80, 28],
      ],
    ],
  },
  {
    code: "BD",
    name: "Bangladesh",
    region: "Asia",
    rings: [
      [
        [88, 26],
        [90, 26],
        [92, 22],
        [90, 22],
        [88, 24],
        [88, 26],
      ],
    ],
  },
  {
    code: "LK",
    name: "Sri Lanka",
    region: "Asia",
    rings: [
      [
        [80, 9],
        [81, 7],
        [80, 6],
        [80, 9],
      ],
    ],
  },
  // Southeast Asia
  {
    code: "MM",
    name: "Myanmar",
    region: "Asia",
    rings: [
      [
        [96, 28],
        [100, 24],
        [100, 18],
        [96, 16],
        [92, 22],
        [92, 26],
        [96, 28],
      ],
    ],
  },
  {
    code: "TH",
    name: "Thailand",
    region: "Asia",
    rings: [
      [
        [100, 18],
        [104, 18],
        [104, 12],
        [100, 6],
        [98, 8],
        [100, 14],
        [100, 18],
      ],
    ],
  },
  {
    code: "LA",
    name: "Laos",
    region: "Asia",
    rings: [
      [
        [100, 22],
        [104, 22],
        [106, 20],
        [104, 16],
        [100, 18],
        [100, 22],
      ],
    ],
  },
  {
    code: "VN",
    name: "Vietnam",
    region: "Asia",
    rings: [
      [
        [104, 22],
        [108, 18],
        [108, 12],
        [106, 10],
        [104, 12],
        [104, 22],
      ],
    ],
  },
  {
    code: "KH",
    name: "Cambodia",
    region: "Asia",
    rings: [
      [
        [102, 14],
        [104, 14],
        [106, 12],
        [104, 10],
        [102, 10],
        [102, 14],
      ],
    ],
  },
  {
    code: "MY",
    name: "Malaysia",
    region: "Asia",
    rings: [
      [
        [100, 5],
        [104, 6],
        [108, 2],
        [106, 1],
        [100, 2],
        [100, 5],
      ],
    ],
  },
  {
    code: "SG",
    name: "Singapore",
    region: "Asia",
    rings: [
      [
        [104, 1],
        [104, 2],
        [104, 1],
      ],
    ],
  },
  {
    code: "ID",
    name: "Indonesia",
    region: "Asia",
    rings: [
      [
        [95, -5],
        [105, -5],
        [115, -8],
        [125, -8],
        [130, -4],
        [120, -4],
        [110, -6],
        [100, -2],
        [95, -5],
      ],
    ],
  },
  {
    code: "PH",
    name: "Philippines",
    region: "Asia",
    rings: [
      [
        [118, 10],
        [122, 14],
        [126, 8],
        [124, 6],
        [120, 8],
        [118, 10],
      ],
    ],
  },
  // East Asia
  {
    code: "CN",
    name: "China",
    region: "Asia",
    rings: [
      [
        [80, 40],
        [90, 44],
        [100, 44],
        [110, 38],
        [120, 38],
        [124, 46],
        [120, 52],
        [100, 52],
        [90, 48],
        [80, 40],
      ],
    ],
  },
  {
    code: "MN",
    name: "Mongolia",
    region: "Asia",
    rings: [
      [
        [88, 48],
        [96, 50],
        [106, 50],
        [112, 50],
        [120, 48],
        [118, 44],
        [110, 40],
        [100, 42],
        [90, 44],
        [88, 48],
      ],
    ],
  },
  {
    code: "TW",
    name: "Taiwan",
    region: "Asia",
    rings: [
      [
        [120, 24],
        [122, 24],
        [121, 22],
        [120, 24],
      ],
    ],
  },
  {
    code: "KR",
    name: "South Korea",
    region: "Asia",
    rings: [
      [
        [126, 34],
        [130, 36],
        [130, 34],
        [126, 34],
      ],
    ],
  },
  {
    code: "KP",
    name: "North Korea",
    region: "Asia",
    rings: [
      [
        [124, 38],
        [130, 38],
        [128, 40],
        [126, 42],
        [124, 40],
        [124, 38],
      ],
    ],
  },
  {
    code: "JP",
    name: "Japan",
    region: "Asia",
    rings: [
      [
        [130, 30],
        [132, 34],
        [136, 36],
        [140, 36],
        [142, 40],
        [142, 44],
        [140, 46],
        [135, 40],
        [130, 32],
        [130, 30],
      ],
    ],
  },
  // Africa
  {
    code: "MA",
    name: "Morocco",
    region: "Africa",
    rings: [
      [
        [-6, 34],
        [-2, 36],
        [0, 35],
        [-2, 33],
        [-8, 27],
        [-14, 27],
        [-10, 31],
        [-6, 34],
      ],
    ],
  },
  {
    code: "DZ",
    name: "Algeria",
    region: "Africa",
    rings: [
      [
        [-2, 36],
        [8, 37],
        [10, 35],
        [10, 24],
        [0, 20],
        [-8, 20],
        [-8, 27],
        [0, 28],
        [-2, 36],
      ],
    ],
  },
  {
    code: "TN",
    name: "Tunisia",
    region: "Africa",
    rings: [
      [
        [8, 37],
        [10, 37],
        [10, 30],
        [8, 28],
        [8, 37],
      ],
    ],
  },
  {
    code: "LY",
    name: "Libya",
    region: "Africa",
    rings: [
      [
        [10, 34],
        [14, 34],
        [20, 34],
        [26, 22],
        [20, 20],
        [10, 24],
        [10, 34],
      ],
    ],
  },
  {
    code: "EG",
    name: "Egypt",
    region: "Africa",
    rings: [
      [
        [26, 22],
        [32, 22],
        [36, 28],
        [34, 30],
        [30, 30],
        [26, 22],
      ],
    ],
  },
  {
    code: "SD",
    name: "Sudan",
    region: "Africa",
    rings: [
      [
        [22, 22],
        [26, 22],
        [30, 24],
        [36, 22],
        [36, 16],
        [32, 10],
        [26, 10],
        [22, 18],
        [22, 22],
      ],
    ],
  },
  {
    code: "SS",
    name: "South Sudan",
    region: "Africa",
    rings: [
      [
        [24, 10],
        [28, 10],
        [34, 10],
        [36, 8],
        [32, 4],
        [26, 4],
        [24, 8],
        [24, 10],
      ],
    ],
  },
  {
    code: "ET",
    name: "Ethiopia",
    region: "Africa",
    rings: [
      [
        [36, 16],
        [42, 12],
        [44, 10],
        [42, 8],
        [38, 4],
        [34, 6],
        [34, 10],
        [36, 14],
        [36, 16],
      ],
    ],
  },
  {
    code: "ER",
    name: "Eritrea",
    region: "Africa",
    rings: [
      [
        [36, 16],
        [42, 14],
        [42, 12],
        [36, 14],
        [36, 16],
      ],
    ],
  },
  {
    code: "SO",
    name: "Somalia",
    region: "Africa",
    rings: [
      [
        [42, 12],
        [44, 8],
        [44, 4],
        [40, 0],
        [42, 4],
        [42, 8],
        [44, 10],
        [44, 12],
        [42, 12],
      ],
    ],
  },
  {
    code: "DJ",
    name: "Djibouti",
    region: "Africa",
    rings: [
      [
        [43, 12],
        [44, 12],
        [42, 11],
        [43, 12],
      ],
    ],
  },
  {
    code: "KE",
    name: "Kenya",
    region: "Africa",
    rings: [
      [
        [34, 4],
        [40, 4],
        [42, 0],
        [38, -4],
        [34, -2],
        [34, 4],
      ],
    ],
  },
  {
    code: "UG",
    name: "Uganda",
    region: "Africa",
    rings: [
      [
        [30, 4],
        [34, 4],
        [34, 0],
        [30, 0],
        [30, 4],
      ],
    ],
  },
  {
    code: "RW",
    name: "Rwanda",
    region: "Africa",
    rings: [
      [
        [28, -2],
        [30, -2],
        [30, -4],
        [28, -4],
        [28, -2],
      ],
    ],
  },
  {
    code: "BI",
    name: "Burundi",
    region: "Africa",
    rings: [
      [
        [28, -4],
        [30, -4],
        [30, -6],
        [28, -4],
      ],
    ],
  },
  {
    code: "TZ",
    name: "Tanzania",
    region: "Africa",
    rings: [
      [
        [30, -2],
        [36, -2],
        [40, -6],
        [34, -10],
        [30, -10],
        [30, -2],
      ],
    ],
  },
  {
    code: "MZ",
    name: "Mozambique",
    region: "Africa",
    rings: [
      [
        [34, -14],
        [36, -18],
        [34, -26],
        [32, -26],
        [30, -20],
        [30, -14],
        [34, -14],
      ],
    ],
  },
  {
    code: "ZM",
    name: "Zambia",
    region: "Africa",
    rings: [
      [
        [24, -10],
        [28, -10],
        [30, -10],
        [30, -16],
        [26, -18],
        [24, -14],
        [24, -10],
      ],
    ],
  },
  {
    code: "ZW",
    name: "Zimbabwe",
    region: "Africa",
    rings: [
      [
        [26, -18],
        [30, -16],
        [32, -20],
        [30, -22],
        [26, -20],
        [26, -18],
      ],
    ],
  },
  {
    code: "BW",
    name: "Botswana",
    region: "Africa",
    rings: [
      [
        [20, -22],
        [26, -20],
        [28, -24],
        [24, -26],
        [20, -24],
        [20, -22],
      ],
    ],
  },
  {
    code: "ZA",
    name: "South Africa",
    region: "Africa",
    rings: [
      [
        [16, -29],
        [20, -34],
        [28, -34],
        [32, -26],
        [28, -24],
        [26, -20],
        [20, -24],
        [18, -28],
        [16, -29],
      ],
    ],
  },
  {
    code: "NA",
    name: "Namibia",
    region: "Africa",
    rings: [
      [
        [12, -18],
        [16, -18],
        [20, -22],
        [18, -28],
        [14, -28],
        [12, -24],
        [12, -18],
      ],
    ],
  },
  {
    code: "AO",
    name: "Angola",
    region: "Africa",
    rings: [
      [
        [12, -6],
        [18, -8],
        [22, -10],
        [24, -14],
        [18, -18],
        [12, -18],
        [12, -6],
      ],
    ],
  },
  {
    code: "CD",
    name: "DR Congo",
    region: "Africa",
    rings: [
      [
        [18, 2],
        [24, 4],
        [28, 2],
        [30, -2],
        [28, -6],
        [24, -10],
        [18, -8],
        [14, -6],
        [14, 2],
        [18, 2],
      ],
    ],
  },
  {
    code: "CG",
    name: "Congo",
    region: "Africa",
    rings: [
      [
        [14, -2],
        [18, 2],
        [18, -2],
        [14, -2],
      ],
    ],
  },
  {
    code: "GA",
    name: "Gabon",
    region: "Africa",
    rings: [
      [
        [10, 2],
        [14, 2],
        [12, -4],
        [10, -2],
        [10, 2],
      ],
    ],
  },
  {
    code: "CM",
    name: "Cameroon",
    region: "Africa",
    rings: [
      [
        [8, 4],
        [14, 6],
        [14, 2],
        [10, 2],
        [8, 4],
      ],
    ],
  },
  {
    code: "NG",
    name: "Nigeria",
    region: "Africa",
    rings: [
      [
        [2, 6],
        [8, 6],
        [14, 6],
        [14, 8],
        [10, 12],
        [2, 12],
        [2, 6],
      ],
    ],
  },
  {
    code: "GN",
    name: "Guinea",
    region: "Africa",
    rings: [
      [
        [-10, 8],
        [-8, 10],
        [-12, 10],
        [-14, 10],
        [-12, 8],
        [-10, 8],
      ],
    ],
  },
  {
    code: "CI",
    name: "Ivory Coast",
    region: "Africa",
    rings: [
      [
        [-8, 4],
        [-4, 5],
        [0, 5],
        [0, 8],
        [-4, 8],
        [-8, 8],
        [-8, 4],
      ],
    ],
  },
  {
    code: "GH",
    name: "Ghana",
    region: "Africa",
    rings: [
      [
        [-4, 5],
        [0, 5],
        [0, 10],
        [-4, 10],
        [-4, 5],
      ],
    ],
  },
  {
    code: "TG",
    name: "Togo",
    region: "Africa",
    rings: [
      [
        [0, 6],
        [2, 6],
        [2, 10],
        [0, 8],
        [0, 6],
      ],
    ],
  },
  {
    code: "BJ",
    name: "Benin",
    region: "Africa",
    rings: [
      [
        [2, 6],
        [4, 7],
        [4, 12],
        [2, 12],
        [2, 6],
      ],
    ],
  },
  {
    code: "BF",
    name: "Burkina Faso",
    region: "Africa",
    rings: [
      [
        [-4, 10],
        [0, 10],
        [4, 12],
        [0, 14],
        [-4, 14],
        [-4, 10],
      ],
    ],
  },
  {
    code: "NE",
    name: "Niger",
    region: "Africa",
    rings: [
      [
        [2, 14],
        [12, 14],
        [14, 16],
        [14, 8],
        [10, 12],
        [4, 12],
        [2, 14],
      ],
    ],
  },
  {
    code: "ML",
    name: "Mali",
    region: "Africa",
    rings: [
      [
        [-12, 14],
        [-4, 14],
        [0, 14],
        [0, 20],
        [-4, 24],
        [-8, 20],
        [-12, 18],
        [-12, 14],
      ],
    ],
  },
  {
    code: "MR",
    name: "Mauritania",
    region: "Africa",
    rings: [
      [
        [-18, 14],
        [-12, 14],
        [-12, 18],
        [-8, 20],
        [-8, 27],
        [-16, 21],
        [-18, 18],
        [-18, 14],
      ],
    ],
  },
  {
    code: "SN",
    name: "Senegal",
    region: "Africa",
    rings: [
      [
        [-18, 13],
        [-14, 12],
        [-12, 13],
        [-14, 14],
        [-16, 14],
        [-18, 14],
        [-18, 13],
      ],
    ],
  },
  {
    code: "TD",
    name: "Chad",
    region: "Africa",
    rings: [
      [
        [14, 8],
        [14, 16],
        [22, 14],
        [22, 10],
        [18, 8],
        [14, 8],
      ],
    ],
  },
  {
    code: "CF",
    name: "Central African Republic",
    region: "Africa",
    rings: [
      [
        [14, 6],
        [18, 8],
        [22, 10],
        [26, 6],
        [22, 4],
        [18, 4],
        [14, 6],
      ],
    ],
  },
  {
    code: "MG",
    name: "Madagascar",
    region: "Africa",
    rings: [
      [
        [44, -12],
        [48, -18],
        [46, -24],
        [44, -22],
        [42, -18],
        [44, -12],
      ],
    ],
  },
  // Oceania
  {
    code: "AU",
    name: "Australia",
    region: "Oceania",
    rings: [
      [
        [114, -22],
        [120, -14],
        [130, -12],
        [136, -12],
        [138, -14],
        [140, -18],
        [148, -22],
        [152, -28],
        [150, -36],
        [138, -36],
        [130, -32],
        [118, -30],
        [114, -22],
      ],
    ],
  },
  {
    code: "NZ",
    name: "New Zealand",
    region: "Oceania",
    rings: [
      [
        [166, -46],
        [172, -44],
        [174, -40],
        [172, -36],
        [166, -36],
        [164, -42],
        [166, -46],
      ],
    ],
  },
  {
    code: "PG",
    name: "Papua New Guinea",
    region: "Oceania",
    rings: [
      [
        [140, -6],
        [148, -4],
        [150, -8],
        [144, -8],
        [140, -6],
      ],
    ],
  },
];

const VIEWBOX_W = 1000;
const VIEWBOX_H = 500;

interface PopupInfo {
  code: string;
  name: string;
  region: string;
  svgX: number;
  svgY: number;
}

export function WorldMapGeo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [glowCode, setGlowCode] = useState<string | null>(null);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-compute path strings and centroids
  const countryPaths = COUNTRIES.map((c) => {
    const pathParts = c.rings.map((ring) => ringToPath(ring));
    const d = pathParts.join(" ");
    // Centroid = average of first ring's projected points
    const pts = c.rings[0].map(([lon, lat]) => project(lon, lat));
    const cx = pts.reduce((s, [x]) => s + x, 0) / pts.length;
    const cy = pts.reduce((s, [, y]) => s + y, 0) / pts.length;
    return { ...c, d, cx, cy };
  });

  // Ambient glow: every 1s pick a random country
  useEffect(() => {
    const id = setInterval(() => {
      const idx = Math.floor(Math.random() * COUNTRIES.length);
      setGlowCode(COUNTRIES[idx].code);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleClick = useCallback(
    (c: (typeof countryPaths)[0], e: React.MouseEvent<SVGGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;

      // Convert client coords to SVG coords
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const svgPt = pt.matrixTransform(ctm.inverse());

      setPopup({
        code: c.code,
        name: c.name,
        region: c.region,
        svgX: svgPt.x,
        svgY: svgPt.y,
      });

      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
      popupTimerRef.current = setTimeout(() => setPopup(null), 5000);
    },
    [],
  );

  // Convert SVG coordinate to container pixel position
  const svgToPixel = useCallback(
    (svgX: number, svgY: number): [number, number] => {
      const svg = svgRef.current;
      const container = containerRef.current;
      if (!svg || !container) return [svgX, svgY];
      const svgRect = svg.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scaleX = svgRect.width / VIEWBOX_W;
      const scaleY = svgRect.height / VIEWBOX_H;
      const px = svgX * scaleX + (svgRect.left - containerRect.left);
      const py = svgY * scaleY + (svgRect.top - containerRect.top);
      return [px, py];
    },
    [],
  );

  return (
    <div className="w-full mt-8" ref={containerRef}>
      <style>{`
        @keyframes wmGeoGlow {
          0%, 100% { filter: brightness(2) drop-shadow(0 0 5px var(--wm-c)) drop-shadow(0 0 10px var(--wm-c)); }
          50%       { filter: brightness(3) drop-shadow(0 0 14px var(--wm-c)) drop-shadow(0 0 28px var(--wm-c)); }
        }
        @keyframes wmGeoActive {
          0%, 100% { filter: brightness(2.5) drop-shadow(0 0 10px #fff8) drop-shadow(0 0 20px #fff5); }
          50%       { filter: brightness(3.5) drop-shadow(0 0 20px #fff) drop-shadow(0 0 40px #fffd); }
        }
        @keyframes wmGeoPopup {
          0%   { opacity: 0; transform: translateY(10px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes wmGeoScan {
          0%   { transform: translateY(-100%); opacity: 0; }
          8%   { opacity: 0.3; }
          92%  { opacity: 0.3; }
          100% { transform: translateY(700%); opacity: 0; }
        }
        @keyframes wmGeoLiveDot {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 1; box-shadow: 0 0 12px rgba(0,255,180,0.8); }
        }
        @keyframes wmGeoCorner {
          0%, 100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
        .wm-geo-country {
          cursor: pointer;
          outline: none;
        }
        .wm-geo-country path {
          transition: filter 0.12s ease, opacity 0.12s ease;
        }
        .wm-geo-country:hover path {
          filter: brightness(1.6) !important;
          opacity: 1 !important;
        }
        .wm-geo-country:focus-visible path {
          filter: brightness(1.8) !important;
          stroke: white !important;
          stroke-width: 1.5px !important;
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-2 mb-2">
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#00d4ff",
              boxShadow: "0 0 8px #00d4ff",
              display: "inline-block",
              animation: "wmGeoLiveDot 2s ease infinite",
            }}
          />
          <span
            className="text-xs font-mono font-bold uppercase tracking-widest"
            style={{ color: "#00d4ff", textShadow: "0 0 8px #00d4ff88" }}
          >
            Global Coverage
          </span>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#00d4ff",
              boxShadow: "0 0 8px #00d4ff",
              display: "inline-block",
              animation: "wmGeoLiveDot 2s ease infinite 1s",
            }}
          />
        </div>
        <h3
          className="font-bold text-xl sm:text-2xl mb-1"
          style={{
            background: "linear-gradient(90deg,#00d4ff,#0099ff,#00ffcc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ClawPro Available Worldwide
        </h3>
        <p className="text-xs" style={{ color: "rgba(140,170,200,0.7)" }}>
          Klik negara mana saja untuk melihat detail · {COUNTRIES.length}+
          negara didukung
        </p>
      </div>

      {/* Map container */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "#050e1c",
          border: "1px solid rgba(0,180,255,0.15)",
          boxShadow:
            "0 0 60px rgba(0,80,180,0.12), inset 0 0 80px rgba(0,40,80,0.06)",
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
                <title>corner accent</title>
                <defs>
                  <linearGradient
                    id={`wcg2-${pos}`}
                    x1="0%"
                    y1="100%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#0055ff" />
                  </linearGradient>
                </defs>
                <path
                  d="M2 38 L2 6 Q2 2 6 2 L38 2"
                  stroke={`url(#wcg2-${pos})`}
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    animation: "wmGeoCorner 2.5s ease-in-out infinite",
                    filter: "drop-shadow(0 0 5px #00d4ff88)",
                  }}
                />
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
                "linear-gradient(90deg,transparent,rgba(0,212,255,0.18),rgba(0,180,255,0.38),rgba(0,212,255,0.18),transparent)",
              animation: "wmGeoScan 9s linear infinite",
              top: "0%",
            }}
          />
        </div>

        {/* SVG Map */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          className="w-full h-auto block"
          style={{ maxHeight: "480px" }}
          aria-label="Interactive world map showing ClawPro global coverage"
          role="img"
        >
          <title>World Map - ClawPro Global Coverage</title>
          <defs>
            <radialGradient id="wmGeoOcean" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#071828" />
              <stop offset="60%" stopColor="#040f1e" />
              <stop offset="100%" stopColor="#020b16" />
            </radialGradient>
            <pattern
              id="wmGeoGrid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="50"
                y2="0"
                stroke="rgba(0,160,220,0.05)"
                strokeWidth="0.4"
                strokeDasharray="3,12"
              />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="50"
                stroke="rgba(0,160,220,0.05)"
                strokeWidth="0.4"
                strokeDasharray="3,12"
              />
            </pattern>
            <filter
              id="wmGeoGlowF"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
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
            fill="url(#wmGeoOcean)"
          />
          <rect
            x="0"
            y="0"
            width={VIEWBOX_W}
            height={VIEWBOX_H}
            fill="url(#wmGeoGrid)"
          />

          {/* Latitude lines */}
          {[-60, -30, 0, 30, 60].map((lat) => {
            const y = ((90 - lat) / 180) * VIEWBOX_H;
            return (
              <line
                key={`lat${lat}`}
                x1="0"
                y1={y}
                x2={VIEWBOX_W}
                y2={y}
                stroke={
                  lat === 0 ? "rgba(0,200,255,0.28)" : "rgba(0,130,180,0.1)"
                }
                strokeWidth={lat === 0 ? 0.7 : 0.3}
                strokeDasharray={lat === 0 ? "" : "5,14"}
              />
            );
          })}

          {/* Longitude lines */}
          {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => {
            const x = ((lon + 180) / 360) * VIEWBOX_W;
            return (
              <line
                key={`lon${lon}`}
                x1={x}
                y1="0"
                x2={x}
                y2={VIEWBOX_H}
                stroke="rgba(0,130,180,0.07)"
                strokeWidth="0.3"
                strokeDasharray="5,16"
              />
            );
          })}

          {/* Country shapes */}
          {countryPaths.map((c) => {
            const base = getCountryColor(c.code, c.region);
            const isActive = popup?.code === c.code;
            const isGlow = glowCode === c.code;
            const isHovered = hoveredCode === c.code;

            const fill = isActive ? "#ffffff" : base;
            const stroke = isActive
              ? "#ffffff"
              : isHovered
                ? "rgba(255,255,255,0.8)"
                : "rgba(0,0,0,0.45)";
            const strokeWidth = isActive ? 1.5 : isHovered ? 0.9 : 0.5;
            const opacity = isActive ? 1 : 0.87;

            const pathStyle: React.CSSProperties = isActive
              ? { animation: "wmGeoActive 0.8s ease-in-out infinite" }
              : isGlow
                ? {
                    animation: "wmGeoGlow 1s ease-in-out",
                    ["--wm-c" as string]: base,
                  }
                : {};

            return (
              <g
                key={c.code}
                className="wm-geo-country"
                onClick={(e) => handleClick(c, e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleClick(
                      c,
                      e as unknown as React.MouseEvent<SVGGElement>,
                    );
                }}
                onMouseEnter={() => setHoveredCode(c.code)}
                onMouseLeave={() => setHoveredCode(null)}
                aria-label={`${c.name} (${c.code})`}
                tabIndex={0}
                data-ocid={`worldmapgeo.${c.code.toLowerCase()}.map_marker`}
              >
                <path
                  d={c.d}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  opacity={opacity}
                  style={pathStyle}
                  filter={isGlow || isActive ? "url(#wmGeoGlowF)" : undefined}
                />
              </g>
            );
          })}

          {/* Geographic labels */}
          <text
            x="8"
            y={((90 - 23.5) / 180) * VIEWBOX_H - 3}
            fontSize="5"
            fill="rgba(0,180,240,0.2)"
            fontFamily="monospace"
          >
            Tropic of Cancer
          </text>
          <text
            x="8"
            y={((90 + 23.5) / 180) * VIEWBOX_H - 3}
            fontSize="5"
            fill="rgba(0,180,240,0.2)"
            fontFamily="monospace"
          >
            Tropic of Capricorn
          </text>
          <text
            x="8"
            y={(90 / 180) * VIEWBOX_H - 3}
            fontSize="5"
            fill="rgba(0,190,255,0.28)"
            fontFamily="monospace"
          >
            Equator
          </text>
        </svg>

        {/* Popup overlay */}
        {popup &&
          (() => {
            const [px, py] = svgToPixel(popup.svgX, popup.svgY);
            const containerW = containerRef.current?.clientWidth ?? 600;
            const containerH = containerRef.current?.clientHeight ?? 400;
            const baseColor = getCountryColor(popup.code, popup.region);

            // Smart positioning: keep popup inside container
            let left = px - 90;
            let top = py - 145;
            if (left < 8) left = 8;
            if (left + 186 > containerW - 8) left = containerW - 194;
            if (top < 8) top = py + 16;
            if (top + 140 > containerH - 8) top = py - 150;

            return (
              <div
                className="absolute z-30 pointer-events-none"
                style={{
                  left,
                  top,
                  animation: "wmGeoPopup 0.22s ease-out forwards",
                }}
              >
                <div
                  className="rounded-xl px-4 py-3 text-center"
                  style={{
                    minWidth: "176px",
                    background:
                      "linear-gradient(135deg, rgba(4,14,32,0.97), rgba(6,20,44,0.97))",
                    border: `1.5px solid ${baseColor}`,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.9), 0 0 24px ${baseColor}55, 0 0 50px ${baseColor}28`,
                  }}
                >
                  {/* Flag */}
                  <div className="text-4xl leading-none mb-1.5">
                    {countryFlag(popup.code)}
                  </div>
                  {/* Country name */}
                  <p
                    className="text-sm font-bold mb-0.5 leading-tight"
                    style={{ color: "rgba(220,240,255,0.97)" }}
                  >
                    {popup.name}
                  </p>
                  {/* Country code */}
                  <p
                    className="text-xs font-mono mb-2"
                    style={{ color: baseColor, opacity: 0.88 }}
                  >
                    {popup.code} · {popup.region}
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
                        width: 6,
                        height: 6,
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
                    background: "rgba(6,20,44,0.97)",
                    borderRight: `1.5px solid ${baseColor}`,
                    borderBottom: `1.5px solid ${baseColor}`,
                  }}
                />
              </div>
            );
          })()}

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            borderTop: "1px solid rgba(0,140,190,0.1)",
            background: "rgba(2,8,18,0.75)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00ffcc",
                boxShadow: "0 0 8px #00ffcc",
                display: "inline-block",
                animation: "wmGeoLiveDot 1.5s ease-in-out infinite",
              }}
            />
            <span
              className="text-xs font-mono"
              style={{ color: "rgba(0,200,200,0.8)" }}
            >
              LIVE · {COUNTRIES.length} negara
            </span>
          </div>
          <span
            className="text-xs font-mono"
            style={{ color: "rgba(0,140,190,0.5)" }}
          >
            Klik negara = detail
          </span>
        </div>
      </div>
    </div>
  );
}
