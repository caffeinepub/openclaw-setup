/**
 * BatikBackground - SVG-based teal/tosca ornamental batik-inspired pattern
 * for the CryptoMarketPage. Neon glowing teal motifs on dark background.
 */
export function BatikBackground() {
  const svgPattern = `
    <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
      <defs>
        <filter id='glow'>
          <feGaussianBlur stdDeviation='1.5' result='blur'/>
          <feMerge><feMergeNode in='blur'/><feMergeNode in='SourceGraphic'/></feMerge>
        </filter>
      </defs>
      <!-- Central floral circle -->
      <circle cx='60' cy='60' r='18' fill='none' stroke='%2300CEC9' stroke-width='1' opacity='0.55' filter='url(%23glow)'/>
      <circle cx='60' cy='60' r='10' fill='none' stroke='%2320E3D5' stroke-width='0.8' opacity='0.4'/>
      <circle cx='60' cy='60' r='4' fill='%2300B8A9' opacity='0.5'/>
      <!-- Petal curves (4 petals) -->
      <path d='M60,42 Q70,52 60,60 Q50,52 60,42' fill='none' stroke='%2300CEC9' stroke-width='0.8' opacity='0.45'/>
      <path d='M78,60 Q68,70 60,60 Q68,50 78,60' fill='none' stroke='%2300CEC9' stroke-width='0.8' opacity='0.45'/>
      <path d='M60,78 Q50,68 60,60 Q70,68 60,78' fill='none' stroke='%2300CEC9' stroke-width='0.8' opacity='0.45'/>
      <path d='M42,60 Q52,50 60,60 Q52,70 42,60' fill='none' stroke='%2300CEC9' stroke-width='0.8' opacity='0.45'/>
      <!-- Diamond frame -->
      <polygon points='60,30 90,60 60,90 30,60' fill='none' stroke='%2300B8A9' stroke-width='0.7' opacity='0.3'/>
      <!-- Corner micro circles -->
      <circle cx='0' cy='0' r='6' fill='none' stroke='%2320E3D5' stroke-width='0.8' opacity='0.4'/>
      <circle cx='120' cy='0' r='6' fill='none' stroke='%2320E3D5' stroke-width='0.8' opacity='0.4'/>
      <circle cx='0' cy='120' r='6' fill='none' stroke='%2320E3D5' stroke-width='0.8' opacity='0.4'/>
      <circle cx='120' cy='120' r='6' fill='none' stroke='%2320E3D5' stroke-width='0.8' opacity='0.4'/>
      <!-- Connecting lines to corners -->
      <line x1='60' y1='30' x2='60' y2='0' stroke='%2300CEC9' stroke-width='0.5' opacity='0.3'/>
      <line x1='90' y1='60' x2='120' y2='60' stroke='%2300CEC9' stroke-width='0.5' opacity='0.3'/>
      <line x1='60' y1='90' x2='60' y2='120' stroke='%2300CEC9' stroke-width='0.5' opacity='0.3'/>
      <line x1='30' y1='60' x2='0' y2='60' stroke='%2300CEC9' stroke-width='0.5' opacity='0.3'/>
      <!-- Mid-edge accent dots -->
      <circle cx='60' cy='15' r='2' fill='%2320E3D5' opacity='0.5'/>
      <circle cx='105' cy='60' r='2' fill='%2320E3D5' opacity='0.5'/>
      <circle cx='60' cy='105' r='2' fill='%2320E3D5' opacity='0.5'/>
      <circle cx='15' cy='60' r='2' fill='%2320E3D5' opacity='0.5'/>
    </svg>
  `;

  const encoded = `data:image/svg+xml,${svgPattern.trim().replace(/\s+/g, " ")}`;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Tiled batik pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${encoded}")`,
          backgroundSize: "120px 120px",
          backgroundRepeat: "repeat",
          opacity: 0.35,
          filter: "drop-shadow(0 0 3px rgba(0,206,201,0.6))",
        }}
      />
      {/* Teal ambient glow overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 20%, rgba(0,180,169,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 80% 80%, rgba(0,206,201,0.06) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
