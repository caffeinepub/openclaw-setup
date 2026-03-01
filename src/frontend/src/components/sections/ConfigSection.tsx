import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Download, FileJson, Loader2, LogIn, Save, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useDeleteConfig,
  useMyConfigs,
  useSaveConfig,
} from "../../hooks/useQueries";

const PLUGINS = [
  { id: "audio", label: "Audio Plugin" },
  { id: "visual", label: "Visual Feedback" },
  { id: "haptic", label: "Haptic Response" },
  { id: "network", label: "Network Sync" },
];

interface ConfigState {
  name: string;
  os: string;
  performanceMode: string;
  sensitivity: number;
  autoDetect: boolean;
  plugins: string[];
  theme: string;
  logLevel: string;
}

const DEFAULT_CONFIG: ConfigState = {
  name: "My OpenClaw Config",
  os: "windows",
  performanceMode: "performance",
  sensitivity: 65,
  autoDetect: true,
  plugins: ["audio", "visual"],
  theme: "dark",
  logLevel: "info",
};

export function ConfigSection() {
  const [config, setConfig] = useState<ConfigState>(DEFAULT_CONFIG);
  const { identity, login } = useInternetIdentity();
  const saveConfigMut = useSaveConfig();
  const deleteConfigMut = useDeleteConfig();
  const { data: savedConfigs } = useMyConfigs();

  const jsonPreview = useMemo(
    () =>
      JSON.stringify(
        {
          name: config.name,
          os: config.os,
          version: "2.4.1",
          settings: {
            performanceMode: config.performanceMode,
            sensitivity: config.sensitivity,
            autoDetect: config.autoDetect,
            plugins: config.plugins,
            theme: config.theme,
            logLevel: config.logLevel,
          },
        },
        null,
        2,
      ),
    [config],
  );

  const handlePluginToggle = (pluginId: string) => {
    setConfig((prev) => ({
      ...prev,
      plugins: prev.plugins.includes(pluginId)
        ? prev.plugins.filter((p) => p !== pluginId)
        : [...prev.plugins, pluginId],
    }));
  };

  const handleSave = async () => {
    if (!identity) {
      toast.error("Please login to save your configuration");
      return;
    }
    if (!config.name.trim()) {
      toast.error("Please enter a config name");
      return;
    }
    try {
      await saveConfigMut.mutateAsync({
        name: config.name,
        os: config.os,
        configData: jsonPreview,
      });
      toast.success("Configuration saved to ICP blockchain!");
    } catch {
      toast.error("Failed to save configuration");
    }
  };

  const handleExport = () => {
    const blob = new Blob([jsonPreview], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Configuration exported!");
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteConfigMut.mutateAsync(id);
      toast.success("Configuration deleted");
    } catch {
      toast.error("Failed to delete configuration");
    }
  };

  return (
    <section id="config" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      <div className="absolute inset-0 hex-grid-bg opacity-15" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-mono font-semibold text-cyan uppercase tracking-widest mb-4">
            Configuration
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mb-4">
            Config <span className="text-cyan text-glow-cyan">Builder</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Build your perfect OpenClaw configuration visually, then save it to
            the blockchain or export as JSON.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 rounded-xl border border-border bg-card p-6 space-y-5"
          >
            {/* Config Name */}
            <div className="space-y-2">
              <Label htmlFor="config-name" className="text-sm font-semibold">
                Config Name
              </Label>
              <Input
                id="config-name"
                value={config.name}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="My OpenClaw Config"
                className="bg-background border-border focus:border-cyan/60 focus:ring-cyan/20"
              />
            </div>

            {/* OS */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Operating System</Label>
              <Select
                value={config.os}
                onValueChange={(val) =>
                  setConfig((prev) => ({ ...prev, os: val }))
                }
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="windows">Windows</SelectItem>
                  <SelectItem value="macos">macOS</SelectItem>
                  <SelectItem value="linux">Linux</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Performance Mode */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Performance Mode</Label>
              <Select
                value={config.performanceMode}
                onValueChange={(val) =>
                  setConfig((prev) => ({ ...prev, performanceMode: val }))
                }
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="ultra">Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sensitivity */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold">
                  Claw Sensitivity
                </Label>
                <span className="text-cyan font-mono text-sm font-bold">
                  {config.sensitivity}
                </span>
              </div>
              <Slider
                min={1}
                max={100}
                step={1}
                value={[config.sensitivity]}
                onValueChange={([val]) =>
                  setConfig((prev) => ({ ...prev, sensitivity: val }))
                }
                className="[&_[role=slider]]:bg-cyan [&_[role=slider]]:border-cyan [&_.bg-primary]:bg-cyan"
              />
            </div>

            {/* Auto-detect */}
            <div className="flex items-center justify-between py-1">
              <div>
                <Label className="text-sm font-semibold">
                  Auto-detect on startup
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automatically detect hardware when OpenClaw starts
                </p>
              </div>
              <Switch
                checked={config.autoDetect}
                onCheckedChange={(val) =>
                  setConfig((prev) => ({ ...prev, autoDetect: val }))
                }
                className="data-[state=checked]:bg-cyan"
              />
            </div>

            {/* Plugins */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Plugins</Label>
              <div className="grid grid-cols-2 gap-2">
                {PLUGINS.map((plugin) => (
                  <label
                    key={plugin.id}
                    htmlFor={`plugin-${plugin.id}`}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-border hover:border-cyan/40 cursor-pointer transition-colors bg-background/50"
                  >
                    <Checkbox
                      id={`plugin-${plugin.id}`}
                      checked={config.plugins.includes(plugin.id)}
                      onCheckedChange={() => handlePluginToggle(plugin.id)}
                      className="data-[state=checked]:bg-cyan data-[state=checked]:border-cyan"
                    />
                    <span className="text-sm">{plugin.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Theme + Log Level */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Theme</Label>
                <Select
                  value={config.theme}
                  onValueChange={(val) =>
                    setConfig((prev) => ({ ...prev, theme: val }))
                  }
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="neon">Neon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Log Level</Label>
                <Select
                  value={config.logLevel}
                  onValueChange={(val) =>
                    setConfig((prev) => ({ ...prev, logLevel: val }))
                  }
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Warn</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {identity ? (
                <Button
                  onClick={handleSave}
                  disabled={saveConfigMut.isPending}
                  className="flex-1 bg-cyan text-background hover:bg-cyan-bright font-semibold shadow-glow-sm"
                >
                  {saveConfigMut.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {saveConfigMut.isPending ? "Saving..." : "Save Config"}
                </Button>
              ) : (
                <Button
                  onClick={login}
                  variant="outline"
                  className="flex-1 border-cyan/40 text-cyan hover:bg-cyan/10"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login to Save
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleExport}
                className="border-border hover:border-cyan/40 hover:text-cyan"
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </motion.div>

          {/* JSON Preview + Saved Configs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* JSON Preview */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-accent/30">
                <FileJson className="w-4 h-4 text-cyan" />
                <span className="text-sm font-semibold">Live JSON Preview</span>
                <div className="ml-auto flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
              </div>
              <pre className="p-4 text-xs font-mono text-cyan/80 overflow-auto max-h-72 leading-relaxed">
                {jsonPreview}
              </pre>
            </div>

            {/* Saved Configs */}
            {identity && (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-accent/30">
                  <Save className="w-4 h-4 text-cyan" />
                  <span className="text-sm font-semibold">Saved Configs</span>
                  <span className="ml-auto text-xs text-muted-foreground font-mono">
                    {savedConfigs?.length ?? 0} saved
                  </span>
                </div>
                <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                  {savedConfigs && savedConfigs.length > 0 ? (
                    savedConfigs.map((cfg) => (
                      <div
                        key={cfg.id.toString()}
                        className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border group hover:border-cyan/30 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {cfg.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cfg.os}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(cfg.id)}
                          disabled={deleteConfigMut.isPending}
                          className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Delete config"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No saved configurations yet
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
