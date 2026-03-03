import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  Tag,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { BlogPost } from "../backend.d";
import { useBlogPosts } from "../hooks/useForumQueries";

interface BlogPageProps {
  onClose: () => void;
}

const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    id: BigInt(1),
    title: "The Rise of AI Agents: How OpenClaw Supercharges Your Automation",
    body: `Artificial Intelligence has evolved beyond simple chatbots. Today, AI agents can reason, plan, and execute complex multi-step workflows autonomously — and ClawPro is at the forefront of this revolution.

**What Are AI Agents?**

AI agents are software systems that perceive their environment, make decisions, and take actions to achieve specific goals. Unlike traditional automation scripts, agents can adapt to changing conditions, handle unexpected scenarios, and coordinate with other systems dynamically.

**OpenClaw's Role in the AI Ecosystem**

OpenClaw's automation engine serves as the connective tissue between AI models and real-world applications. By integrating with leading AI providers like OpenAI's GPT-4o, Anthropic's Claude, and custom LLMs, OpenClaw enables:

- **Intelligent Workflow Orchestration**: Chain AI decisions with real-world actions across 20+ platform integrations
- **Context-Aware Automation**: Agents that remember conversation history and adapt their behavior accordingly
- **Multi-Modal Processing**: Handle text, images, and structured data in unified pipelines
- **Error Recovery**: Automatic retry logic and fallback strategies when AI responses are unexpected

**The Future: Autonomous Business Operations**

Companies using ClawPro + AI are reporting up to 80% reduction in manual data entry tasks, 3x faster customer response times, and 24/7 operations without additional staffing. As AI models become more capable, the integration layer — that's where OpenClaw shines — becomes the critical competitive advantage.

**Getting Started**

With ClawPro's AI Assistant tab (available for Silver tier and above), you can connect your OpenAI API key and start building intelligent automations in minutes. The built-in prompt library includes templates for common business workflows, so you don't need AI expertise to get started.

The AI revolution isn't coming — it's already here. The question is: is your automation stack ready?`,
    createdAt: BigInt(1710000000000000000),
    tags: ["AI", "Automation", "OpenAI", "Agents", "GPT-4"],
    authorName: "ClawPro Team",
    category: "AI",
    coverImageUrl: "",
  },
  {
    id: BigInt(2),
    title:
      "OpenClaw Technology Deep-Dive: Building the Next-Generation Automation Platform",
    body: `ClawPro is more than just another automation tool — it's a full-stack platform built for the AI-first era. In this technical deep-dive, we'll explore the architecture decisions that make ClawPro uniquely powerful for developers and enterprises alike.

**Decentralized Configuration Storage**

One of ClawPro's most innovative features is its use of the Internet Computer Protocol (ICP) blockchain for configuration storage. This means your automation workflows are:

- **Tamper-Proof**: Configurations stored on-chain cannot be secretly modified
- **Always Available**: No single point of failure; your configs persist even if our servers go down
- **Verifiably Yours**: Cryptographic ownership means only you control your automation data

**The Plugin Architecture**

ClawPro's plugin system uses a modular architecture that allows:

\`\`\`javascript
// Example ClawPro plugin manifest
{
  "name": "whatsapp-bot",
  "version": "2.1.0",
  "hooks": ["onMessage", "onSchedule"],
  "permissions": ["send_message", "read_contacts"],
  "ai_context": true
}
\`\`\`

Each plugin runs in an isolated sandbox, preventing one misbehaving integration from affecting the rest of your stack. With 20+ first-party integrations spanning messaging, AI, social media, productivity tools, and developer utilities, ClawPro covers virtually every use case.

**Real-Time Event Processing**

The ClawPro engine processes events with sub-100ms latency using a distributed event queue. Whether you're handling 10 or 10,000 automation triggers per minute, the system scales horizontally without configuration changes.

**Multi-Platform WhatsApp Chatbot**

Our WhatsApp chatbot integration is one of the most-requested features. With ClawPro, you can deploy a fully customized WhatsApp business bot in under 5 minutes:

1. Connect your WhatsApp Business API number
2. Configure response templates using our visual editor
3. Add AI-powered dynamic responses via GPT or Claude
4. Deploy globally with automatic load balancing

**What's Next**

The ClawPro roadmap for 2025 includes native mobile apps (iOS & Android), a visual workflow builder, and expanded AI model support including local LLM inference for privacy-sensitive workflows. The platform continues to evolve based on community feedback — and with Platinum membership, you get direct access to our product team.

The technology is ready. Are you?`,
    createdAt: BigInt(1712000000000000000),
    tags: ["Technology", "OpenClaw", "ICP", "Architecture", "Innovation"],
    authorName: "ClawPro Engineering",
    category: "Technology",
    coverImageUrl: "",
  },
];

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  if (ms < 1000) return "Recently";
  return new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getCategoryStyle(category: string) {
  switch (category.toLowerCase()) {
    case "ai":
      return {
        bg: "bg-cyan-500/15 border-cyan-500/35 text-cyan-300",
        glow: "0 0 20px rgba(6,182,212,0.2)",
        headerGradient:
          "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(8,145,178,0.05))",
      };
    case "openclaw":
    case "technology":
      return {
        bg: "bg-amber-500/15 border-amber-500/35 text-amber-300",
        glow: "0 0 20px rgba(245,158,11,0.2)",
        headerGradient:
          "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.05))",
      };
    default:
      return {
        bg: "bg-violet-500/15 border-violet-500/35 text-violet-300",
        glow: "0 0 20px rgba(167,139,250,0.2)",
        headerGradient:
          "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(139,92,246,0.05))",
      };
  }
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const style = getCategoryStyle(post.category);

  const paragraphs = post.body.split("\n\n").filter(Boolean);
  const preview = paragraphs.slice(0, 2).join("\n\n");
  const hasMore = paragraphs.length > 2;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-2xl overflow-hidden border border-white/8 bg-[oklch(0.09_0.012_240)]"
      style={{ boxShadow: style.glow }}
      data-ocid={`blog.item.${index + 1}`}
    >
      {/* Cover / gradient header */}
      <div
        className="relative h-36 flex items-end p-5"
        style={{ background: style.headerGradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[oklch(0.09_0.012_240)]" />
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{
              background: style.headerGradient,
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            <BookOpen className="w-5 h-5 text-white/70" />
          </div>
          <Badge
            className={`border text-xs px-2.5 py-1 ${style.bg}`}
            variant="outline"
          >
            {post.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <h2 className="text-lg font-bold text-white leading-snug">
          {post.title}
        </h2>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {post.authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.createdAt)}
          </span>
        </div>

        {/* Body */}
        <div className="text-sm text-slate-300 leading-relaxed space-y-3">
          {(expanded ? post.body : preview)
            .split("\n\n")
            .filter(Boolean)
            .map((para, i) => {
              // Handle bold text
              const parts = para.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={`${post.id}-p-${i}`}>
                  {parts.map((part, j) =>
                    j % 2 === 1 ? (
                      // biome-ignore lint/suspicious/noArrayIndexKey: markdown parts have no stable id
                      <strong key={j} className="text-white font-semibold">
                        {part}
                      </strong>
                    ) : (
                      // biome-ignore lint/suspicious/noArrayIndexKey: markdown parts have no stable id
                      <span key={j}>{part}</span>
                    ),
                  )}
                </p>
              );
            })}
        </div>

        {/* Read More / Less */}
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/8 gap-1 px-2 h-8"
            data-ocid={`blog.item.${index + 1}`}
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Read More
              </>
            )}
          </Button>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Tag className="w-3 h-3 text-slate-600 mt-0.5 flex-shrink-0" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

function BlogSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

export function BlogPage({ onClose }: BlogPageProps) {
  const { data: blogPostsFromBackend, isLoading } = useBlogPosts();

  // Use backend posts if available, otherwise use static posts
  const posts =
    blogPostsFromBackend && blogPostsFromBackend.length > 0
      ? blogPostsFromBackend
      : STATIC_BLOG_POSTS;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto"
        data-ocid="blog.page"
      >
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h1
                  className="text-3xl font-black text-white"
                  style={{ textShadow: "0 0 30px rgba(6,182,212,0.4)" }}
                >
                  ClawPro Blog
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Insights on AI, automation, and technology
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                data-ocid="blog.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Articles Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BlogSkeleton />
                <BlogSkeleton />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post, i) => (
                  <BlogCard key={post.id.toString()} post={post} index={i} />
                ))}
              </div>
            )}

            {/* Footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-slate-600 mt-10"
            >
              More articles coming soon. Stay tuned to{" "}
              <span className="text-cyan-500/60">ClawPro Blog</span>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
