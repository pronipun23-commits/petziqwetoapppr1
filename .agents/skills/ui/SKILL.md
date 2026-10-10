# Skill Name: Apple-Level UI/UX Generation

## Overview
This skill instructs the agent to design and generate front-end interfaces that reflect Apple's core design philosophy: premium, minimalist, highly fluid, accessible, and deeply intentional. It forces the model to bypass generic templates and output premium visual hierarchies.

## Prerequisites
- **Required Plugins:** TailWind CSS, Lucide Icons (or SF Symbols if environment supports it), Framer Motion / Web Animations API.
- **Environment Context:** Active React, Vue, or HTML/Tailwind workspaces.

## Execution Rules & Triggers
- **Trigger Phase:** UI Mockup, Front-end Component Generation, Code Refactoring.
- **Keywords/Context:** Activates whenever the user asks to "build a UI", "design a page", "make it look premium", "modern interface", or "Apple style".

## Core Instructions
When generating UI code or design specifications, the agent must strictly apply the following steps:
1. **Apply Dynamic Whitespace:** Force generous padding and margin. Let elements breathe. Use a strict 8pt grid system.
2. **Enforce Typrographic Hierarchy:** Use system font stacks (`-apple-system`, `BlinkMacSystemFont`, `SF Pro`). Establish stark contrast between large, heavy, tracking-adjusted headers and crisp, readable body text.
3. **Use Soft Layering & Depth:** Utilize subtle background blurs (`backdrop-blur`), soft micro-shadows, and slight border-radii (`rounded-2xl` to `rounded-3xl`) to mimic iOS/macOS materials.
4. **Design Fluid Interactions:** Include hardware-accelerated transitions (spring physics, ease-in-out, duration-300) for hover, active, and focus states. 

## Constraints & Exclusions
- **Do Not:** Use harsh #000000 pure blacks for backgrounds; use deep ink tones (e.g., `#050505`) or pure off-whites (`#F5F5F7`).
- **Do Not:** Use loud, high-saturation gradient meshes or cluttered, dense grids.
- **Do Not:** Include unnecessary visual noise, heavy borders, or generic icon sets.

## Output Formatting
- Wrap all layout snippets in highly modular, copy-pasteable Tailwind/React functional components.
- Provide a brief, bulleted "Design Intent" summary below the code explaining the UX decisions (e.g., why a specific micro-interaction or layout layout was chosen).