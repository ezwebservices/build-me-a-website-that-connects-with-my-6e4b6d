# Iteration Whiteboard

**Change request:** i cant see the the studio access and there is no shop data Preview mode
The backend isn't connected yet
Deploy this project with Amplify Gen 2 so that amplify_outputs.json is generated. Until then, product data and checkout cannot be loaded live — but the site design is fully rendered so you can iterate on the look and feel.

**Subtasks planned:** 3

1. **Architect**: Audit amplify/ backend for deploy-readiness: verify amplify/backend.ts wires data + auth + storage + any Lambda functions, confirm amplify/data/resource.ts models (Product, Order, etc.) are complete with correct authorization rules, confirm secrets use secret('NAME') not process.env, and confirm amplify.yml builds cleanly. Fix any blockers that would cause `npx ampx sandbox` or Amplify Hosting deploy to fail. Report what's ready and what the user must do to trigger the deploy (push to main / connect repo in Amplify console).
2. **Engineer**: Fix the Preview/Studio experience so it is useful until the backend deploys and seamless after: (1) ensure amplify_outputs.json is loaded via try/catch so the app never crashes, (2) in the admin/Studio route, if no config is detected, show a clear inline panel explaining deploy steps (link to Amplify Gen 2 docs, the exact commands, and what will appear once deployed) instead of a blank/broken page — AND still allow navigation to all Studio screens in a disabled/preview state, (3) on the shop page, when no config is present, render real-looking placeholder product cards clearly labeled 'Preview — connect backend to load live products' rather than an empty state, (4) add a small persistent banner on admin routes that disappears automatically once amplify_outputs.json is present. Write a DEPLOY.md at repo root with step-by-step Amplify Gen 2 deploy instructions (connect GitHub repo in Amplify console, set STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET secrets via `npx ampx sandbox secret set`, expected build output). Run `npm run build` until it exits 0.
3. **QA**: Verify: `npm run build` exits 0; visiting the Studio/admin route with no amplify_outputs.json shows the deploy-instructions panel (not a crash or blank); the shop page shows labeled preview products; no console errors in production build; the DEPLOY.md instructions are accurate against the actual amplify/ files. Report pass/fail per item.

---

