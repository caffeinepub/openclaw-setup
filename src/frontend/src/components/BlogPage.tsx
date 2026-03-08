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
    id: BigInt(3),
    title:
      "Google Gemini Ultra 2.0: The AI Revolution That's Reshaping Tech in 2026",
    body: `In early 2026, Google unveiled Gemini Ultra 2.0 — a multimodal AI model that has rapidly become the benchmark against which all other AI systems are measured. Its arrival didn't just shift the AI landscape; it fundamentally rewired how businesses, developers, and individuals think about intelligent automation.

**Unprecedented Multimodal Capabilities**

Gemini Ultra 2.0 processes text, images, audio, video, and code natively — not as separate pipelines bolted together, but as a unified cognitive architecture. The model can watch a product demo video, analyze the UI, generate a matching codebase, and write documentation, all in a single prompt. Early benchmarks show it outperforming GPT-4o on 18 of 22 standard evaluations, including mathematics, scientific reasoning, and multilingual understanding.

**The Real-World Impact on Technology**

Enterprises adopting Gemini Ultra 2.0 via Google Cloud's Vertex AI are reporting 40–60% reductions in software development cycles. Code review automation, intelligent bug detection, and natural language database querying have moved from experimental to production-grade. In healthcare, the model's ability to reason across medical literature, imaging data, and patient records has accelerated diagnostic assistance tools to regulatory-ready status in record time.

**What This Means for Developers and Platforms Like ClawPro**

The integration of Gemini Ultra 2.0 with platforms like ClawPro opens new frontiers. Imagine an automation engine that doesn't just follow rules but genuinely understands context — adapting workflows dynamically based on real-time signals. ClawPro's AI Assistant tab already supports GPT-4o; Gemini integration is on the 2026 roadmap, promising even deeper multimodal automation for members. The AI revolution isn't a future event — it's the operating environment we now live in.`,
    createdAt: BigInt(1740000000000000000),
    tags: ["Gemini", "Google", "AI", "2026", "Innovation"],
    authorName: "Tech Desk",
    category: "Technology",
    coverImageUrl: "",
  },
  {
    id: BigInt(4),
    title:
      "Bitcoin Hits New Milestones: What the 2026 Crypto Bull Market Means for Investors",
    body: `Bitcoin crossed the $100,000 mark for the first time in late 2024 and has continued its ascent throughout 2025 and into 2026, establishing a new paradigm for institutional and retail investors alike. The 2026 bull market isn't simply a repeat of previous cycles — it's driven by fundamentally different catalysts.

**Institutional Adoption at Scale**

The approval of spot Bitcoin ETFs in major markets has unlocked trillions of dollars in institutional capital. Pension funds, sovereign wealth funds, and Fortune 500 treasury departments now hold Bitcoin as a standard reserve asset. BlackRock's iShares Bitcoin Trust alone crossed $50 billion AUM in 2025, signaling that the "institution phase" of Bitcoin adoption is not coming — it has arrived.

**DeFi and the Broader Crypto Ecosystem**

The Bitcoin bull run is lifting all boats in the crypto ecosystem. Ethereum's Layer 2 networks have reached mainstream adoption, processing over 10 million daily transactions at near-zero fees. DeFi protocols on Solana, Avalanche, and the Internet Computer (ICP) are handling real-world financial services — lending, derivatives, insurance — without intermediaries. For ClawPro users, ICP integration means your membership and configurations are stored in a truly decentralized, censorship-resistant environment.

**What Investors Should Know**

The 2026 crypto market is characterized by greater regulatory clarity, deeper liquidity, and reduced volatility compared to prior cycles. However, the opportunities remain substantial. Analysts project Bitcoin reaching $150,000–$200,000 by end of 2026 under base-case scenarios. Dollar-cost averaging, portfolio diversification across Bitcoin, Ethereum, and emerging L1/L2 assets, and understanding the tax implications in your jurisdiction remain the cornerstones of sound crypto investment strategy in this new era.`,
    createdAt: BigInt(1741000000000000000),
    tags: ["Bitcoin", "BTC", "Crypto", "Investment", "DeFi"],
    authorName: "Crypto Analyst",
    category: "Crypto",
    coverImageUrl: "",
  },
  {
    id: BigInt(5),
    title:
      "The Global AI Race: How Nations Are Competing for Artificial Intelligence Supremacy",
    body: `Artificial Intelligence has become the defining geopolitical technology of the 21st century. The competition between the United States, China, the European Union, and emerging players like India and the UAE for AI leadership is reshaping economies, defense strategies, and international alliances with breathtaking speed.

**The United States: Innovation Leadership Under Pressure**

The US currently leads in frontier AI model development, with OpenAI, Anthropic, Google DeepMind, and Meta AI collectively publishing the most-cited research and deploying the most widely used AI systems globally. However, export controls on advanced semiconductors, designed to limit Chinese AI capabilities, have accelerated China's domestic chip development programs. TSMC's Arizona fabs and Intel's Ohio investment represent America's bet on onshoring critical AI infrastructure.

**China's Rapid Catch-Up and Unique Advantages**

China's AI ecosystem — anchored by Baidu, Alibaba, Tencent, and Huawei — is not far behind, and in some domains, including facial recognition, autonomous vehicles, and AI-powered manufacturing, it leads the world. The Chinese government's 2030 AI development plan, backed by $15 billion in direct funding, is creating a state-directed innovation engine unlike anything the West has deployed. DeepSeek's recent open-source models have shocked Western observers with their performance-to-cost efficiency.

**The EU, India, and the Rest of the World**

The European Union is carving a distinct path: rather than competing purely on raw capability, it's becoming the global standard-setter for AI governance through the EU AI Act. India, with its vast English-language data advantage and world-class engineering talent, is positioning itself as the AI services powerhouse of the next decade. Platforms like ClawPro, built on the Internet Computer Protocol and integrating with global AI APIs, sit at the nexus of this geopolitical realignment — enabling anyone, anywhere, to access frontier AI capabilities regardless of national borders.`,
    createdAt: BigInt(1742000000000000000),
    tags: ["AI", "Geopolitics", "Technology", "Future", "Nations"],
    authorName: "World Desk",
    category: "Global",
    coverImageUrl: "",
  },
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
    case "crypto":
      return {
        bg: "bg-orange-500/15 border-orange-500/35 text-orange-300",
        glow: "0 0 20px rgba(249,115,22,0.2)",
        headerGradient:
          "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.05))",
      };
    case "global":
      return {
        bg: "bg-emerald-500/15 border-emerald-500/35 text-emerald-300",
        glow: "0 0 20px rgba(52,211,153,0.2)",
        headerGradient:
          "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(16,185,129,0.05))",
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
