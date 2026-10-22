---
name: Next.js Replit preview hosts
description: Next.js development-origin allowlisting needed for the Replit preview proxy.
---

For current Next.js development servers, configure `allowedDevOrigins` to include the preview hostnames used by Replit. The local preview checker may access the app as `127.0.0.1`, while user previews use a `*.replit.dev` hostname; without these entries, the page can render while HMR and other development resources are blocked.

**Why:** Next.js 16 blocks cross-origin development resources by default, which caused a failed HMR websocket despite the page returning HTTP 200.

**How to apply:** When configuring a Next.js dev server for Replit, allow the actual preview hostnames and confirm the browser console and workflow logs are clean.
