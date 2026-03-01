import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ChevronDown, Copy } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { FAQ } from "../../backend.d";
import { useAllFAQs } from "../../hooks/useQueries";
import { useLanguage } from "../../i18n/LanguageContext";
import { DotsBackground } from "../DotsBackground";

const CONFIG_OPTIONS = [
  { name: "sensitivity", type: "number", default: "65" },
  { name: "performanceMode", type: "string", default: '"performance"' },
  { name: "autoDetect", type: "boolean", default: "true" },
  { name: "plugins", type: "string[]", default: '["audio", "visual"]' },
  { name: "theme", type: "string", default: '"dark"' },
  { name: "logLevel", type: "string", default: '"info"' },
  { name: "os", type: "string", default: '"auto"' },
  { name: "cloudSync", type: "boolean", default: "false" },
];

function CodeBlock({
  code,
  language = "bash",
  copiedLabel,
}: { code: string; language?: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(copiedLabel);
  };

  return (
    <div className="relative rounded-lg border border-border bg-background overflow-hidden my-3 group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-accent/30">
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 rounded text-muted-foreground hover:text-cyan transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono text-cyan/80 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function FAQList({ faqs, copiedLabel }: { faqs: FAQ[]; copiedLabel: string }) {
  void copiedLabel;
  const categories = [...new Set(faqs.map((f) => f.category))];

  const fallbackFAQs = [
    {
      id: BigInt(1),
      question: "What is OpenClaw?",
      answer:
        "OpenClaw is an advanced, open-source claw configuration and management tool that supports multiple hardware platforms and operating systems.",
      category: "General",
    },
    {
      id: BigInt(2),
      question: "Is OpenClaw free?",
      answer:
        "Yes, OpenClaw is completely free and open-source. Premium cloud sync features use ICP blockchain storage.",
      category: "General",
    },
    {
      id: BigInt(3),
      question: "How do I update OpenClaw?",
      answer:
        "Run `openclaw update` in your terminal, or use your package manager: `brew upgrade openclaw` on macOS, `apt upgrade openclaw` on Ubuntu.",
      category: "Installation",
    },
    {
      id: BigInt(4),
      question: "Can I use multiple configs?",
      answer:
        "Yes! OpenClaw supports unlimited saved configurations. Switch between them using `openclaw config use <name>` or via the web UI.",
      category: "Configuration",
    },
    {
      id: BigInt(5),
      question: "Which plugins are available?",
      answer:
        "OpenClaw has audio, visual, haptic, and network plugins built-in. Third-party plugins can be installed from the community registry.",
      category: "Plugins",
    },
    {
      id: BigInt(6),
      question: "How does Cloud Sync work?",
      answer:
        "Cloud Sync uses the Internet Computer Protocol (ICP) to store your configurations on the blockchain. Your configs are encrypted and only accessible with your identity.",
      category: "Configuration",
    },
  ];

  const data = faqs.length > 0 ? faqs : fallbackFAQs;
  const cats = [...new Set(data.map((f) => f.category))];
  void categories;

  return (
    <div className="space-y-6">
      {cats.map((category) => (
        <div key={category}>
          <div className="flex items-center gap-3 mb-3">
            <Badge
              variant="outline"
              className="border-cyan/40 text-cyan font-mono text-xs"
            >
              {category}
            </Badge>
            <div className="flex-1 h-px bg-border" />
          </div>
          <Accordion type="multiple" className="space-y-2">
            {data
              .filter((f) => f.category === category)
              .map((faq) => (
                <AccordionItem
                  key={faq.id.toString()}
                  value={faq.id.toString()}
                  className="border border-border rounded-lg overflow-hidden bg-card px-0"
                >
                  <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline hover:text-cyan [&[data-state=open]]:text-cyan transition-colors">
                    <span className="text-left">{faq.question}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform duration-200 [data-state=open]:rotate-180" />
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}

export function DocsSection() {
  const { data: faqs, isLoading: faqLoading } = useAllFAQs();
  const { t } = useLanguage();

  return (
    <section id="docs" className="py-24 relative overflow-hidden">
      <DotsBackground />
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
            {t.docs.sectionLabel}
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mb-4">
            <span className="text-cyan text-glow-cyan">
              {t.docs.sectionTitle}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t.docs.sectionDesc}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="quickstart">
            <TabsList className="flex flex-wrap gap-1 h-auto p-1 mb-8 bg-card border border-border w-full">
              <TabsTrigger
                value="quickstart"
                className="flex-1 min-w-[100px] data-[state=active]:bg-cyan data-[state=active]:text-background data-[state=active]:shadow-glow-sm"
              >
                {t.docs.tabQuickStart}
              </TabsTrigger>
              <TabsTrigger
                value="reference"
                className="flex-1 min-w-[100px] data-[state=active]:bg-cyan data-[state=active]:text-background data-[state=active]:shadow-glow-sm"
              >
                {t.docs.tabConfigRef}
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="flex-1 min-w-[100px] data-[state=active]:bg-cyan data-[state=active]:text-background data-[state=active]:shadow-glow-sm"
              >
                {t.docs.tabAdvanced}
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="flex-1 min-w-[100px] data-[state=active]:bg-cyan data-[state=active]:text-background data-[state=active]:shadow-glow-sm"
              >
                {t.docs.tabFAQ}
              </TabsTrigger>
            </TabsList>

            {/* Quick Start */}
            <TabsContent value="quickstart" className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                {[
                  {
                    num: "01",
                    title: t.docs.quickStartSteps[0].title,
                    desc: t.docs.quickStartSteps[0].desc,
                    code: "# macOS\nbrew install openclaw\n\n# Windows\nwinget install OpenClaw.OpenClaw\n\n# Linux\ncurl -fsSL https://openclaw.io/install.sh | sudo bash",
                    lang: "bash",
                  },
                  {
                    num: "02",
                    title: t.docs.quickStartSteps[1].title,
                    desc: t.docs.quickStartSteps[1].desc,
                    code: "openclaw init\n# Follow the prompts to detect hardware and set up your config",
                    lang: "bash",
                  },
                  {
                    num: "03",
                    title: t.docs.quickStartSteps[2].title,
                    desc: t.docs.quickStartSteps[2].desc,
                    code: "openclaw start\nopenclaw status\n# Output: OpenClaw v2.4.1 running · 1 device connected",
                    lang: "bash",
                  },
                  {
                    num: "04",
                    title: t.docs.quickStartSteps[3].title,
                    desc: t.docs.quickStartSteps[3].desc,
                    code: '{\n  "sensitivity": 75,\n  "performanceMode": "performance",\n  "autoDetect": true,\n  "plugins": ["audio", "visual"]\n}',
                    lang: "json",
                  },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <span className="text-cyan font-mono font-bold text-2xl leading-none mt-1">
                      {step.num}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {step.desc}
                      </p>
                      <CodeBlock
                        code={step.code}
                        language={step.lang}
                        copiedLabel={t.docs.copied}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Config Reference */}
            <TabsContent value="reference">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="font-bold text-lg">
                    {t.docs.configOptions.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t.docs.configOptions.desc}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-cyan font-mono">
                          {t.docs.configOptions.colOption}
                        </TableHead>
                        <TableHead className="text-cyan font-mono">
                          {t.docs.configOptions.colType}
                        </TableHead>
                        <TableHead className="text-cyan font-mono">
                          {t.docs.configOptions.colDefault}
                        </TableHead>
                        <TableHead className="text-cyan font-mono">
                          {t.docs.configOptions.colDescription}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {CONFIG_OPTIONS.map((opt) => (
                        <TableRow
                          key={opt.name}
                          className="border-border hover:bg-accent/30"
                        >
                          <TableCell className="font-mono text-cyan text-sm font-semibold">
                            {opt.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="font-mono text-xs border-muted text-muted-foreground"
                            >
                              {opt.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-amber-400">
                            {opt.default}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {t.docs.descriptions[opt.name] ?? opt.name}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* Advanced */}
            <TabsContent value="advanced" className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    {t.docs.advancedSections[0].title}
                  </h3>
                  <CodeBlock
                    copiedLabel={t.docs.copied}
                    code={`openclaw [command] [flags]

Commands:
  init          Initialize a new configuration
  start         Start the OpenClaw daemon
  stop          Stop the daemon
  restart       Restart the daemon
  status        Show current status
  config        Manage configurations
  plugin        Manage plugins
  update        Update to latest version

Global Flags:
  --config, -c  Path to config file (default: ~/.openclaw/config.json)
  --verbose, -v Enable verbose logging
  --dry-run     Simulate without making changes
  --json        Output as JSON`}
                    language="bash"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    {t.docs.advancedSections[1].title}
                  </h3>
                  {t.docs.advancedSections[1].desc && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {t.docs.advancedSections[1].desc}
                    </p>
                  )}
                  <CodeBlock
                    copiedLabel={t.docs.copied}
                    code={`#!/bin/bash
# Example: Auto-configure on system startup

# Start daemon
openclaw start --daemon

# Apply production config
openclaw config use production-v2

# Verify hardware detected
openclaw status --json | jq '.devices | length'`}
                    language="bash"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    {t.docs.advancedSections[2].title}
                  </h3>
                  <CodeBlock
                    copiedLabel={t.docs.copied}
                    code={`// openclaw-plugin.json
{
  "name": "my-custom-plugin",
  "version": "1.0.0",
  "entry": "index.js",
  "hooks": ["onStart", "onConfig", "onDevice"]
}

// index.js
module.exports = {
  onStart: async (ctx) => {
    console.log('Plugin started!');
    ctx.registerHook('onDevice', handleDevice);
  }
};`}
                    language="javascript"
                  />
                </div>
              </div>
            </TabsContent>

            {/* FAQ */}
            <TabsContent value="faq">
              {faqLoading ? (
                <div className="space-y-3">
                  {["faq-s1", "faq-s2", "faq-s3", "faq-s4", "faq-s5"].map(
                    (k) => (
                      <Skeleton key={k} className="h-12 w-full rounded-lg" />
                    ),
                  )}
                </div>
              ) : (
                <FAQList faqs={faqs ?? []} copiedLabel={t.docs.copied} />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
