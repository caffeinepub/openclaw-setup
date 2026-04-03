# ClawPro

## Current State
- OpenClawDashboardPanel.tsx exists and is imported in MemberDashboard.tsx — it pings openclaw.ai for status but does NOT make real API calls (chat/completions)
- SetInActionsSection.tsx has 3 typewriter lines with short 1-liner texts only, no step-by-step flow, no goals description
- Button colors: Login = bg-cyan, Save Handle = gradient #00c6ff→#0072ff→#a855f7, Go to Dashboard (hero CTA) = gradient cyan-blue-violet, Go to Dashboard (Navbar) = outline cyan, Pricing Subscribe buttons = slate/amber/violet per tier
- No animated step-by-step (Claim Handle → Register → Install → Integrate) section exists

## Requested Changes (Diff)

### Add
- Real OpenClaw API chat/completions call in OpenClawDashboardPanel: when user sends a test message, POST to https://api.openclaw.ai/v1/chat/completions (or compatible endpoint) with the stored API key, show real response in the panel
- Animated step-by-step flow section inside SetInActionsSection: 4 steps (1. Claim Your Handle, 2. Register Account, 3. Install & Connect, 4. Integrate & Go Live) with glowing dots connected by animated light-traveling lines flowing left-to-right. Each step has icon, title, short description. Lines animate a traveling glow from left to right between steps.
- Extended ClawPro goals/description text in SetInActionsSection: longer multi-paragraph description of what ClawPro is, its purpose, mission, and capabilities

### Modify
- OpenClawDashboardPanel: wire the Quick Test textarea to actually POST to OpenClaw API and show real response; add error handling for invalid API key or network errors
- SetInActionsSection: expand all 5 typewriter texts per line to be much longer and more descriptive; add full section title + description block above the typewriter lines; add animated step-by-step flow below typewriters
- Button colors — change ALL these to bright electric blue (#0ea5e9 / #2563eb / bright blue gradient style matching the Login button's cyan/blue): 
  - "Go to Dashboard" button in Navbar (currently outline cyan → solid bright blue)
  - "Go to Dashboard" button in HeroSection CTA (currently gradient cyan-blue-violet → bright blue)
  - "Search" button inside WorkWithEverythingSection (if any)
  - "Save Handle" / "Login & Save Handle" button in HeroSection UnifiedClaimSearchCard (currently purple gradient → bright blue gradient matching login)
  - Pricing Subscribe/Buy Now buttons (Silver/Gold/Platinum all get a consistent bright blue base)
  - Any "Subscribe" buttons in PricingSection

### Remove
- Nothing removed

## Implementation Plan
1. **OpenClawDashboardPanel.tsx**: Add real fetch call in `handleTest` function — POST to `https://api.openclaw.ai/v1/chat/completions` with `{model: selectedModel, messages: [{role: 'user', content: testInput}]}` and bearer token from apiKey state. Show actual response.choices[0].message.content in the result box. Handle 401 (invalid key), network errors gracefully with user-friendly messages.
2. **SetInActionsSection.tsx**: 
   - Add a header block: "What is ClawPro?" with 3-4 paragraphs describing ClawPro mission, goals, capabilities (AI integrations, crypto, global onboarding, bot management)
   - Expand each LINES array entry from 5 short texts to 6-7 longer descriptive texts
   - Add animated step-by-step section below typewriters: 4 steps in a horizontal row on desktop (vertical on mobile), connected by animated traveling-light lines. Each step: glowing numbered circle, icon, title, description. The line between steps has a dot/light that animates from left to right using CSS keyframes.
3. **Navbar.tsx**: Change Dashboard button from `variant=outline border-cyan/40 text-cyan` to solid bright blue style: `background: linear-gradient(135deg, #0ea5e9, #2563eb)` matching Login button energy
4. **HeroSection.tsx**: Change Go to Dashboard CTA button gradient to pure bright blue `linear-gradient(135deg, #0ea5e9, #2563eb)`. Change Save Handle button gradient to same bright blue `linear-gradient(135deg, #0ea5e9, #2563eb, #1d4ed8)` matching Login button.
5. **PricingSection.tsx**: Change all tier Buy Now/Subscribe button classes to use bright blue: `background: linear-gradient(135deg, #0ea5e9, #2563eb)` for all tiers (Silver/Gold/Platinum), with tier-specific accent glow but consistent blue base.
