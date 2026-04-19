# Iteration Whiteboard

**Change request:** every product needs a product detail and cart full logic, also cannot load it at all index-CuL7rNjp.js:8 Error: Client could not be generated. This is likely due to `Amplify.configure()` not being called prior to `generateClient()` or because the configuration passed to `Amplify.configure()` is missing GraphQL provider configuration.
    at Object.get (index-CuL7rNjp.js:66:14574)
    at index-CuL7rNjp.js:129:4547
    at hc (index-CuL7rNjp.js:8:24452)
    at ka (index-CuL7rNjp.js:8:42829)
    at index-CuL7rNjp.js:8:41075
    at U (index-CuL7rNjp.js:1:10545)
    at MessagePort.B (index-CuL7rNjp.js:1:10917)
index-CuL7rNjp.js:6 Uncaught Error: Client could not be generated. This is likely due to `Amplify.configure()` not being called prior to `generateClient()` or because the configuration passed to `Amplify.configure()` is missing GraphQL provider configuration.
    at Object.get (index-CuL7rNjp.js:66:14574)
    at index-CuL7rNjp.js:129:4547
    at hc (index-CuL7rNjp.js:8:24452)
    at ka (index-CuL7rNjp.js:8:42829)
    at index-CuL7rNjp.js:8:41075
    at U (index-CuL7rNjp.js:1:10545)
    at MessagePort.B (index-CuL7rNjp.js:1:10917)

**Subtasks planned:** 3

1. **Engineer**: Fix the runtime crash: make Amplify client initialization safe. In src (App bootstrap and any module calling generateClient<Schema>()), conditionally import amplify_outputs.json with try/catch and only call Amplify.configure() + generateClient() when config is present. Export a lazy client getter so modules don't invoke generateClient() at import time. Ensure the app renders in preview mode (no backend) without throwing. Remove any top-level generateClient() calls that execute before configure().
2. **Engineer**: Build full shop experience: (a) Product detail route /product/:id with image gallery, description, price, quantity selector, Add to Cart. (b) Cart context/store backed by Amplify Data CartItem model (fallback to in-memory for preview mode ONLY when no config) with add, remove, update quantity, subtotal, tax/shipping estimate. (c) Cart drawer + /cart page showing line items, totals, Checkout button. (d) Wire Checkout to existing Stripe checkout Lambda/function URL — POST cart items, redirect to Stripe. (e) Handle success/cancel return routes. Ensure all routes work in preview mode without crashing. Run npm run build until exit 0.
3. **QA**: Verify: app loads without console errors in preview (no amplify_outputs.json) and with config. Click a product → detail page renders. Add multiple products to cart, change quantities, remove items. Cart persists across navigation. Checkout button redirects to Stripe test session. Confirm no 'Client could not be generated' error in any flow.

---

