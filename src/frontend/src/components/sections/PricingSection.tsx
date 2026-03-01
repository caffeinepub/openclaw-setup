import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  ChevronLeft,
  Copy,
  Crown,
  Eye,
  EyeOff,
  Gem,
  Loader2,
  LogIn,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  MembershipTier,
  useMyMembership,
  usePurchaseMembership,
} from "../../hooks/useMembership";
import { useLanguage } from "../../i18n/LanguageContext";
import { DotsBackground } from "../DotsBackground";

// ─── Payment method icons (inline SVG, no external dependencies) ───────────

function MastercardIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      role="img"
      aria-label="Mastercard"
      width={size}
      height={size * 0.63}
      viewBox="0 0 38 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="38" height="24" rx="4" fill="#1A1A1A" />
      <circle cx="15" cy="12" r="7" fill="#EB001B" />
      <circle cx="23" cy="12" r="7" fill="#F79E1B" />
      <path d="M19 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 19 6.8z" fill="#FF5F00" />
    </svg>
  );
}

function VisaIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      role="img"
      aria-label="Visa"
      width={size}
      height={size * 0.63}
      viewBox="0 0 38 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="38" height="24" rx="4" fill="#1A3A6B" />
      <text
        x="6"
        y="17"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="11"
        fill="white"
        letterSpacing="0.5"
      >
        VISA
      </text>
    </svg>
  );
}

function PayPalIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      role="img"
      aria-label="PayPal"
      width={size}
      height={size * 0.63}
      viewBox="0 0 38 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="38" height="24" rx="4" fill="#003087" />
      <text
        x="5"
        y="17"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="10"
        fill="#009CDE"
      >
        Pay
      </text>
      <text
        x="18"
        y="17"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="10"
        fill="white"
      >
        Pal
      </text>
    </svg>
  );
}

function BitcoinIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      role="img"
      aria-label="Bitcoin"
      width={size}
      height={size * 0.63}
      viewBox="0 0 38 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="38" height="24" rx="4" fill="#1A1A1A" />
      <text
        x="7"
        y="17"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="13"
        fill="#F7931A"
      >
        ₿
      </text>
      <text
        x="20"
        y="17"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="8"
        fill="#F7931A"
        letterSpacing="0.5"
      >
        BTC
      </text>
    </svg>
  );
}

function QrisIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      role="img"
      aria-label="QRIS"
      width={size}
      height={size * 0.63}
      viewBox="0 0 38 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="38" height="24" rx="4" fill="#CC0000" />
      <text
        x="5"
        y="16"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="9"
        fill="white"
        letterSpacing="0.5"
      >
        QRIS
      </text>
      <rect
        x="27"
        y="4"
        width="8"
        height="8"
        rx="1"
        fill="white"
        opacity="0.9"
      />
      <rect x="29" y="6" width="4" height="4" rx="0.5" fill="#CC0000" />
      <text
        x="5"
        y="22"
        fontFamily="Arial"
        fontSize="5"
        fill="white"
        opacity="0.8"
      >
        Bank IDR
      </text>
    </svg>
  );
}

// ─── Payment method full icons for the selection dialog ───────────────────

function MastercardLargeIcon() {
  return (
    <svg
      role="img"
      aria-label="Mastercard"
      width="52"
      height="34"
      viewBox="0 0 52 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="52" height="34" rx="6" fill="#1A1A1A" />
      <circle cx="20" cy="17" r="10" fill="#EB001B" />
      <circle cx="32" cy="17" r="10" fill="#F79E1B" />
      <path d="M26 9.4a10 10 0 0 1 0 15.2A10 10 0 0 1 26 9.4z" fill="#FF5F00" />
    </svg>
  );
}

function VisaLargeIcon() {
  return (
    <svg
      role="img"
      aria-label="Visa"
      width="52"
      height="34"
      viewBox="0 0 52 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="52" height="34" rx="6" fill="#1A3A6B" />
      <text
        x="7"
        y="23"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="15"
        fill="white"
        letterSpacing="1"
      >
        VISA
      </text>
    </svg>
  );
}

function PayPalLargeIcon() {
  return (
    <svg
      role="img"
      aria-label="PayPal"
      width="52"
      height="34"
      viewBox="0 0 52 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="52" height="34" rx="6" fill="#003087" />
      <text
        x="6"
        y="22"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="13"
        fill="#009CDE"
      >
        Pay
      </text>
      <text
        x="27"
        y="22"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="13"
        fill="white"
      >
        Pal
      </text>
    </svg>
  );
}

function BitcoinLargeIcon() {
  return (
    <svg
      role="img"
      aria-label="Bitcoin"
      width="52"
      height="34"
      viewBox="0 0 52 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="52" height="34" rx="6" fill="#1A1A1A" />
      <text
        x="8"
        y="24"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="18"
        fill="#F7931A"
      >
        ₿
      </text>
      <text
        x="27"
        y="24"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="11"
        fill="#F7931A"
        letterSpacing="0.5"
      >
        BTC
      </text>
    </svg>
  );
}

function QrisLargeIcon() {
  return (
    <svg
      role="img"
      aria-label="QRIS"
      width="52"
      height="34"
      viewBox="0 0 52 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="52" height="34" rx="6" fill="#CC0000" />
      <text
        x="6"
        y="19"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="11"
        fill="white"
        letterSpacing="1"
      >
        QRIS
      </text>
      <rect
        x="37"
        y="5"
        width="11"
        height="11"
        rx="1.5"
        fill="white"
        opacity="0.9"
      />
      <rect x="40" y="8" width="5" height="5" rx="0.5" fill="#CC0000" />
      <text
        x="6"
        y="30"
        fontFamily="Arial"
        fontSize="7"
        fill="white"
        opacity="0.85"
      >
        Bank IDR
      </text>
    </svg>
  );
}

// ─── Payment Methods Strip (mini badges under each card) ─────────────────

function PaymentMethodsStrip({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mt-3 mb-1">
      <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">
        {label}:
      </span>
      <div className="flex items-center gap-1.5">
        <MastercardIcon size={24} />
        <VisaIcon size={24} />
        <PayPalIcon size={24} />
        <BitcoinIcon size={24} />
        <QrisIcon size={24} />
      </div>
    </div>
  );
}

// ─── Card Payment Form ─────────────────────────────────────────────────────

interface CardFormData {
  cardNumber: string;
  cardName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

interface CardPaymentFormProps {
  data: CardFormData;
  onChange: (data: CardFormData) => void;
  error: string;
}

function CardPaymentForm({ data, onChange, error }: CardPaymentFormProps) {
  const { t } = useLanguage();
  const [showCvv, setShowCvv] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="card-number" className="text-sm text-foreground">
          {t.pricing.cardNumber}
        </Label>
        <Input
          id="card-number"
          value={data.cardNumber}
          onChange={(e) =>
            onChange({ ...data, cardNumber: formatCardNumber(e.target.value) })
          }
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          className="bg-background border-border font-mono tracking-widest"
          inputMode="numeric"
          autoComplete="cc-number"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="card-name" className="text-sm text-foreground">
          {t.pricing.cardName}
        </Label>
        <Input
          id="card-name"
          value={data.cardName}
          onChange={(e) => onChange({ ...data, cardName: e.target.value })}
          placeholder="JOHN DOE"
          className="bg-background border-border uppercase"
          autoComplete="cc-name"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm text-foreground">
            {t.pricing.expiryMonth}
          </Label>
          <Select
            value={data.expiryMonth}
            onValueChange={(v) => onChange({ ...data, expiryMonth: v })}
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm text-foreground">
            {t.pricing.expiryYear}
          </Label>
          <Select
            value={data.expiryYear}
            onValueChange={(v) => onChange({ ...data, expiryYear: v })}
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="YYYY" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="card-cvv" className="text-sm text-foreground">
            {t.pricing.cvv}
          </Label>
          <div className="relative">
            <Input
              id="card-cvv"
              value={data.cvv}
              onChange={(e) =>
                onChange({
                  ...data,
                  cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                })
              }
              type={showCvv ? "text" : "password"}
              placeholder="•••"
              maxLength={4}
              className="bg-background border-border pr-9 font-mono"
              autoComplete="cc-csc"
              inputMode="numeric"
            />
            <button
              type="button"
              onClick={() => setShowCvv((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showCvv ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── QRIS Payment Form ─────────────────────────────────────────────────────

const QRIS_IDR_PRICES: Record<number, string> = {
  9.99: "Rp 160.000",
  29.99: "Rp 475.000",
  79.99: "Rp 1.270.000",
};

function QrisPaymentForm({ tierPrice }: { tierPrice: number }) {
  const { t } = useLanguage();
  const idrAmount =
    QRIS_IDR_PRICES[tierPrice] ??
    `Rp ${Math.round(tierPrice * 15900).toLocaleString("id-ID")}`;

  const handleCopy = () => {
    navigator.clipboard.writeText("1234567890");
    toast.success("Account number copied!");
  };

  return (
    <div className="space-y-4">
      {/* QR Code placeholder */}
      <div className="flex justify-center">
        <div
          className="w-36 h-36 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-background/50"
          style={{ position: "relative" }}
        >
          <svg
            viewBox="0 0 100 100"
            width="100"
            height="100"
            className="opacity-80"
            role="img"
            aria-label="QRIS Code"
          >
            <title>QRIS Code</title>
            {/* QR pattern placeholder */}
            <rect
              x="10"
              y="10"
              width="30"
              height="30"
              rx="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <rect
              x="15"
              y="15"
              width="20"
              height="20"
              rx="1"
              fill="currentColor"
              opacity="0.7"
            />
            <rect
              x="60"
              y="10"
              width="30"
              height="30"
              rx="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <rect
              x="65"
              y="15"
              width="20"
              height="20"
              rx="1"
              fill="currentColor"
              opacity="0.7"
            />
            <rect
              x="10"
              y="60"
              width="30"
              height="30"
              rx="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <rect
              x="15"
              y="65"
              width="20"
              height="20"
              rx="1"
              fill="currentColor"
              opacity="0.7"
            />
            {/* Random dots */}
            <rect
              x="50"
              y="45"
              width="5"
              height="5"
              fill="currentColor"
              opacity="0.6"
            />
            <rect
              x="58"
              y="45"
              width="5"
              height="5"
              fill="currentColor"
              opacity="0.6"
            />
            <rect
              x="50"
              y="53"
              width="5"
              height="5"
              fill="currentColor"
              opacity="0.6"
            />
            <rect
              x="66"
              y="53"
              width="5"
              height="5"
              fill="currentColor"
              opacity="0.6"
            />
            <rect
              x="74"
              y="45"
              width="5"
              height="5"
              fill="currentColor"
              opacity="0.6"
            />
            <rect
              x="42"
              y="50"
              width="4"
              height="4"
              fill="currentColor"
              opacity="0.5"
            />
            <rect
              x="50"
              y="60"
              width="5"
              height="5"
              fill="currentColor"
              opacity="0.6"
            />
            <rect
              x="58"
              y="68"
              width="5"
              height="5"
              fill="currentColor"
              opacity="0.6"
            />
            <rect
              x="74"
              y="60"
              width="5"
              height="5"
              fill="currentColor"
              opacity="0.6"
            />
            <rect
              x="66"
              y="75"
              width="5"
              height="5"
              fill="currentColor"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      {/* Bank details */}
      <div className="bg-muted/30 rounded-xl border border-border p-4 space-y-2.5">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Bank</span>
          <span className="font-semibold text-foreground">
            Bank Central Asia (BCA)
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Account No.</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-foreground">
              1234567890
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Account Name</span>
          <span className="font-semibold text-foreground">
            ClawPro Indonesia
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-bold text-amber-400 text-base">
            {idrAmount}
          </span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 leading-relaxed">
        ⚠️ {t.pricing.qrisInfo}
      </div>
    </div>
  );
}

// ─── Payment Method Dialog ────────────────────────────────────────────────

type PaymentMethod = "mastercard" | "visa" | "paypal" | "bitcoin" | "qris";

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "mastercard", label: "Mastercard", icon: <MastercardLargeIcon /> },
  { id: "visa", label: "Visa", icon: <VisaLargeIcon /> },
  { id: "paypal", label: "PayPal", icon: <PayPalLargeIcon /> },
  { id: "bitcoin", label: "Bitcoin", icon: <BitcoinLargeIcon /> },
  { id: "qris", label: "QRIS / Bank IDR", icon: <QrisLargeIcon /> },
];

interface PaymentMethodDialogProps {
  open: boolean;
  tierName: string;
  tierPrice: number;
  onConfirm: () => void;
  onClose: () => void;
}

function PaymentMethodDialog({
  open,
  tierName,
  tierPrice,
  onConfirm,
  onClose,
}: PaymentMethodDialogProps) {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [step, setStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState("");

  // Card form state
  const [cardData, setCardData] = useState<CardFormData>({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  // PayPal / Bitcoin single field
  const [paypalUsername, setPaypalUsername] = useState("");
  const [bitcoinWallet, setBitcoinWallet] = useState("");

  const handleClose = () => {
    if (isProcessing) return;
    setSelectedMethod(null);
    setStep(1);
    setCardError("");
    setCardData({
      cardNumber: "",
      cardName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    });
    setPaypalUsername("");
    setBitcoinWallet("");
    onClose();
  };

  const handleContinue = () => {
    if (!selectedMethod) return;
    setStep(2);
    setCardError("");
  };

  const handleBack = () => {
    setStep(1);
    setCardError("");
  };

  const validateAndConfirm = async () => {
    if (selectedMethod === "mastercard" || selectedMethod === "visa") {
      const digitsOnly = cardData.cardNumber.replace(/\s/g, "");
      if (
        digitsOnly.length !== 16 ||
        !cardData.cardName.trim() ||
        !cardData.expiryMonth ||
        !cardData.expiryYear ||
        cardData.cvv.length < 3
      ) {
        setCardError(t.pricing.cardError);
        return;
      }
    } else if (selectedMethod === "paypal") {
      if (!paypalUsername.trim()) {
        setCardError(t.pricing.cardError);
        return;
      }
    } else if (selectedMethod === "bitcoin") {
      if (!bitcoinWallet.trim()) {
        setCardError(t.pricing.cardError);
        return;
      }
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    handleClose();
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground font-display font-bold text-xl">
            {step === 1 ? t.pricing.choosePayment : t.pricing.paymentStep2Label}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {tierName} — ${tierPrice}
            {t.pricing.perMonth}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="py-2"
            >
              <p className="text-xs text-muted-foreground mb-4">
                {t.pricing.selectMethod}
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PAYMENT_METHODS.map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`
                      relative flex flex-col items-center gap-2.5 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer
                      ${
                        selectedMethod === method.id
                          ? "border-primary bg-primary/10 shadow-[0_0_12px_oklch(var(--primary)/0.3)]"
                          : "border-border/60 bg-card hover:border-border hover:bg-muted/30"
                      }
                    `}
                  >
                    {method.icon}
                    <span className="text-[10px] font-semibold text-foreground text-center leading-tight">
                      {method.label}
                    </span>
                    <AnimatePresence>
                      {selectedMethod === method.id && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Check className="w-2.5 h-2.5 text-primary-foreground" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18 }}
              className="py-2"
            >
              {(selectedMethod === "mastercard" ||
                selectedMethod === "visa") && (
                <CardPaymentForm
                  data={cardData}
                  onChange={setCardData}
                  error={cardError}
                />
              )}

              {selectedMethod === "paypal" && (
                <div className="space-y-4">
                  {cardError && (
                    <div className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                      {cardError}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="paypal-user"
                      className="text-sm text-foreground"
                    >
                      {t.pricing.paypalUsername}
                    </Label>
                    <Input
                      id="paypal-user"
                      value={paypalUsername}
                      onChange={(e) => setPaypalUsername(e.target.value)}
                      placeholder="yourname@email.com"
                      className="bg-background border-border"
                      type="email"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 leading-relaxed">
                    💳 Your PayPal account will be connected. Compatible with
                    Trust Wallet and MetaMask wallets.
                  </div>
                </div>
              )}

              {selectedMethod === "bitcoin" && (
                <div className="space-y-4">
                  {cardError && (
                    <div className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                      {cardError}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="btc-wallet"
                      className="text-sm text-foreground"
                    >
                      {t.pricing.bitcoinWallet}
                    </Label>
                    <Input
                      id="btc-wallet"
                      value={bitcoinWallet}
                      onChange={(e) => setBitcoinWallet(e.target.value)}
                      placeholder="bc1q..."
                      className="bg-background border-border font-mono text-xs"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 leading-relaxed">
                    ₿ Send payment to the wallet address provided after
                    confirmation. Compatible with Trust Wallet and MetaMask.
                  </div>
                </div>
              )}

              {selectedMethod === "qris" && (
                <QrisPaymentForm tierPrice={tierPrice} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter className="gap-2 sm:gap-2">
          {step === 1 ? (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!selectedMethod}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {t.pricing.continue}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isProcessing}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t.pricing.back}
              </Button>
              <Button
                onClick={validateAndConfirm}
                disabled={isProcessing}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t.pricing.paymentProcessing}
                  </>
                ) : selectedMethod === "qris" ? (
                  t.pricing.iHaveTransferred
                ) : (
                  t.pricing.confirmPayment
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Tier config types ────────────────────────────────────────────────────

interface TierConfig {
  tier: MembershipTier;
  name: string;
  price: number;
  icon: React.ReactNode;
  tagline: string;
  features: string[];
  accentColor: string;
  glowColor: string;
  borderColor: string;
  bgGradient: string;
  badgeClass: string;
  buttonClass: string;
  popular?: boolean;
}

const TIER_ORDER = [
  MembershipTier.silver,
  MembershipTier.gold,
  MembershipTier.platinum,
];

function getTierRank(tier: MembershipTier): number {
  return TIER_ORDER.indexOf(tier);
}

function formatPurchaseDate(nanoseconds: bigint, locale: string): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Pricing Card ─────────────────────────────────────────────────────────

function PricingCard({
  config,
  onExploreTier,
}: {
  config: TierConfig;
  onExploreTier?: (tier: MembershipTier) => void;
}) {
  const { identity } = useInternetIdentity();
  const { data: myMembership, isLoading: membershipLoading } =
    useMyMembership();
  const { mutate: purchase, isPending } = usePurchaseMembership();
  const { t, language } = useLanguage();

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const isActive = myMembership && myMembership.tier === config.tier;
  const currentTierRank = myMembership ? getTierRank(myMembership.tier) : -1;
  const thisTierRank = getTierRank(config.tier);
  const isUpgrade = myMembership && thisTierRank > currentTierRank;
  const isDowngrade = myMembership && thisTierRank < currentTierRank;

  const localeMap: Record<string, string> = {
    en: "en-US",
    id: "id-ID",
    ar: "ar-SA",
    ru: "ru-RU",
  };

  const handleBuyClick = () => {
    if (!identity) {
      toast.error(t.pricing.toastLoginRequired);
      return;
    }
    setPaymentDialogOpen(true);
  };

  const handlePaymentConfirmed = () => {
    setPaymentDialogOpen(false);
    purchase(config.tier, {
      onSuccess: () => {
        toast.success(`${config.name} ${t.pricing.toastSuccess}`);
      },
      onError: () => {
        toast.error(t.pricing.toastError);
      },
    });
  };

  const getButtonLabel = () => {
    if (membershipLoading) return t.pricing.loading;
    if (isActive) return null;
    if (!identity) return t.pricing.loginToBuy;
    if (isUpgrade) return `${t.pricing.upgradeTo} ${config.name}`;
    if (isDowngrade) return `${t.pricing.downgradeTo} ${config.name}`;
    return t.pricing.buyNow;
  };

  const buttonLabel = getButtonLabel();

  return (
    <>
      <PaymentMethodDialog
        open={paymentDialogOpen}
        tierName={config.name}
        tierPrice={config.price}
        onConfirm={handlePaymentConfirmed}
        onClose={() => setPaymentDialogOpen(false)}
      />

      <motion.div
        id={`pricing-${config.name.toLowerCase()}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={`relative flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-300 ${
          config.popular
            ? `${config.borderColor} ${config.glowColor}`
            : `border-border hover:${config.borderColor}`
        }`}
      >
        {/* Popular badge */}
        {config.popular && (
          <div className="absolute top-0 left-0 right-0 flex justify-center">
            <div className="bg-amber-500 text-black text-xs font-bold px-4 py-1 rounded-b-lg tracking-widest uppercase">
              <Sparkles className="w-3 h-3 inline mr-1" />
              {t.pricing.mostPopular}
            </div>
          </div>
        )}

        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} pointer-events-none`}
        />

        {/* Shimmer line */}
        {config.popular && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        )}

        <div
          className={`relative z-10 p-8 flex flex-col h-full ${config.popular ? "pt-10" : ""}`}
        >
          {/* Tier header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div
                className={`flex items-center gap-2 mb-1 ${config.accentColor}`}
              >
                {config.icon}
                <span className="font-display font-black text-2xl">
                  {config.name}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{config.tagline}</p>
            </div>

            {/* Active badge */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Badge
                    className={`${config.badgeClass} border font-semibold text-xs`}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    {t.pricing.active}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-muted-foreground">$</span>
              <span
                className={`font-display font-black text-5xl ${config.accentColor}`}
              >
                {config.price}
              </span>
              <span className="text-sm text-muted-foreground">
                {t.pricing.perMonth}
              </span>
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8 flex-1">
            {config.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${config.badgeClass} border`}
                >
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm text-foreground/80 leading-snug">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* Active info */}
          <AnimatePresence>
            {isActive && myMembership && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div
                  className={`rounded-lg border ${config.borderColor} px-3 py-2 text-xs text-muted-foreground`}
                >
                  <Gem className="w-3 h-3 inline mr-1" />
                  {t.pricing.activeSince}{" "}
                  {formatPurchaseDate(
                    myMembership.purchasedAt,
                    localeMap[language] ?? "en-US",
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA Button */}
          {isActive ? (
            <Button
              disabled
              className="w-full border opacity-60 cursor-not-allowed"
              variant="outline"
            >
              <Zap className="w-4 h-4 mr-2" />
              {t.pricing.activeLabel}
            </Button>
          ) : (
            <Button
              onClick={handleBuyClick}
              disabled={isPending || membershipLoading}
              className={`w-full transition-all duration-300 ${config.buttonClass}`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.pricing.processing}
                </>
              ) : (
                <>
                  {!identity && <LogIn className="w-4 h-4 mr-2" />}
                  {buttonLabel}
                </>
              )}
            </Button>
          )}

          {/* Payment methods accepted strip */}
          <PaymentMethodsStrip label={t.pricing.acceptedPayments} />

          {/* Explore Benefits Button */}
          {onExploreTier && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onExploreTier(config.tier)}
              className={`w-full mt-2 text-xs border ${config.borderColor} ${config.accentColor} hover:bg-white/5 transition-all`}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Explore Benefits
            </Button>
          )}
        </div>
      </motion.div>
    </>
  );
}

interface PricingSectionProps {
  onExploreTier?: (tier: MembershipTier) => void;
}

export function PricingSection({ onExploreTier }: PricingSectionProps) {
  const { t } = useLanguage();

  const TIERS: TierConfig[] = [
    {
      tier: MembershipTier.silver,
      name: "Silver",
      price: 9.99,
      icon: <Shield className="w-6 h-6" />,
      tagline: t.pricing.silver.tagline,
      features: t.pricing.silverFeatures,
      accentColor: "text-slate-300",
      glowColor: "shadow-[0_0_20px_oklch(0.72_0.03_240/0.4)]",
      borderColor: "border-slate-500/40",
      bgGradient: "from-slate-500/15 via-slate-400/5 to-transparent",
      badgeClass: "bg-slate-500/20 text-slate-300 border-slate-500/40",
      buttonClass:
        "bg-slate-600/80 hover:bg-slate-500 text-white border-slate-500/50 hover:shadow-[0_0_15px_oklch(0.55_0.03_240/0.5)]",
      popular: false,
    },
    {
      tier: MembershipTier.gold,
      name: "Gold",
      price: 29.99,
      icon: <Star className="w-6 h-6" />,
      tagline: t.pricing.gold.tagline,
      features: t.pricing.goldFeatures,
      accentColor: "text-amber-400",
      glowColor: "shadow-[0_0_30px_oklch(0.78_0.18_85/0.5)]",
      borderColor: "border-amber-500/50",
      bgGradient: "from-amber-500/20 via-amber-400/8 to-transparent",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      buttonClass:
        "bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-[0_0_20px_oklch(0.78_0.18_85/0.4)] hover:shadow-[0_0_30px_oklch(0.78_0.18_85/0.6)]",
      popular: true,
    },
    {
      tier: MembershipTier.platinum,
      name: "Platinum",
      price: 79.99,
      icon: <Crown className="w-6 h-6" />,
      tagline: t.pricing.platinum.tagline,
      features: t.pricing.platinumFeatures,
      accentColor: "text-violet-400",
      glowColor: "shadow-[0_0_30px_oklch(0.6_0.22_290/0.5)]",
      borderColor: "border-violet-500/50",
      bgGradient: "from-violet-500/20 via-violet-400/8 to-transparent",
      badgeClass: "bg-violet-500/20 text-violet-300 border-violet-500/40",
      buttonClass:
        "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_oklch(0.6_0.22_290/0.4)] hover:shadow-[0_0_30px_oklch(0.6_0.22_290/0.6)]",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      <DotsBackground />
      {/* Background */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-mono font-semibold text-amber-400 uppercase tracking-widest mb-4">
            {t.pricing.sectionLabel}
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl mb-4">
            {t.pricing.sectionTitle1}
            <span
              className="text-amber-400"
              style={{
                textShadow:
                  "0 0 20px oklch(0.78 0.18 85 / 0.7), 0 0 40px oklch(0.78 0.18 85 / 0.3)",
              }}
            >
              {t.pricing.sectionTitle2}
            </span>
            {t.pricing.sectionTitle3}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.pricing.sectionDesc}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {TIERS.map((config, index) => (
            <motion.div
              key={config.tier}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={config.popular ? "md:-mt-4 md:mb-4" : ""}
            >
              <PricingCard config={config} onExploreTier={onExploreTier} />
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-10"
        >
          {t.pricing.bottomNote}
          <span className="text-foreground/60">
            {t.pricing.bottomNoteHighlight}
          </span>
        </motion.p>
      </div>
    </section>
  );
}
