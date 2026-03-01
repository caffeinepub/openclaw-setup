import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Shield, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddChangelog,
  useAddFAQ,
  useAllChangelog,
  useAllFAQs,
  useDeleteChangelog,
  useDeleteFAQ,
} from "../../hooks/useQueries";

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  // FAQ form state
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    category: "General",
  });

  // Changelog form state
  const [changelogForm, setChangelogForm] = useState({
    version: "",
    releaseDate: "",
    title: "",
    description: "",
    changes: "",
    changeType: "patch",
  });

  const { data: faqs } = useAllFAQs();
  const { data: changelog } = useAllChangelog();
  const addFAQ = useAddFAQ();
  const deleteFAQ = useDeleteFAQ();
  const addChangelog = useAddChangelog();
  const deleteChangelog = useDeleteChangelog();

  const handleAddFAQ = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast.error("Please fill in question and answer");
      return;
    }
    try {
      await addFAQ.mutateAsync(faqForm);
      toast.success("FAQ added successfully");
      setFaqForm({ question: "", answer: "", category: "General" });
    } catch {
      toast.error("Failed to add FAQ");
    }
  };

  const handleDeleteFAQ = async (id: bigint) => {
    try {
      await deleteFAQ.mutateAsync(id);
      toast.success("FAQ deleted");
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  const handleAddChangelog = async () => {
    if (
      !changelogForm.version.trim() ||
      !changelogForm.title.trim() ||
      !changelogForm.releaseDate.trim()
    ) {
      toast.error("Please fill in version, title, and date");
      return;
    }
    const changesList = changelogForm.changes
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    try {
      await addChangelog.mutateAsync({
        version: changelogForm.version,
        releaseDate: changelogForm.releaseDate,
        title: changelogForm.title,
        description: changelogForm.description,
        changesList,
        changeType: changelogForm.changeType,
      });
      toast.success("Changelog entry added");
      setChangelogForm({
        version: "",
        releaseDate: "",
        title: "",
        description: "",
        changes: "",
        changeType: "patch",
      });
    } catch {
      toast.error("Failed to add changelog entry");
    }
  };

  const handleDeleteChangelog = async (id: bigint) => {
    try {
      await deleteChangelog.mutateAsync(id);
      toast.success("Changelog deleted");
    } catch {
      toast.error("Failed to delete changelog");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border bg-amber-500/5">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="font-bold text-lg">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">
                  Manage FAQs and Changelog
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            <Tabs defaultValue="faqs">
              <TabsList className="grid grid-cols-2 w-full mb-6 bg-background border border-border">
                <TabsTrigger
                  value="faqs"
                  className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
                >
                  FAQs ({faqs?.length ?? 0})
                </TabsTrigger>
                <TabsTrigger
                  value="changelog"
                  className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
                >
                  Changelog ({changelog?.length ?? 0})
                </TabsTrigger>
              </TabsList>

              {/* FAQs Tab */}
              <TabsContent value="faqs" className="space-y-5">
                {/* Add FAQ Form */}
                <div className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-400" />
                    Add New FAQ
                  </h3>
                  <div className="space-y-2">
                    <Label className="text-xs">Category</Label>
                    <Input
                      value={faqForm.category}
                      onChange={(e) =>
                        setFaqForm((p) => ({ ...p, category: e.target.value }))
                      }
                      placeholder="e.g. General, Installation, Configuration"
                      className="bg-card border-border text-sm h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Question</Label>
                    <Input
                      value={faqForm.question}
                      onChange={(e) =>
                        setFaqForm((p) => ({ ...p, question: e.target.value }))
                      }
                      placeholder="Enter question..."
                      className="bg-card border-border text-sm h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Answer</Label>
                    <Textarea
                      value={faqForm.answer}
                      onChange={(e) =>
                        setFaqForm((p) => ({ ...p, answer: e.target.value }))
                      }
                      placeholder="Enter answer..."
                      className="bg-card border-border text-sm min-h-20 resize-none"
                    />
                  </div>
                  <Button
                    onClick={handleAddFAQ}
                    disabled={addFAQ.isPending}
                    size="sm"
                    className="bg-amber-500 text-background hover:bg-amber-400 font-semibold"
                  >
                    {addFAQ.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 mr-2" />
                    )}
                    Add FAQ
                  </Button>
                </div>

                {/* FAQ List */}
                <div className="space-y-2">
                  {faqs && faqs.length > 0 ? (
                    faqs.map((faq) => (
                      <div
                        key={faq.id.toString()}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background/50 group"
                      >
                        <div className="flex-1 min-w-0">
                          <Badge
                            variant="outline"
                            className="text-xs mb-1 border-muted text-muted-foreground"
                          >
                            {faq.category}
                          </Badge>
                          <p className="text-sm font-medium truncate">
                            {faq.question}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {faq.answer}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFAQ(faq.id)}
                          disabled={deleteFAQ.isPending}
                          className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                          aria-label="Delete FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No FAQs yet. Add one above.
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Changelog Tab */}
              <TabsContent value="changelog" className="space-y-5">
                {/* Add Changelog Form */}
                <div className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-400" />
                    Add Changelog Entry
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Version</Label>
                      <Input
                        value={changelogForm.version}
                        onChange={(e) =>
                          setChangelogForm((p) => ({
                            ...p,
                            version: e.target.value,
                          }))
                        }
                        placeholder="e.g. 2.5.0"
                        className="bg-card border-border text-sm h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Release Date</Label>
                      <Input
                        type="date"
                        value={changelogForm.releaseDate}
                        onChange={(e) =>
                          setChangelogForm((p) => ({
                            ...p,
                            releaseDate: e.target.value,
                          }))
                        }
                        className="bg-card border-border text-sm h-8"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={changelogForm.title}
                        onChange={(e) =>
                          setChangelogForm((p) => ({
                            ...p,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Release title..."
                        className="bg-card border-border text-sm h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={changelogForm.changeType}
                        onValueChange={(val) =>
                          setChangelogForm((p) => ({
                            ...p,
                            changeType: val,
                          }))
                        }
                      >
                        <SelectTrigger className="bg-card border-border h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="major">Major</SelectItem>
                          <SelectItem value="minor">Minor</SelectItem>
                          <SelectItem value="patch">Patch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={changelogForm.description}
                      onChange={(e) =>
                        setChangelogForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Short description..."
                      className="bg-card border-border text-sm h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Changes (one per line)</Label>
                    <Textarea
                      value={changelogForm.changes}
                      onChange={(e) =>
                        setChangelogForm((p) => ({
                          ...p,
                          changes: e.target.value,
                        }))
                      }
                      placeholder="Added feature X&#10;Fixed bug Y&#10;Improved performance"
                      className="bg-card border-border text-sm min-h-20 resize-none"
                    />
                  </div>
                  <Button
                    onClick={handleAddChangelog}
                    disabled={addChangelog.isPending}
                    size="sm"
                    className="bg-amber-500 text-background hover:bg-amber-400 font-semibold"
                  >
                    {addChangelog.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 mr-2" />
                    )}
                    Add Entry
                  </Button>
                </div>

                {/* Changelog List */}
                <div className="space-y-2">
                  {changelog && changelog.length > 0 ? (
                    changelog.map((entry) => (
                      <div
                        key={entry.id.toString()}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background/50 group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-sm text-cyan">
                              v{entry.version}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs border-muted text-muted-foreground"
                            >
                              {entry.changeType}
                            </Badge>
                          </div>
                          <p className="text-sm truncate">{entry.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.releaseDate}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteChangelog(entry.id)}
                          disabled={deleteChangelog.isPending}
                          className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                          aria-label="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No changelog entries yet.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
