# Project

build me a website that connects with my stripe, i can easily create products, pictures, price, handle shipping, it should be a creative modern design, its going to be for my cnc garage business. create an elegant artsy feel to the site and everything i need to run the cnc business start to finish.

## Stack + expectations
- Vite + TypeScript (strict). Tailwind if the idea needs styling.
- Every function fully implemented. No TODOs, no placeholders, no mock data in place of real code.
- `npm install` then keep running `npm run build` until it exits 0.
- Make it feel polished — no console.log noise in production paths, sensible empty/loading/error states, keyboard nav where relevant.

## AWS Amplify Gen 2 deployment
This project ships with aws-samples/amplify-vite-react-template already cloned (React + Vite + TS + Amplify Gen 2 auth/data). Extend it, don't re-scaffold.
- DO NOT import from '../amplify_outputs.json' unconditionally — generated at deploy time. Use try/catch or conditional render.
- If you need auth UI, use <Authenticator> from '@aws-amplify/ui-react' with graceful handling of a missing config.

## Persistence — USE AMPLIFY DATA, NOT localStorage (HARD RULE)
The template already wires up `amplify/data/resource.ts` with a Todo example. That is the pattern for ALL user/app data in this project. Model your domain in `amplify/data/resource.ts`, then read/write from React via the typed client:

```ts
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
const client = generateClient<Schema>();

// Create
await client.models.Drop.create({ title, story, dropAtIso });
// List
const { data } = await client.models.Drop.list();
// Real-time
const sub = client.models.Drop.observeQuery().subscribe({ next: ({ items }) => setDrops(items) });
```

HARD RULES:
- NEVER use `localStorage`, `sessionStorage`, or `IndexedDB` for user-facing data (drops, pledges, invites, user profile, settings tied to a user, etc.). That data MUST live in Amplify Data models so it persists across devices and survives logout.
- `localStorage` is acceptable ONLY for pure client-side UI state that is both ephemeral AND user-specific in-session (e.g., last tab selected, dismissed onboarding banner). If in doubt, use Amplify Data.
- NEVER invent a mock in-memory store or JSON fixture for the main data shape. If you need seed data, write a real mutation in a Lambda or an `useEffect` that calls `client.models.X.create` once.
- File uploads (images, videos, PDFs) MUST use `aws-amplify/storage` (`uploadData` / `getUrl`) with a corresponding `amplify/storage/resource.ts`. Never store file bytes as base64 in a model field.
- Auth state comes from `<Authenticator>` or `getCurrentUser()` from `aws-amplify/auth`. Do not store auth tokens manually in localStorage.

Starter wiring in `src/App.tsx` — if it's the default Todo demo, REPLACE the schema and the rendered list with YOUR domain (e.g., Drop, Pledge, Invite) but keep the `generateClient<Schema>()` + `observeQuery()` pattern. Do not tear out the client and swap it for local state.

## Lambda function environment variables (if applicable)
For any amplify/functions/<name>/resource.ts files, EVERY runtime secret MUST use secret('NAME') from '@aws-amplify/backend':
  // RIGHT — resolved from SSM at cold start
  environment: { STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY') }
  // WRONG — bakes empty string into deployed Lambda
  environment: { STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '' }

## Frontend subscription UI (if applicable)
NEVER hardcode price/plan/interval. Read from Vite env vars the orchestrator writes to Amplify Hosting envVars:
  const PLAN_NAME = import.meta.env.VITE_STRIPE_PLAN_NAME || 'Premium';
  const PLAN_AMOUNT_CENTS = parseInt(import.meta.env.VITE_STRIPE_PLAN_AMOUNT || '0', 10);
  const PLAN_CURRENCY = (import.meta.env.VITE_STRIPE_PLAN_CURRENCY || 'usd').toLowerCase();
  const PLAN_INTERVAL = import.meta.env.VITE_STRIPE_PLAN_INTERVAL || 'month';


## Memory from past builds


---
# AI MEMORY CONTEXT (from previous sessions)
Use this knowledge to make better decisions. Do NOT repeat past mistakes.

## Learnings from Previous Builds
### build_e5093d12-3cfb-4aa9-b285-aa4534608197
Idea: simple but visual appealing infinite scroll app design for a 4 year old counting addition subtraction. evrything ui should be designed for a 4 year old. audio playback. think like tiktok lessons combined with animal character. visuals are everything
Status: done
Files created: 595
Total events: 8993
Errors encountered:
All components created. Now let me run the build to check for errors.
Build passes with zero errors. Let me now update the whiteboard.
Engineer failed — retrying automatically...
Now let me run the build to check for errors.
Build passes cleanly with zero errors. Let me now append to the whiteboard.
Key files: C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/.orchestrator/plan.json, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/amplify_outputs.json, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/tsconfig.json, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/tsconfig.json, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/tsconfig.json, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/vite.config.ts, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/types.ts, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/styles/theme.ts, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/components/characters/BennyBear.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/components/characters/LuluLadybug.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/components/characters/OllieOwl.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/components/characters/FifiFrog.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/components/characters/FifiFrog.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/components/characters/ZiggyZebra.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/components/characters/CharacterDisplay.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/components/characters/index.ts, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/components/objects/Apple.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/components/objects/Star.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/components/objects/Heart.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/e5093d12-3cfb-4aa9-b285-aa4534608197/src/components/objects/Balloon.tsx

### build_9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9
Idea: Build a math learning app for 4-year-olds that teaches addition and subtraction through an interactive story
  adventure. No external assets — all visuals must be inline SVG illustrations and CSS animations created by the
   team.

  Core concept: A friendly character (like a little fox or robot) goes on adventures where math problems are
  woven into the story. "3 birds are sitting in a tree, 2 more fly in — how many now?" The child taps/clicks to
  answer with visual counting aids (animated dots, fingers, objects).

  Requirements:

  - Adaptive lesson engine: Start with counting 1-10, progress to addition within 5, then within 10, then simple
   subtraction. The system must track accuracy per skill and auto-adjust difficulty — if a child gets 3 in a row
   right, advance; 2 wrong, drop back and re-teach with scaffolding.
  - Progress analytics: Store all session data (time spent, accuracy by skill, streaks, trouble spots). Use this
   to generate a difficulty curve per child.
  - Parent dashboard: Password-protected view showing: skills mastered vs in-progress, accuracy trends over time
   (chart), time spent per session, recommended focus areas. Use clean data visualizations built with SVG.
  - Engagement system: Earn stars and unlock new story chapters. Celebration animations on correct answers
  (confetti, character dances). Gentle encouragement on wrong answers — never punitive, always "let's try
  together."
  - All art is code: Every character, background, and UI element must be SVG or CSS — no image files, no CDN
  assets, no external fonts. Use system fonts and emoji as fallback.
  - Audio-free design: Since no external assets, use visual cues and animations instead of sound. Large tap
  targets sized for small fingers.
  - Story chapters: At least 5 unlockable chapters with different themes (garden, ocean, space, jungle, bakery)
  each introducing harder problems naturally through the narrative.
Status: done
Files created: 69
Total events: 306
Errors encountered:
The TS errors are all "Cannot find module 'react'" — that's because the standalone tsc v6.0.2 was used instead of the project's local one. Let me use the project's build tool.
No real errors in our SVG components (the TS7026 JSX errors are a tsconfig issue, not our code). Let me check all our files compile cleanly by filtering to just real type errors.
Zero real type errors in our components. The only TS issues are environment-level (missing jsx-runtime paths — a tsconfig setting, not a code issue).
Let me fix these errors. Let me first read the files that have issues.
Zero errors! Now let's try the full build:
Key files: C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/.orchestrator/plan.json, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/characters/Fox.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/counting/GardenObjects.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/ui/AnswerButton.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/backgrounds/GardenBackground.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/ui/ProgressStar.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/counting/OceanObjects.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/backgrounds/SpaceBackground.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/counting/SpaceObjects.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/ui/ChapterCard.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/ui/NavigationArrow.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/ui/index.ts, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/counting/JungleObjects.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/counting/BakeryObjects.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/counting/index.ts, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/backgrounds/OceanBackground.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/backgrounds/JungleBackground.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/backgrounds/BakeryBackground.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/backgrounds/JungleBackground.tsx, C:/Users/brand/Documents/Orchestrator/workspaces/9eb4bac1-4ec6-4565-a258-69dcc7fdc8d9/src/components/svg/animations/ConfettiBurst.tsx
---


