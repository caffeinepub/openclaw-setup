import type React from "react";

// Payment logos SVG components
function MastercardLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.63}
      viewBox="0 0 48 30"
      fill="none"
      role="img"
      aria-label="Mastercard"
    >
      <title>Mastercard</title>
      <rect width="48" height="30" rx="4" fill="#252525" />
      <circle cx="18" cy="15" r="9" fill="#EB001B" />
      <circle cx="30" cy="15" r="9" fill="#F79E1B" />
      <path d="M24 8.3a9 9 0 0 1 0 13.4A9 9 0 0 1 24 8.3z" fill="#FF5F00" />
    </svg>
  );
}

function VisaLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size * 1.6}
      height={size * 0.5}
      viewBox="0 0 80 26"
      fill="none"
      role="img"
      aria-label="Visa"
    >
      <title>Visa</title>
      <rect width="80" height="26" rx="4" fill="#1A1F71" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        letterSpacing="1"
      >
        VISA
      </text>
    </svg>
  );
}

function BitcoinLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="Bitcoin"
    >
      <title>Bitcoin</title>
      <circle cx="24" cy="24" r="22" fill="#F7931A" />
      <path
        d="M33.5 21.5c.5-3.3-2-5-5.4-6.2l1.1-4.4-2.7-.7-1.1 4.3c-.7-.2-1.4-.4-2.1-.5l1.1-4.4-2.7-.7-1.1 4.4c-.6-.1-1.2-.3-1.7-.4l-3.7-.9-.7 2.9s2 .5 2 .5c1.1.3 1.3 1 1.3 1.6l-1.3 5.2c.1 0 .2.1.3.1-.1 0-.2-.1-.3-.1l-1.8 7.3c-.1.4-.5.9-1.3.7 0 0-2-.5-2-.5l-1.4 3.1 3.5.9c.6.2 1.3.3 1.9.5l-1.1 4.5 2.7.7 1.1-4.4c.7.2 1.4.4 2.1.5l-1.1 4.3 2.7.7 1.1-4.5c4.6.9 8 .5 9.5-3.6 1.2-3.3-.1-5.2-2.5-6.4 1.8-.5 3.1-1.8 3.4-4.5zm-6.1 8.6c-.8 3.3-6.5 1.5-8.3 1.1l1.5-5.9c1.8.5 7.5 1.4 6.8 4.8zm.9-8.6c-.8 3-5.7 1.5-7.3 1.1l1.3-5.3c1.6.4 6.8 1.2 6 4.2z"
        fill="white"
      />
    </svg>
  );
}

function PaypalLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size * 1.2}
      height={size * 0.7}
      viewBox="0 0 60 36"
      fill="none"
      role="img"
      aria-label="PayPal"
    >
      <title>PayPal</title>
      <rect width="60" height="36" rx="4" fill="#003087" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontSize="13"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        PayPal
      </text>
    </svg>
  );
}

function USDTLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size * 1.3}
      height={size * 0.6}
      viewBox="0 0 64 30"
      fill="none"
      role="img"
      aria-label="USDT Tether"
    >
      <title>USDT Tether</title>
      <rect width="64" height="30" rx="4" fill="#26A17B" />
      <circle cx="15" cy="15" r="10" fill="#1a7a5e" />
      <text
        x="15"
        y="20"
        dominantBaseline="auto"
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        ₮
      </text>
      <text
        x="42"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        letterSpacing="0.5"
      >
        USDT
      </text>
    </svg>
  );
}

function StripeLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size * 1.4}
      height={size * 0.6}
      viewBox="0 0 68 30"
      fill="none"
      role="img"
      aria-label="Stripe"
    >
      <title>Stripe</title>
      <rect width="68" height="30" rx="4" fill="#635BFF" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontSize="13"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        letterSpacing="0.8"
      >
        stripe
      </text>
    </svg>
  );
}

function QRISLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size * 1.5}
      height={size * 0.6}
      viewBox="0 0 72 28"
      fill="none"
      role="img"
      aria-label="QRIS"
    >
      <title>QRIS</title>
      <rect width="72" height="28" rx="4" fill="white" />
      <rect
        x="1"
        y="1"
        width="70"
        height="26"
        rx="3"
        stroke="#E31E24"
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="4"
        y="4"
        width="8"
        height="8"
        rx="1"
        stroke="#E31E24"
        strokeWidth="1.2"
        fill="none"
      />
      <rect x="6" y="6" width="4" height="4" fill="#E31E24" />
      <rect
        x="4"
        y="16"
        width="8"
        height="8"
        rx="1"
        stroke="#E31E24"
        strokeWidth="1.2"
        fill="none"
      />
      <rect x="6" y="18" width="4" height="4" fill="#E31E24" />
      <rect
        x="16"
        y="4"
        width="8"
        height="8"
        rx="1"
        stroke="#E31E24"
        strokeWidth="1.2"
        fill="none"
      />
      <rect x="18" y="6" width="4" height="4" fill="#E31E24" />
      <text
        x="42"
        y="14"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#E31E24"
        fontSize="8"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        QRIS
      </text>
      <text
        x="42"
        y="22"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#666"
        fontSize="5"
        fontFamily="Arial, sans-serif"
      >
        Quick Response
      </text>
    </svg>
  );
}

const PAYMENT_ITEMS = [
  { id: "paypal", component: <PaypalLogo size={48} />, label: "PayPal" },
  { id: "qris", component: <QRISLogo size={48} />, label: "QRIS IDR" },
  { id: "usdt", component: <USDTLogo size={48} />, label: "USDT" },
  { id: "bitcoin", component: <BitcoinLogo size={48} />, label: "Bitcoin" },
  { id: "stripe", component: <StripeLogo size={48} />, label: "Stripe" },
  {
    id: "mastercard",
    component: <MastercardLogo size={48} />,
    label: "Mastercard",
  },
  { id: "visa", component: <VisaLogo size={48} />, label: "Visa" },
];

const PAYMENT_LOOP = [...PAYMENT_ITEMS, ...PAYMENT_ITEMS, ...PAYMENT_ITEMS];

function MarqueeTrack({
  items,
  speed = 30,
}: {
  items: { id: string; component: React.ReactNode; label: string }[];
  speed?: number;
}): React.JSX.Element {
  const duration = `${items.length * speed}s`;
  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-6 items-center w-max marquee-left"
        style={{ animationDuration: duration }}
      >
        {items.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl bg-muted/30 border border-border backdrop-blur-sm shrink-0 hover:bg-muted/50 transition-colors"
            title={item.label}
          >
            {item.component}
            <span className="text-[10px] text-muted-foreground font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaymentMarquee() {
  return (
    <div className="relative py-4 overflow-hidden border-y border-border bg-background/60 backdrop-blur-sm">
      <div className="flex items-center gap-4 px-6 mb-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest shrink-0">
          Accepted Payments
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>
      <MarqueeTrack items={PAYMENT_LOOP} speed={4} />
    </div>
  );
}
