# ClawPro

## Current State
Full-stack ClawPro.ai app with dashboard (accessible post-login), login modal (username + password from localStorage), and Install & Integrations panel using emoji icons.

## Requested Changes (Diff)

### Add
- "Lupa Password?" link in LoginModal with inline recovery view showing stored password
- Logout button in dashboard top-right corner (inside MemberDashboard top bar)
- Real SVG brand icons in Install & Integrations panel (replacing emojis)

### Modify
- LoginModal: add forgot password flow
- MemberDashboard: add logout button in top bar; replace emoji icons with react-icons/si in INTEGRATIONS array

### Remove
- Emoji-only icons from Install & Integrations

## Implementation Plan
- LoginModal: add view toggle for forgot password, look up account in localStorage
- MemberDashboard top bar: add LogOut button calling onClose + clearing localStorage
- INTEGRATIONS: replace emoji strings with React nodes from react-icons/si
