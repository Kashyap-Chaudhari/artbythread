# Omnichannel Order Notification & Email Mirroring Guide — ArtByThread.7

This guide outlines how the **ArtByThread.7** zero-cost omnichannel order notification system works across the website, email, WhatsApp, and Instagram.

---

## 1. How Phase 1 Works (100% Free Tier, Active Now)

### Order & Enquiry Flow
1. **Customer Submits Order on Website (`/creation/[slug]` or `/custom`)**:
   - Customer fills in their Name, Phone, Email, Delivery City, Quantity, Customization notes, and selects their **Preferred Contact Channel** (WhatsApp, Instagram, or Email).
   - Form is validated client and server side via **Zod + React Hook Form**.
2. **Instant Transactional Email Dispatch (Resend)**:
   - **To Customer**: Receives an instant, beautifully formatted HTML confirmation email containing the inline product photo, their unique Order ID (`AT7-XXXX`), summary, and delivery city.
   - **To Admin (`kashyapchaudhari299@gmail.com`)**: Receives an alert with full customer contact information, customization notes, inline product photo, and 1-click links to reply on WhatsApp or open the live order tracking page.
3. **Interactive Success Dialog & Rich Link Previews**:
   - **WhatsApp**: Customer taps "Confirm via WhatsApp" with a pre-filled `wa.me` deep link that includes their order details and their public tracking URL (`https://artbythread.com/order/AT7-XXXX`).
   - **Instagram**: Customer taps "Message us on Instagram" and uses the 1-click copyable DM draft.
   - **Open Graph Rich Previews**: When the tracking link is sent in WhatsApp or Instagram DM, Meta platforms automatically generate a thumbnail preview of the handmade creation!
4. **Public Order Tracking Page (`/order/[id]`)**:
   - No login needed. Shows a 5-step visual order stepper (`New` ➔ `Confirmed` ➔ `In Production` ➔ `Dispatched` ➔ `Delivered`).

---

## 2. Direct Email Orders Replica (Rule Setup in Your Business Inbox)

If a customer emails your business address directly (e.g. `artbythread.7@gmail.com` or `hello@artbythread.com`), configure an auto-forwarding / auto-reply rule in your email client:

### In Gmail / Google Workspace:
1. Go to **Settings (Gear Icon)** ➔ **See all settings** ➔ **Filters and Blocked Addresses**.
2. Click **Create a new filter**.
3. In **To**, enter your business address or leave blank and set **Subject** / **Has the words** to `order OR enquiry OR custom`.
4. Click **Create filter**.
5. Check:
   - ✅ **Forward it to**: `kashyapchaudhari299@gmail.com` (your monitoring inbox).
   - ✅ **Send template / Canned response**: Select your confirmation template ("*Thank you for reaching out to ArtByThread.7! We craft every piece slowly by hand...*").

---

## 3. Phase 2: Live WhatsApp & Instagram Webhook Mirroring (Meta Cloud API)

When you are ready to connect official WhatsApp Cloud API and Instagram Messaging API:

### 1. Webhook Endpoint
The webhook endpoint is already built at:
`https://yourdomain.com/api/webhooks/meta`

### 2. Environment Variables in `.env.local`
Add the following keys:
```env
META_WEBHOOK_VERIFY_TOKEN="artbythread_meta_verify_token_2026"
RESEND_API_KEY="re_..."
ADMIN_EMAIL="kashyapchaudhari299@gmail.com"
```

### 3. Meta App Dashboard Configuration:
1. In the [Meta for Developers](https://developers.facebook.com/) dashboard, go to your App.
2. Select **WhatsApp** ➔ **Configuration** (or **Messenger / Instagram** ➔ **Instagram Graph API**).
3. Set **Callback URL** to `https://yourdomain.com/api/webhooks/meta`.
4. Set **Verify Token** to `artbythread_meta_verify_token_2026`.
5. Subscribe to the `messages` event.
6. Whenever an inbound WhatsApp or Instagram DM arrives, Meta calls this endpoint, which formats the message and forwards it directly to your admin email inbox via Resend!

---

## 4. Cost Breakdown & Reality Check

| Component | Cost | Notes |
| :--- | :--- | :--- |
| `wa.me` links & manual WhatsApp chat | **₹0 Free** | No API approval needed |
| Instagram DM deep links | **₹0 Free** | No API approval needed |
| Resend Transactional Email | **₹0 Free** | 3,000 emails/month (100/day) |
| Supabase Postgres & Storage | **₹0 Free Tier** | 500MB DB, 1GB Storage |
| Public Link Previews (Open Graph) | **₹0 Free** | Native Next.js App Router |
| Next.js + Tailwind + Vercel / Cloudflare | **₹0 Free** | Open source stack |
