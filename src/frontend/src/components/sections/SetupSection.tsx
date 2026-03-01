import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Check, Copy, Download, Monitor, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useDownloadsByOS, useIncrementDownload } from "../../hooks/useQueries";
import { useLanguage } from "../../i18n/LanguageContext";

interface StepProps {
  number: number;
  title: string;
  commands?: string[];
  note?: string;
  copiedLabel: string;
}

function InstallStep({
  number,
  title,
  commands,
  note,
  copiedLabel,
}: StepProps) {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (cmd: string) => {
    void navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
    toast.success(copiedLabel);
  };

  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-cyan text-background font-bold text-sm flex items-center justify-center shadow-glow-sm">
          {number}
        </div>
        <div className="flex-1 w-px bg-gradient-to-b from-cyan/40 to-transparent mt-2" />
      </div>
      <div className="pb-8 flex-1 min-w-0">
        <p className="font-semibold text-foreground mb-2">{title}</p>
        {commands?.map((cmd) => (
          <div
            key={cmd}
            className="flex items-center gap-2 mb-2 rounded-lg bg-background/80 border border-border px-4 py-3 font-mono text-sm group"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan flex-shrink-0" />
            <code className="flex-1 text-cyan/90 overflow-x-auto whitespace-nowrap">
              {cmd}
            </code>
            <button
              type="button"
              onClick={() => handleCopy(cmd)}
              className="ml-2 p-1 rounded text-muted-foreground hover:text-cyan transition-colors flex-shrink-0"
              aria-label="Copy command"
            >
              {copiedCmd === cmd ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
        {note && <p className="text-sm text-muted-foreground mt-1">{note}</p>}
      </div>
    </div>
  );
}

const STEP_COMMANDS = {
  windows: [
    { commands: ["winget install OpenClaw.OpenClaw"] },
    { commands: [] },
    { commands: ['setx PATH "%PATH%;C:\\Program Files\\OpenClaw\\bin"'] },
    { commands: ["openclaw --version", "openclaw init"] },
  ],
  macos: [
    { commands: ["brew tap openclaw/openclaw", "brew install openclaw"] },
    { commands: [] },
    { commands: ["openclaw setup", "openclaw --version"] },
    { commands: [] },
  ],
  linux: [
    {
      commands: [
        "curl -fsSL https://openclaw.io/install.sh | sudo bash",
        "sudo apt install openclaw",
      ],
    },
    { commands: ["sudo snap install openclaw --classic"] },
    { commands: ["sudo chmod +x /usr/local/bin/openclaw"] },
    { commands: ["openclaw --version", "openclaw init", "openclaw start"] },
  ],
};

const OS_ICONS = {
  windows: Monitor,
  macos: Apple,
  linux: Terminal,
};

const OS_LABELS = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};

export function SetupSection() {
  const { data: downloadStats } = useDownloadsByOS();
  const incrementDownload = useIncrementDownload();
  const { t } = useLanguage();

  const handleDownload = (os: string) => {
    incrementDownload.mutate(os);
    toast.success(
      `Initiating ${OS_LABELS[os as keyof typeof OS_LABELS]} download...`,
    );
  };

  const getDownloadCount = (os: string) => {
    if (!downloadStats) return "—";
    const key = `${os}Downloads` as keyof typeof downloadStats;
    const val = downloadStats[key];
    const num = Number(val);
    return num > 1000 ? `${(num / 1000).toFixed(1)}K` : String(num);
  };

  return (
    <section id="setup" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-mono font-semibold text-cyan uppercase tracking-widest mb-4">
            {t.setup.sectionLabel}
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mb-4">
            {t.setup.sectionTitle1}
            <span className="text-cyan text-glow-cyan">
              {t.setup.sectionTitle2}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t.setup.sectionDesc}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="windows">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8 bg-card border border-border">
              {(["windows", "macos", "linux"] as const).map((os) => {
                const Icon = OS_ICONS[os];
                return (
                  <TabsTrigger
                    key={os}
                    value={os}
                    className="flex items-center gap-2 data-[state=active]:bg-cyan data-[state=active]:text-background data-[state=active]:shadow-glow-sm"
                  >
                    <Icon className="w-4 h-4" />
                    {OS_LABELS[os]}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {(["windows", "macos", "linux"] as const).map((os) => {
              const Icon = OS_ICONS[os];
              const stepsData = t.setup[os].steps;
              const cmdsData = STEP_COMMANDS[os];
              return (
                <TabsContent key={os} value={os}>
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    {/* OS Header */}
                    <div className="flex items-center justify-between p-5 border-b border-border bg-accent/30">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-cyan" />
                        <div>
                          <h3 className="font-bold text-foreground">
                            {OS_LABELS[os]} Installation
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-mono text-cyan">
                              {getDownloadCount(os)}
                            </span>{" "}
                            {t.setup.downloads}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(os)}
                        disabled={incrementDownload.isPending}
                        className="bg-cyan text-background hover:bg-cyan-bright shadow-glow-sm font-semibold"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {t.setup.download}
                        <Badge
                          variant="secondary"
                          className="ml-2 bg-background/30 text-background text-xs"
                        >
                          {t.setup.free}
                        </Badge>
                      </Button>
                    </div>

                    {/* Steps */}
                    <div className="p-6">
                      {stepsData.map((step, idx) => (
                        <InstallStep
                          key={step.title}
                          number={idx + 1}
                          title={step.title}
                          commands={
                            cmdsData[idx]?.commands?.length
                              ? cmdsData[idx].commands
                              : undefined
                          }
                          note={step.note}
                          copiedLabel={t.setup.copiedToClipboard}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
