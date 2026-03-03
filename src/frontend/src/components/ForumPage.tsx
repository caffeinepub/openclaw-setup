import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { Identity } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import {
  ArrowLeft,
  Bell,
  BellRing,
  Check,
  ChevronRight,
  Clock,
  MessageCircle,
  MessageSquare,
  Plus,
  Send,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { ForumThread, ForumTopic } from "../backend.d";
import {
  useCreateForumPost,
  useCreateForumThread,
  useForumNotifications,
  useForumPostsByThread,
  useForumThreadsByTopic,
  useForumTopics,
  useMarkForumNotificationRead,
} from "../hooks/useForumQueries";

interface ForumPageProps {
  onClose: () => void;
  identity: Identity | null;
}

type View = "topics" | "threads" | "thread-detail";

function getCategoryStyle(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("ai"))
    return {
      badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      glow: "rgba(6,182,212,0.15)",
      accent: "#06b6d4",
    };
  if (normalized.includes("clawpro") || normalized.includes("tips"))
    return {
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      glow: "rgba(245,158,11,0.15)",
      accent: "#f59e0b",
    };
  if (normalized.includes("tech") || normalized.includes("news"))
    return {
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      glow: "rgba(52,211,153,0.15)",
      accent: "#34d399",
    };
  return {
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    glow: "rgba(167,139,250,0.15)",
    accent: "#a78bfa",
  };
}

function formatRelativeTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  if (ms < 1000) return "Just now";
  const diff = Date.now() - ms;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Static fallback topics ──

const STATIC_TOPICS: ForumTopic[] = [
  {
    id: BigInt(1),
    title: "AI Discussion",
    description:
      "Talk about the latest in AI, LLMs, and automation intelligence",
    category: "AI",
    createdAt: BigInt(1710000000000000000),
  },
  {
    id: BigInt(2),
    title: "ClawPro Tips & Tricks",
    description: "Share your best ClawPro workflows, configs, and hacks",
    category: "ClawPro Tips",
    createdAt: BigInt(1710100000000000000),
  },
  {
    id: BigInt(3),
    title: "Tech News",
    description:
      "Stay up to date with the latest in automation and developer tools",
    category: "Tech News",
    createdAt: BigInt(1710200000000000000),
  },
  {
    id: BigInt(4),
    title: "General Chat",
    description: "Off-topic discussions, introductions, and community hangout",
    category: "General",
    createdAt: BigInt(1710300000000000000),
  },
];

const DUMMY_PRINCIPAL = {} as Principal;

const STATIC_THREADS: Record<string, ForumThread[]> = {
  "1": [
    {
      id: BigInt(1),
      title: "GPT-4o vs Claude 3.5: Which is better for automation?",
      topicId: BigInt(1),
      authorHandle: "techguru42",
      authorPrincipal: DUMMY_PRINCIPAL,
      replyCount: BigInt(12),
      createdAt: BigInt(1711000000000000000),
      lastActivityAt: BigInt(1711500000000000000),
    },
    {
      id: BigInt(2),
      title: "How to build multi-agent pipelines with ClawPro",
      topicId: BigInt(1),
      authorHandle: "ai_builder",
      authorPrincipal: DUMMY_PRINCIPAL,
      replyCount: BigInt(7),
      createdAt: BigInt(1711200000000000000),
      lastActivityAt: BigInt(1711400000000000000),
    },
  ],
  "2": [
    {
      id: BigInt(3),
      title: "Best practices for WhatsApp bot configuration",
      topicId: BigInt(2),
      authorHandle: "whatsapp_pro",
      authorPrincipal: DUMMY_PRINCIPAL,
      replyCount: BigInt(5),
      createdAt: BigInt(1711100000000000000),
      lastActivityAt: BigInt(1711300000000000000),
    },
    {
      id: BigInt(4),
      title: "How I automated my e-commerce with ClawPro + Telegram",
      topicId: BigInt(2),
      authorHandle: "ecom_hero",
      authorPrincipal: DUMMY_PRINCIPAL,
      replyCount: BigInt(8),
      createdAt: BigInt(1711150000000000000),
      lastActivityAt: BigInt(1711350000000000000),
    },
  ],
  "3": [
    {
      id: BigInt(5),
      title: "ICP blockchain storage for configs — is it secure?",
      topicId: BigInt(3),
      authorHandle: "crypto_dev",
      authorPrincipal: DUMMY_PRINCIPAL,
      replyCount: BigInt(3),
      createdAt: BigInt(1711050000000000000),
      lastActivityAt: BigInt(1711250000000000000),
    },
  ],
  "4": [
    {
      id: BigInt(6),
      title: "Introduce yourself! New member thread",
      topicId: BigInt(4),
      authorHandle: "clawpro_team",
      authorPrincipal: DUMMY_PRINCIPAL,
      replyCount: BigInt(24),
      createdAt: BigInt(1710500000000000000),
      lastActivityAt: BigInt(1711600000000000000),
    },
  ],
};

// ── Topic List ──

function TopicList({
  onSelectTopic,
}: {
  onSelectTopic: (topic: ForumTopic) => void;
}) {
  const { data: backendTopics, isLoading } = useForumTopics();
  const topics =
    backendTopics && backendTopics.length > 0 ? backendTopics : STATIC_TOPICS;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {topics.map((topic, i) => {
        const style = getCategoryStyle(topic.category);
        return (
          <motion.button
            type="button"
            key={topic.id.toString()}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onSelectTopic(topic)}
            className="w-full text-left rounded-xl border border-white/8 bg-[oklch(0.09_0.012_240)] p-4 hover:border-white/14 transition-all group"
            style={{
              boxShadow: "0 0 0 rgba(0,0,0,0)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                `0 4px 20px ${style.glow}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 0 rgba(0,0,0,0)";
            }}
            data-ocid={`forum.topic.button.${i + 1}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge
                    className={`border text-xs px-2 py-0.5 ${style.badge}`}
                    variant="outline"
                  >
                    {topic.category}
                  </Badge>
                </div>
                <h3 className="font-bold text-white text-base leading-snug group-hover:text-cyan-300 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  {topic.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-1 transition-colors" />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Thread List ──

function ThreadList({
  topic,
  onBack,
  onSelectThread,
  identity,
}: {
  topic: ForumTopic;
  onBack: () => void;
  onSelectThread: (thread: ForumThread) => void;
  identity: Identity | null;
}) {
  const { data: backendThreads, isLoading } = useForumThreadsByTopic(topic.id);
  const createThread = useCreateForumThread();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const staticThreadsForTopic = STATIC_THREADS[topic.id.toString()] ?? [];
  const threads =
    backendThreads && backendThreads.length > 0
      ? backendThreads
      : staticThreadsForTopic;

  const style = getCategoryStyle(topic.category);

  const handleCreateThread = async () => {
    if (!newTitle.trim() || !newBody.trim()) {
      toast.error("Please fill in title and body.");
      return;
    }
    try {
      await createThread.mutateAsync({
        topicId: topic.id,
        title: newTitle.trim(),
        body: newBody.trim(),
      });
      toast.success("Thread created!");
      setShowCreateDialog(false);
      setNewTitle("");
      setNewBody("");
    } catch {
      toast.error("Failed to create thread. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-slate-400 hover:text-white h-8 px-2"
          data-ocid="forum.thread.button"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-white text-base truncate">
            {topic.title}
          </h2>
        </div>
        {identity && (
          <Button
            size="sm"
            onClick={() => setShowCreateDialog(true)}
            className="gap-1.5 h-8 text-xs font-semibold"
            style={{
              background: `linear-gradient(135deg, ${style.accent}33, ${style.accent}22)`,
              borderColor: `${style.accent}50`,
              color: style.accent,
            }}
            data-ocid="forum.thread.button"
          >
            <Plus className="w-3.5 h-3.5" />
            New Thread
          </Button>
        )}
      </div>

      {/* Create Thread Dialog */}
      <AnimatePresence>
        {showCreateDialog && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl border border-white/12 bg-[oklch(0.10_0.012_240)] p-4 space-y-3"
            data-ocid="forum.thread.modal"
          >
            <h3 className="font-semibold text-white text-sm">
              Create New Thread
            </h3>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-400">Title</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Thread title..."
                className="bg-[oklch(0.08_0.01_240)] border-white/10 text-white text-sm h-9"
                data-ocid="forum.thread.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-400">Body</Label>
              <Textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Share your thoughts..."
                className="bg-[oklch(0.08_0.01_240)] border-white/10 text-white text-sm min-h-[80px] resize-none"
                data-ocid="forum.thread.textarea"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCreateDialog(false)}
                className="text-slate-400 hover:text-white h-8"
                data-ocid="forum.thread.cancel_button"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateThread}
                disabled={createThread.isPending}
                className="h-8 font-semibold gap-1.5 flex-1"
                style={{ background: style.accent, color: "#000" }}
                data-ocid="forum.thread.submit_button"
              >
                {createThread.isPending ? "Creating..." : "Create Thread"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thread List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : threads.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          data-ocid="forum.thread.empty_state"
        >
          <MessageSquare className="w-10 h-10 text-slate-700 mb-3" />
          <p className="text-sm text-slate-500">No threads yet.</p>
          {identity && (
            <Button
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="mt-3"
              data-ocid="forum.thread.button"
            >
              Start the conversation
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {threads.map((thread, i) => (
            <motion.button
              type="button"
              key={thread.id.toString()}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onSelectThread(thread)}
              className="w-full text-left rounded-xl border border-white/8 bg-[oklch(0.09_0.012_240)] p-3.5 hover:border-white/14 transition-all group"
              data-ocid={`forum.thread.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors leading-snug truncate">
                    {thread.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <User className="w-3 h-3" />@{thread.authorHandle}
                    </span>
                    <span className="text-[11px] text-slate-600 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {thread.replyCount.toString()} replies
                    </span>
                    <span className="text-[11px] text-slate-600 flex items-center gap-1 ml-auto">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(thread.lastActivityAt)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-1" />
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Thread Detail ──

function ThreadDetail({
  thread,
  onBack,
  identity,
}: {
  thread: ForumThread;
  onBack: () => void;
  identity: Identity | null;
}) {
  const { data: posts, isLoading } = useForumPostsByThread(thread.id);
  const createPost = useCreateForumPost();
  const [replyBody, setReplyBody] = useState("");

  const handleReply = async () => {
    if (!replyBody.trim()) {
      toast.error("Please write something first.");
      return;
    }
    try {
      await createPost.mutateAsync({
        threadId: thread.id,
        body: replyBody.trim(),
      });
      toast.success("Reply posted!");
      setReplyBody("");
    } catch {
      toast.error("Failed to post reply. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Back + Thread Title */}
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-slate-400 hover:text-white h-8 px-2 mt-0.5 flex-shrink-0"
          data-ocid="forum.post.button"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h2 className="font-bold text-white text-base leading-snug">
          {thread.title}
        </h2>
      </div>

      {/* Posts */}
      <ScrollArea className="flex-1 min-h-0" style={{ maxHeight: "400px" }}>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center"
            data-ocid="forum.post.empty_state"
          >
            <MessageSquare className="w-8 h-8 text-slate-700 mb-2" />
            <p className="text-sm text-slate-500">
              No replies yet. Be the first!
            </p>
          </div>
        ) : (
          <div className="space-y-3 pr-2">
            {posts.map((post, i) => (
              <motion.div
                key={post.id.toString()}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-white/8 bg-[oklch(0.09_0.012_240)] p-4"
                data-ocid={`forum.post.item.${i + 1}`}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {post.authorHandle.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-cyan-300">
                    @{post.authorHandle}
                  </span>
                  <span className="text-xs text-slate-600 ml-auto">
                    {formatRelativeTime(post.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {post.body}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Reply Box */}
      {identity ? (
        <div className="rounded-xl border border-white/10 bg-[oklch(0.10_0.012_240)] p-3 space-y-2.5">
          <Textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Write a reply..."
            className="bg-[oklch(0.08_0.01_240)] border-white/10 text-white text-sm min-h-[72px] resize-none"
            data-ocid="forum.post.textarea"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                void handleReply();
              }
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600">
              Ctrl+Enter to submit
            </span>
            <Button
              size="sm"
              onClick={handleReply}
              disabled={createPost.isPending || !replyBody.trim()}
              className="h-8 gap-1.5 font-semibold"
              style={{ background: "oklch(0.62 0.15 210)", color: "#fff" }}
              data-ocid="forum.post.submit_button"
            >
              {createPost.isPending ? (
                "Posting..."
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Post Reply
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/8 bg-[oklch(0.09_0.01_240)] p-3 text-center">
          <p className="text-xs text-slate-500">Login to post a reply</p>
        </div>
      )}
    </div>
  );
}

// ── Notifications Panel ──

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { data: notifications, isLoading } = useForumNotifications();
  const markRead = useMarkForumNotificationRead();

  const unread = notifications?.filter((n) => !n.read) ?? [];

  const handleMarkAllRead = async () => {
    if (!unread.length) return;
    await Promise.all(unread.map((n) => markRead.mutateAsync(n.id)));
    toast.success("All notifications marked as read.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-0 top-12 w-80 rounded-xl border border-white/12 bg-[oklch(0.09_0.012_240)] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-50"
      data-ocid="forum.notifications.popover"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          Notifications
          {unread.length > 0 && (
            <span className="text-[10px] bg-red-500 text-white rounded-full px-1.5 py-0.5 font-bold">
              {unread.length}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {unread.length > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ScrollArea style={{ maxHeight: "320px" }}>
        {isLoading ? (
          <div className="p-3 space-y-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <div
            className="flex flex-col items-center py-8 text-center"
            data-ocid="forum.notifications.empty_state"
          >
            <Bell className="w-7 h-7 text-slate-700 mb-2" />
            <p className="text-xs text-slate-500">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {notifications.map((notif, i) => (
              <motion.div
                key={notif.id.toString()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`px-4 py-3 flex items-start gap-3 ${!notif.read ? "bg-cyan-500/4" : ""}`}
                data-ocid={`forum.notifications.item.${i + 1}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white ${notif.read ? "bg-slate-700" : "bg-cyan-500/25 border border-cyan-500/30"}`}
                >
                  {notif.fromHandle.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 leading-snug">
                    <span className="font-semibold text-white">
                      @{notif.fromHandle}
                    </span>{" "}
                    replied to{" "}
                    <span className="text-cyan-400 font-medium truncate">
                      {notif.threadTitle}
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    {formatRelativeTime(notif.createdAt)}
                  </p>
                </div>
                {!notif.read && (
                  <button
                    type="button"
                    onClick={() => markRead.mutate(notif.id)}
                    className="flex-shrink-0 text-slate-600 hover:text-emerald-400 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}

// ── Main ForumPage ──

export function ForumPage({ onClose, identity }: ForumPageProps) {
  const [view, setView] = useState<View>("topics");
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(
    null,
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const { data: notifications } = useForumNotifications();
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  const goToThreads = (topic: ForumTopic) => {
    setSelectedTopic(topic);
    setView("threads");
  };

  const goToDetail = (thread: ForumThread) => {
    setSelectedThread(thread);
    setView("thread-detail");
  };

  const goBack = () => {
    if (view === "thread-detail") {
      setView("threads");
      setSelectedThread(null);
    } else {
      setView("topics");
      setSelectedTopic(null);
    }
  };

  const viewTitle = {
    topics: "Community Forum",
    threads: selectedTopic?.title ?? "Threads",
    "thread-detail": selectedThread?.title ?? "Thread",
  }[view];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto"
        data-ocid="forum.page"
      >
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6 relative"
            >
              <div>
                <h1
                  className="text-2xl font-black text-white"
                  style={{ textShadow: "0 0 25px rgba(167,139,250,0.4)" }}
                >
                  {viewTitle}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {view === "topics"
                    ? "Connect with ClawPro members worldwide"
                    : view === "threads"
                      ? `${selectedTopic?.description}`
                      : `@${selectedThread?.authorHandle} started this thread`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Notifications bell */}
                {identity && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      data-ocid="forum.notifications.button"
                    >
                      {unreadCount > 0 ? (
                        <BellRing className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[8px] font-bold text-white flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {showNotifications && (
                        <NotificationsPanel
                          onClose={() => setShowNotifications(false)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  data-ocid="forum.close_button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Views */}
            <AnimatePresence mode="wait">
              {view === "topics" && (
                <motion.div
                  key="topics"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TopicList onSelectTopic={goToThreads} />
                </motion.div>
              )}

              {view === "threads" && selectedTopic && (
                <motion.div
                  key="threads"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ThreadList
                    topic={selectedTopic}
                    onBack={goBack}
                    onSelectThread={goToDetail}
                    identity={identity}
                  />
                </motion.div>
              )}

              {view === "thread-detail" && selectedThread && (
                <motion.div
                  key="thread-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ThreadDetail
                    thread={selectedThread}
                    onBack={goBack}
                    identity={identity}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
