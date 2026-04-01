# ClawPro - OpenClaw Setup & Dashboard Integration

## Current State
SetupSection.tsx shows tabs for Android, Windows, macOS, Linux with install steps and commands. MemberDashboard.tsx has ClawBot panel with OpenClaw.ai switch, and an 'openclaw' entry in the install integrations list.

## Requested Changes (Diff)

### Add
- OpenClaw tab in SetupSection BEFORE Android/Windows/macOS/Linux tabs
- The OpenClaw tab features a premium terminal-style card with macOS window chrome (red/yellow/green dots)
- Sub-tabs inside the terminal: One-liner, npm, Hackable, macOS -- with right-side variant badges (npm/pnpm/β BETA, installer/pnpm, macOS/Linux, Windows)
- Commands shown in terminal style with green dollar-sign prompt, cyan command text, copy button
- One-liner tab: `curl -fsSL https://openclaw.ai/install.sh | bash -s -- --beta` (macOS/Linux + Windows + β BETA variants)
- npm tab: `npm i -g openclaw@beta` then `openclaw onboard` (npm + pnpm + β BETA variants)
- Hackable tab: `curl -fsSL https://openclaw.ai/install.sh | bash -s -- --install-method git` (installer + pnpm variants)
- macOS tab: Companion App (Beta) section with a red glow download button for macOS + requirements note
- API status call to openclaw.ai to show live connection status in the terminal header
- OpenClaw API Dashboard panel in MemberDashboard - new tab/section showing: API connection status (live ping to openclaw.ai), API key input, model selector, usage stats, quick test command area
- The OpenClaw dashboard panel integrates with the existing ClawBot panel (shows same API key, status)

### Modify
- SetupSection.tsx: add 'openclaw' as first tab, shift Android/Windows/macOS/Linux after it
- MemberDashboard.tsx: add OpenClaw API panel visible in the Services or as a dedicated sidebar item

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/sections/OpenClawSetupTerminal.tsx` - the terminal UI component with sub-tabs
2. Update `SetupSection.tsx` to add openclaw tab before android tab, render OpenClawSetupTerminal for openclaw value
3. Create `src/frontend/src/components/OpenClawDashboardPanel.tsx` - dashboard panel showing API status, key config, usage
4. Update MemberDashboard.tsx to add 'openclaw-api' menu item in sidebar and render OpenClawDashboardPanel
