import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ExternalLink, Lightbulb, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../../i18n/LanguageContext";
import { DotsBackground } from "../DotsBackground";

interface Platform {
  id: string;
  name: string;
  desc: string;
  icon: string;
  bgColor: string;
  iconBg: string;
}

interface PlatformDetails {
  id: string;
  features: string[];
  useCases: string[];
  status: "available" | "coming_soon";
}

const PLATFORM_DETAILS: Record<string, PlatformDetails> = {
  facebook: {
    id: "facebook",
    features: [
      "Automate page posts and stories",
      "Manage comments and DMs automatically",
      "Schedule content in advance",
      "Track engagement analytics",
      "Audience targeting automation",
    ],
    useCases: [
      "Brand social media management",
      "Customer support automation",
      "Scheduled marketing campaigns",
    ],
    status: "available",
  },
  instagram: {
    id: "instagram",
    features: [
      "Schedule posts, Reels, and Stories",
      "Auto-respond to comments",
      "Hashtag and trend monitoring",
      "Follower growth tracking",
      "Influencer collaboration workflows",
    ],
    useCases: [
      "E-commerce product promotion",
      "Content creator scheduling",
      "Brand awareness campaigns",
    ],
    status: "available",
  },
  tiktok: {
    id: "tiktok",
    features: [
      "Upload and publish short-form videos",
      "Auto-caption and metadata tagging",
      "Trending sound detection",
      "Cross-platform repurposing",
      "Analytics and performance tracking",
    ],
    useCases: [
      "Viral content distribution",
      "Product launch campaigns",
      "Creator content pipelines",
    ],
    status: "available",
  },
  youtube: {
    id: "youtube",
    features: [
      "Upload and publish videos automatically",
      "Auto-generate titles and descriptions",
      "Thumbnail management",
      "Comment moderation bot",
      "Playlist and chapter management",
    ],
    useCases: [
      "Content channel automation",
      "Tutorial series publishing",
      "Live stream scheduling",
    ],
    status: "available",
  },
  whatsapp: {
    id: "whatsapp",
    features: [
      "Send automated messages",
      "Bot command routing",
      "Media sharing (images, docs, audio)",
      "Group management automation",
      "Read receipts webhook",
    ],
    useCases: [
      "E-commerce order notifications",
      "Customer support chatbot",
      "Team alert system",
    ],
    status: "available",
  },
  telegram: {
    id: "telegram",
    features: [
      "Custom bot commands and menus",
      "Channel broadcast automation",
      "Group moderation tools",
      "Inline query responses",
      "File and media delivery",
    ],
    useCases: [
      "Community announcements",
      "News delivery bot",
      "Internal team notifications",
    ],
    status: "available",
  },
  discord: {
    id: "discord",
    features: [
      "Server role automation",
      "Custom slash commands",
      "Webhook integrations",
      "Voice channel management",
      "Moderation bot actions",
    ],
    useCases: [
      "Gaming community management",
      "Developer team coordination",
      "Event announcement system",
    ],
    status: "available",
  },
  slack: {
    id: "slack",
    features: [
      "Channel notification automation",
      "Slash command integration",
      "Workflow builder triggers",
      "File sharing automation",
      "User status management",
    ],
    useCases: [
      "DevOps alert notifications",
      "Sales pipeline updates",
      "HR onboarding workflows",
    ],
    status: "available",
  },
  signal: {
    id: "signal",
    features: [
      "End-to-end encrypted messaging",
      "Secure group messaging",
      "Note-to-self automation",
      "Contact sync",
      "Privacy-first delivery",
    ],
    useCases: [
      "Secure internal communications",
      "Confidential client notifications",
      "High-security alert delivery",
    ],
    status: "available",
  },
  imessage: {
    id: "imessage",
    features: [
      "Apple ecosystem messaging",
      "Automation via macOS Shortcuts",
      "Group message broadcasting",
      "Rich media delivery",
      "iCloud contact integration",
    ],
    useCases: [
      "Apple device user outreach",
      "iOS app push via iMessage",
      "Automated appointment reminders",
    ],
    status: "available",
  },
  claude: {
    id: "claude",
    features: [
      "Anthropic Claude API integration",
      "Long-context document analysis",
      "Multi-turn conversation management",
      "Custom system prompt templates",
      "Streaming response support",
    ],
    useCases: [
      "AI-powered content generation",
      "Document summarization pipeline",
      "Intelligent customer support",
    ],
    status: "available",
  },
  gpt: {
    id: "gpt",
    features: [
      "OpenAI GPT model integration",
      "GPT-4o and GPT-4 Turbo support",
      "Function calling and tools",
      "Embeddings and semantic search",
      "Fine-tuning workflow support",
    ],
    useCases: [
      "Intelligent chatbot creation",
      "Code generation assistant",
      "Automated content creation",
    ],
    status: "available",
  },
  spotify: {
    id: "spotify",
    features: [
      "Playback control automation",
      "Playlist creation and management",
      "Now playing webhooks",
      "Track discovery and recommendations",
      "Podcast integration",
    ],
    useCases: [
      "Music-based mood automation",
      "Office/event playlist management",
      "Podcast workflow integration",
    ],
    status: "available",
  },
  hue: {
    id: "hue",
    features: [
      "Smart bulb control automation",
      "Scene and routine triggering",
      "Color and brightness scheduling",
      "Motion-based light responses",
      "Multi-room group management",
    ],
    useCases: [
      "Smart home automation",
      "Office productivity lighting",
      "Event atmosphere control",
    ],
    status: "available",
  },
  obsidian: {
    id: "obsidian",
    features: [
      "Vault sync and backup automation",
      "Note creation from webhooks",
      "Tag and metadata management",
      "Daily note generation",
      "Graph and backlink analysis",
    ],
    useCases: [
      "Personal knowledge management",
      "Research note automation",
      "Meeting note creation",
    ],
    status: "available",
  },
  x: {
    id: "x",
    features: [
      "Post scheduling and queuing",
      "Thread automation",
      "Reply and engagement monitoring",
      "Analytics and reach tracking",
      "Keyword alert webhooks",
    ],
    useCases: [
      "Brand social media presence",
      "Thought leadership publishing",
      "Real-time trend monitoring",
    ],
    status: "available",
  },
  browser: {
    id: "browser",
    features: [
      "Headless browser automation",
      "Web scraping pipelines",
      "Form filling automation",
      "Screenshot and PDF capture",
      "Multi-page workflow execution",
    ],
    useCases: [
      "Automated testing workflows",
      "Data collection pipelines",
      "Website monitoring bots",
    ],
    status: "available",
  },
  google: {
    id: "google",
    features: [
      "Google Search API integration",
      "Google Drive file management",
      "Google Calendar automation",
      "Google Sheets data sync",
      "Google Meet scheduling",
    ],
    useCases: [
      "Business productivity automation",
      "Document workflow management",
      "Scheduling and calendar sync",
    ],
    status: "available",
  },
  gmail: {
    id: "gmail",
    features: [
      "Email sending automation",
      "Inbox filtering and labeling",
      "Auto-reply and follow-ups",
      "Attachment handling",
      "Thread and label management",
    ],
    useCases: [
      "Customer communication automation",
      "Newsletter and campaign delivery",
      "Internal alert notifications",
    ],
    status: "available",
  },
  github: {
    id: "github",
    features: [
      "Repository event webhooks",
      "CI/CD pipeline triggers",
      "Issue and PR automation",
      "Release management",
      "Code review workflows",
    ],
    useCases: [
      "DevOps automation",
      "Release notification pipeline",
      "Issue triage and routing",
    ],
    status: "available",
  },
};

const PLATFORMS: Platform[] = [
  {
    id: "facebook",
    name: "Facebook",
    desc: "Automate posts and manage pages",
    icon: "fb",
    bgColor: "rgba(24,119,242,0.12)",
    iconBg: "rgba(24,119,242,0.2)",
  },
  {
    id: "instagram",
    name: "Instagram",
    desc: "Schedule content and track engagement",
    icon: "ig",
    bgColor: "rgba(193,53,132,0.12)",
    iconBg: "rgba(193,53,132,0.2)",
  },
  {
    id: "tiktok",
    name: "TikTok",
    desc: "Create and publish short-form videos",
    icon: "tt",
    bgColor: "rgba(0,0,0,0.25)",
    iconBg: "rgba(255,255,255,0.1)",
  },
  {
    id: "youtube",
    name: "YouTube",
    desc: "Manage channels and upload videos",
    icon: "yt",
    bgColor: "rgba(255,0,0,0.12)",
    iconBg: "rgba(255,0,0,0.2)",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    desc: "Chat automation and bot responses",
    icon: "wa",
    bgColor: "rgba(37,211,102,0.12)",
    iconBg: "rgba(37,211,102,0.2)",
  },
  {
    id: "telegram",
    name: "Telegram",
    desc: "Bot commands and channel management",
    icon: "tg",
    bgColor: "rgba(0,136,204,0.12)",
    iconBg: "rgba(0,136,204,0.2)",
  },
  {
    id: "discord",
    name: "Discord",
    desc: "Server automation and bot integration",
    icon: "dc",
    bgColor: "rgba(88,101,242,0.12)",
    iconBg: "rgba(88,101,242,0.2)",
  },
  {
    id: "slack",
    name: "Slack",
    desc: "Team notifications and workflow automation",
    icon: "sl",
    bgColor: "rgba(74,21,75,0.2)",
    iconBg: "rgba(224,30,90,0.15)",
  },
  {
    id: "signal",
    name: "Signal",
    desc: "Secure messaging integration",
    icon: "sg",
    bgColor: "rgba(59,138,224,0.12)",
    iconBg: "rgba(59,138,224,0.2)",
  },
  {
    id: "imessage",
    name: "iMessage",
    desc: "Apple messaging automation",
    icon: "im",
    bgColor: "rgba(0,199,134,0.12)",
    iconBg: "rgba(0,199,134,0.2)",
  },
  {
    id: "claude",
    name: "Claude",
    desc: "AI assistant integration (Anthropic)",
    icon: "cl",
    bgColor: "rgba(204,119,68,0.12)",
    iconBg: "rgba(204,119,68,0.2)",
  },
  {
    id: "gpt",
    name: "GPT",
    desc: "OpenAI GPT model integration",
    icon: "gp",
    bgColor: "rgba(16,163,127,0.12)",
    iconBg: "rgba(16,163,127,0.2)",
  },
  {
    id: "spotify",
    name: "Spotify",
    desc: "Music playback and playlist control",
    icon: "sp",
    bgColor: "rgba(29,185,84,0.12)",
    iconBg: "rgba(29,185,84,0.2)",
  },
  {
    id: "hue",
    name: "Hue",
    desc: "Smart lighting automation",
    icon: "hue",
    bgColor: "rgba(255,147,0,0.12)",
    iconBg: "rgba(255,147,0,0.2)",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    desc: "Note-taking and knowledge base sync",
    icon: "ob",
    bgColor: "rgba(124,58,237,0.12)",
    iconBg: "rgba(124,58,237,0.2)",
  },
  {
    id: "x",
    name: "X",
    desc: "Post scheduling and analytics",
    icon: "x",
    bgColor: "rgba(255,255,255,0.05)",
    iconBg: "rgba(255,255,255,0.1)",
  },
  {
    id: "browser",
    name: "Browser",
    desc: "Web automation and scraping",
    icon: "br",
    bgColor: "rgba(0,120,215,0.12)",
    iconBg: "rgba(0,120,215,0.2)",
  },
  {
    id: "google",
    name: "Google",
    desc: "Search, Drive, Calendar integration",
    icon: "go",
    bgColor: "rgba(66,133,244,0.12)",
    iconBg: "rgba(66,133,244,0.15)",
  },
  {
    id: "gmail",
    name: "Gmail",
    desc: "Email automation and filtering",
    icon: "gm",
    bgColor: "rgba(234,67,53,0.12)",
    iconBg: "rgba(234,67,53,0.2)",
  },
  {
    id: "github",
    name: "GitHub",
    desc: "Code repository and CI/CD automation",
    icon: "gh",
    bgColor: "rgba(255,255,255,0.06)",
    iconBg: "rgba(255,255,255,0.12)",
  },
];

function PlatformIcon({
  icon,
  iconBg,
  size = 44,
}: {
  icon: string;
  iconBg: string;
  size?: number;
}) {
  const iconStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: size * 0.27,
    background: iconBg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: 20,
  };

  const svgSize = size * 0.59;

  const svgIcons: Record<string, React.ReactNode> = {
    fb: (
      <svg
        role="img"
        aria-label="Facebook"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#1877F2"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    ig: (
      <svg
        role="img"
        aria-label="Instagram"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
      >
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <path
          fill="url(#ig-grad)"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        />
      </svg>
    ),
    tt: (
      <svg
        role="img"
        aria-label="TikTok"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="white"
      >
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.65a8.18 8.18 0 004.78 1.52V6.69a4.85 4.85 0 01-1.01-.0z" />
      </svg>
    ),
    yt: (
      <svg
        role="img"
        aria-label="YouTube"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#FF0000"
      >
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    wa: (
      <svg
        role="img"
        aria-label="WhatsApp"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#25D366"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    tg: (
      <svg
        role="img"
        aria-label="Telegram"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#0088cc"
      >
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    dc: (
      <svg
        role="img"
        aria-label="Discord"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#5865F2"
      >
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.115 18.102.133 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    sl: (
      <svg
        role="img"
        aria-label="Slack"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
      >
        <path
          fill="#E01E5A"
          d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
        />
        <path
          fill="#36C5F0"
          d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
        />
        <path
          fill="#2EB67D"
          d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
        />
        <path
          fill="#ECB22E"
          d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
        />
      </svg>
    ),
    sg: (
      <svg
        role="img"
        aria-label="Signal"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#3B8AE0"
      >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm.14 3.5c2.463 0 4.69.933 6.37 2.46L5.96 18.51A8.492 8.492 0 0 1 3.5 12c0-4.69 3.81-8.5 8.64-8.5zm0 17c-2.463 0-4.69-.933-6.37-2.46L18.04 5.49A8.492 8.492 0 0 1 20.5 12c0 4.69-3.81 8.5-8.36 8.5z" />
      </svg>
    ),
    im: (
      <svg
        role="img"
        aria-label="iMessage"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#00C786"
      >
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 13.5c-3.59 0-6.5-2.91-6.5-6.5S8.41 2.5 12 2.5s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5zm0-11.5c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
      </svg>
    ),
    cl: (
      <svg
        role="img"
        aria-label="Claude"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#CC7744"
      >
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    ),
    gp: (
      <svg
        role="img"
        aria-label="GPT"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#10A37F"
      >
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.379-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
      </svg>
    ),
    sp: (
      <svg
        role="img"
        aria-label="Spotify"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#1DB954"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
    hue: (
      <svg
        role="img"
        aria-label="Hue"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#FF9300"
      >
        <circle cx="12" cy="12" r="5" />
        <path
          d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="#FF9300"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    ob: (
      <svg
        role="img"
        aria-label="Obsidian"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
      >
        <path
          fill="#7C3AED"
          d="M12.003 0C9.592 0 7.434.968 5.874 2.522L2.52 5.876A7.455 7.455 0 0 0 0 11.275c0 1.843.663 3.528 1.756 4.84L.35 19.51C-.16 21.27.955 23.054 2.717 23.56a3.5 3.5 0 0 0 2.965-.482l3.358-2.343A11.944 11.944 0 0 0 12 21.484c2.41 0 4.57-.969 6.13-2.524l3.352-3.35a7.49 7.49 0 0 0 2.518-5.6 7.454 7.454 0 0 0-1.757-4.84l1.405-3.395C24.16 2.73 23.044.945 21.283.44a3.5 3.5 0 0 0-2.965.482l-3.36 2.344A11.905 11.905 0 0 0 12.003 0z"
        />
      </svg>
    ),
    x: (
      <svg
        role="img"
        aria-label="X"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="white"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.732-8.85L1.254 2.25H8.08l4.259 5.63L18.245 2.25h-.001zM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
    br: (
      <svg
        role="img"
        aria-label="Browser"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="#0078D7"
      >
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93c-3.94-.494-7-3.858-7-7.93s3.06-7.436 7-7.93V20zm2 0V4.07c3.94.494 7 3.858 7 7.93s-3.06 7.436-7 7.93z" />
      </svg>
    ),
    go: (
      <svg
        role="img"
        aria-label="Google"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
    gm: (
      <svg
        role="img"
        aria-label="Gmail"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
      >
        <path
          d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
          fill="#EA4335"
        />
      </svg>
    ),
    gh: (
      <svg
        role="img"
        aria-label="GitHub"
        viewBox="0 0 24 24"
        width={svgSize}
        height={svgSize}
        fill="white"
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  };

  return (
    <div style={iconStyle}>
      {svgIcons[icon] || (
        <span style={{ fontSize: 18, color: "white" }}>?</span>
      )}
    </div>
  );
}

// ─── Integration Detail Modal ──────────────────────────────────────────────

interface IntegrationDetailModalProps {
  platform: Platform | null;
  onClose: () => void;
}

function IntegrationDetailModal({
  platform,
  onClose,
}: IntegrationDetailModalProps) {
  const { t } = useLanguage();
  const details = platform ? PLATFORM_DETAILS[platform.id] : null;

  return (
    <Dialog open={!!platform} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        {platform && details && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-4 mb-2">
                <PlatformIcon
                  icon={platform.icon}
                  iconBg={platform.iconBg}
                  size={56}
                />
                <div>
                  <DialogTitle className="text-foreground font-display font-bold text-2xl">
                    {platform.name}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {platform.desc}
                  </p>
                </div>
                <Badge
                  className="ml-auto shrink-0 text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  variant="outline"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {t.workWith.availableNow}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Key Features */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">
                    {t.workWith.keyFeatures}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {details.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-foreground/80"
                    >
                      <div
                        className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: platform.iconBg }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Cases */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">
                    {t.workWith.useCases}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {details.useCases.map((useCase) => (
                    <li
                      key={useCase}
                      className="flex items-start gap-2.5 text-sm text-foreground/80"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-border"
              >
                Close
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={() => {
                  onClose();
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {t.workWith.getStarted}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Request Integration Modal ─────────────────────────────────────────────

interface RequestIntegrationModalProps {
  open: boolean;
  onClose: () => void;
}

function RequestIntegrationModal({
  open,
  onClose,
}: RequestIntegrationModalProps) {
  const { t } = useLanguage();
  const [platformName, setPlatformName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [useCase, setUseCase] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformName.trim() || !useCase.trim()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    toast.success(t.workWith.requestSubmitted);
    setPlatformName("");
    setWebsiteUrl("");
    setUseCase("");
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground font-display font-bold text-xl">
            {t.workWith.requestIntegrationTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="req-platform" className="text-sm text-foreground">
              {t.workWith.platformName}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="req-platform"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              placeholder="e.g. Notion, Linear, Figma..."
              required
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="req-url" className="text-sm text-foreground">
              {t.workWith.websiteUrl}
            </Label>
            <Input
              id="req-url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              type="url"
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="req-usecase" className="text-sm text-foreground">
              {t.workWith.useCase} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="req-usecase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              placeholder="Describe your use case..."
              required
              rows={3}
              className="bg-background border-border resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="req-email" className="text-sm text-foreground">
              {t.workWith.yourEmail}
            </Label>
            <Input
              id="req-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              className="bg-background border-border"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !platformName.trim() || !useCase.trim()}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                  Submitting...
                </span>
              ) : (
                t.workWith.submitRequest
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export function WorkWithEverythingSection() {
  const { t } = useLanguage();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null,
  );
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  return (
    <section id="integrations" className="relative py-24 overflow-hidden">
      <DotsBackground />
      {/* Subtle background grid */}
      <div className="absolute inset-0 hex-grid-bg opacity-20 pointer-events-none" />
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />

      <IntegrationDetailModal
        platform={selectedPlatform}
        onClose={() => setSelectedPlatform(null)}
      />
      <RequestIntegrationModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-cyan/70 mb-3 px-4 py-1.5 rounded-full border border-cyan/20 bg-cyan/5">
            {t.workWith.sectionLabel}
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-foreground mb-4 leading-tight">
            {t.workWith.sectionTitle}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {t.workWith.sectionDesc}
          </p>
        </motion.div>

        {/* Platform Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          {PLATFORMS.map((platform) => (
            <motion.button
              key={platform.id}
              variants={cardVariants}
              whileHover={{
                y: -5,
                scale: 1.04,
                transition: { duration: 0.2 },
              }}
              onClick={() => setSelectedPlatform(platform)}
              className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl cursor-pointer w-full text-left"
              style={{
                background: `linear-gradient(135deg, ${platform.bgColor}, rgba(255,255,255,0.03))`,
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
              }}
              aria-label={`View ${platform.name} integration details`}
            >
              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at center, ${platform.iconBg} 0%, transparent 70%)`,
                }}
              />

              <PlatformIcon icon={platform.icon} iconBg={platform.iconBg} />

              <div className="relative z-10 text-center">
                <p className="font-semibold text-sm text-foreground leading-tight mb-1">
                  {platform.name}
                </p>
                <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                  {platform.desc}
                </p>
              </div>

              {/* "View Details" hint on hover */}
              <AnimatePresence>
                <div className="absolute inset-0 rounded-2xl flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <span className="text-[10px] font-semibold text-foreground/70 bg-background/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {t.workWith.viewDetails}
                  </span>
                </div>
              </AnimatePresence>

              {/* Corner accent dot */}
              <div
                className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ background: platform.iconBg }}
              />
            </motion.button>
          ))}
        </motion.div>

        {/* Bottom CTA — Request Integration */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10 flex flex-col items-center gap-3"
        >
          <p className="text-muted-foreground text-sm">
            Don't see your platform? Request it below.
          </p>
          <Button
            variant="outline"
            onClick={() => setRequestModalOpen(true)}
            className="border-cyan/30 text-cyan hover:bg-cyan/10 hover:border-cyan/50 transition-all gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            {t.workWith.requestIntegration}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
