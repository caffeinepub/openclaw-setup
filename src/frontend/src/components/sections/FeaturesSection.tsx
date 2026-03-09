import {
  Cloud,
  Cpu,
  MessageCircle,
  Monitor,
  Puzzle,
  Sliders,
  Users,
  Webhook,
} from "lucide-react";
import type React from "react";
import { useLanguage } from "../../i18n/LanguageContext";

export function FeaturesSection() {
  const { t } = useLanguage();

  const FEATURES = [
    {
      icon: Cpu,
      title: t.features.autoDetect.title,
      description: t.features.autoDetect.desc,
      color: "from-cyan/20 to-cyan/5",
      iconColor: "text-cyan",
    },
    {
      icon: Monitor,
      title: t.features.multiPlatform.title,
      description: t.features.multiPlatform.desc,
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-400",
    },
    {
      icon: Sliders,
      title: t.features.realtimeConfig.title,
      description: t.features.realtimeConfig.desc,
      color: "from-purple-500/20 to-purple-500/5",
      iconColor: "text-purple-400",
    },
    {
      icon: Puzzle,
      title: t.features.pluginSystem.title,
      description: t.features.pluginSystem.desc,
      color: "from-amber-500/20 to-amber-500/5",
      iconColor: "text-amber-400",
    },
    {
      icon: Cloud,
      title: t.features.cloudSync.title,
      description: t.features.cloudSync.desc,
      color: "from-green-500/20 to-green-500/5",
      iconColor: "text-green-400",
    },
    {
      icon: Users,
      title: t.features.community.title,
      description: t.features.community.desc,
      color: "from-rose-500/20 to-rose-500/5",
      iconColor: "text-rose-400",
    },
    {
      icon: MessageCircle,
      title: t.features.whatsappChatbot.title,
      description: t.features.whatsappChatbot.desc,
      color: "from-green-500/20 to-emerald-500/5",
      iconColor: "text-green-400",
      badge: "WhatsApp",
      preview: "whatsapp",
    },
    {
      icon: Webhook,
      title: t.features.openclawApi.title,
      description: t.features.openclawApi.desc,
      color: "from-cyan/20 to-blue-500/5",
      iconColor: "text-cyan",
      badge: "REST API",
      preview: "api",
    },
  ] as Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    color: string;
    iconColor: string;
    badge?: string;
    preview?: string;
  }>;

  return (
    <section id="features" className="py-16 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-mono font-semibold text-cyan uppercase tracking-widest mb-4">
            {t.features.sectionLabel}
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl mb-4">
            {t.features.sectionTitle1}
            <span className="text-cyan">{t.features.sectionTitle2}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.features.sectionDesc}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-border bg-card p-6 hover:border-cyan/40 transition-colors duration-200 overflow-hidden cursor-default"
              >
                {/* Gradient fill on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon row with optional badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-background/50 border border-border flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    {feature.badge && (
                      <span
                        className={`text-xs font-mono font-semibold px-2 py-1 rounded-full border ${
                          feature.preview === "whatsapp"
                            ? "border-green-500/40 text-green-400 bg-green-500/10"
                            : "border-cyan/40 text-cyan bg-cyan/10"
                        }`}
                      >
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-xl mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Mini preview for WhatsApp Chatbot */}
                  {feature.preview === "whatsapp" && (
                    <div className="mt-4 rounded-lg bg-background/60 border border-green-500/20 p-3 space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <MessageCircle className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-xs font-semibold text-green-400">
                          ClawPro Bot
                        </span>
                        <span className="ml-auto text-[10px] text-green-500/60">
                          ● Online
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-green-600/20 border border-green-500/20 rounded-lg rounded-br-sm px-3 py-1.5 text-xs text-green-300 max-w-[80%]">
                          Halo! Bagaimana saya bisa membantu?
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-background/80 border border-border rounded-lg rounded-bl-sm px-3 py-1.5 text-xs text-muted-foreground max-w-[80%]">
                          Cek status device saya
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-green-600/20 border border-green-500/20 rounded-lg rounded-br-sm px-3 py-1.5 text-xs text-green-300 max-w-[80%]">
                          ✓ Device aktif — sensitivitas 85%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mini preview for OpenClaw API */}
                  {feature.preview === "api" && (
                    <div className="mt-4 rounded-lg bg-background/60 border border-cyan/20 p-3 font-mono text-[11px] space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-400 font-semibold">
                          GET
                        </span>
                        <span className="text-cyan/80">
                          /api/v1/devices/status
                        </span>
                      </div>
                      <div className="text-muted-foreground/70 leading-relaxed">
                        <span className="text-yellow-400">{"{"}</span>
                        <br />
                        <span className="pl-3 text-cyan/60">"device"</span>
                        <span className="text-muted-foreground">: </span>
                        <span className="text-green-400">"online"</span>
                        <span className="text-muted-foreground">,</span>
                        <br />
                        <span className="pl-3 text-cyan/60">"sensitivity"</span>
                        <span className="text-muted-foreground">: </span>
                        <span className="text-amber-400">85</span>
                        <span className="text-muted-foreground">,</span>
                        <br />
                        <span className="pl-3 text-cyan/60">"mode"</span>
                        <span className="text-muted-foreground">: </span>
                        <span className="text-green-400">"ultra"</span>
                        <br />
                        <span className="text-yellow-400">{"}"}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
