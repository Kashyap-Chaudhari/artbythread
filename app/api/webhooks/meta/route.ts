import { NextResponse } from "next/server";
import { initialSiteSettings } from "@/lib/data";

/**
 * ================================================================================
 * PHASE 2: CROSS-CHANNEL MESSAGE MIRRORING WEBHOOK (META CLOUD API)
 * ================================================================================
 * Handles inbound messages from WhatsApp Business Platform (Cloud API)
 * and Instagram Messaging API (Graph API / Messenger Platform).
 * 
 * Inbound messages are parsed and automatically forwarded to the admin email inbox
 * via Resend as a permanent, searchable audit trail.
 * 
 * SETUP INSTRUCTIONS (When Meta App Review is complete):
 * 1. Set META_WEBHOOK_VERIFY_TOKEN in .env.local
 * 2. Configure Callback URL in Meta App Dashboard: https://yourdomain.com/api/webhooks/meta
 * 3. Subscribe to webhook fields: 'messages' (WhatsApp) and 'messages, messaging_postbacks' (Instagram).
 * ================================================================================
 */

// GET: Meta Webhook Handshake / Verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || "artbythread_meta_verify_token_2026";

  if (mode === "subscribe" && token === verifyToken) {
    console.log("[META WEBHOOK VERIFICATION SUCCESS] Webhook challenge verified.");
    return new Response(challenge, { status: 200 });
  }

  console.warn("[META WEBHOOK VERIFICATION FAILED] Invalid verify token or mode.");
  return new Response("Forbidden: Verification token mismatch", { status: 403 });
}

// POST: Inbound Message Event Handling & Admin Email Mirroring
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Log inbound payload
    console.log("[META WEBHOOK EVENT RECEIVED]", JSON.stringify(body, null, 2));

    const resendApiKey = process.env.RESEND_API_KEY || "";
    const adminEmail = process.env.ADMIN_EMAIL || initialSiteSettings.email_contact;

    const channelSource = body.object === "instagram" ? "Instagram DM" : "WhatsApp Business";

    // 2. Extract Message Details
    let senderId = "Unknown Sender";
    let senderName = "Customer";
    let messageText = "";
    let mediaUrl = "";
    let messageType = "text";
    let timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // WhatsApp Cloud API payload format
    if (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const msgObj = body.entry[0].changes[0].value.messages[0];
      const contactObj = body.entry[0].changes[0].value.contacts?.[0];
      
      senderId = msgObj.from;
      senderName = contactObj?.profile?.name || `Customer (+${senderId})`;
      messageType = msgObj.type;

      if (msgObj.type === "text") {
        messageText = msgObj.text?.body || "";
      } else if (msgObj.type === "image") {
        messageText = msgObj.image?.caption || "[Image Attachment]";
        mediaUrl = msgObj.image?.id ? `https://graph.facebook.com/v18.0/${msgObj.image.id}` : "";
      } else {
        messageText = `[${msgObj.type} message]`;
      }
    }
    // Instagram Messaging API payload format
    else if (body.entry?.[0]?.messaging?.[0]) {
      const msgObj = body.entry[0].messaging[0];
      senderId = msgObj.sender?.id || "IG User";
      senderName = `Instagram User (${senderId})`;
      
      if (msgObj.message?.text) {
        messageText = msgObj.message.text;
      } else if (msgObj.message?.attachments) {
        const firstAttach = msgObj.message.attachments[0];
        messageType = firstAttach.type || "media";
        mediaUrl = firstAttach.payload?.url || "";
        messageText = `[Attached ${messageType}]`;
      }
    } else {
      // General ping or delivery receipt event
      return NextResponse.json({ status: "EVENT_RECEIVED", mirrored: false });
    }

    // 3. Mirror message to Admin Email via Resend
    if (resendApiKey && messageText) {
      const emailSubject = `💬 [Mirror: ${channelSource}] New message from ${senderName}`;
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF7F2; color: #1F1D1B; margin: 0; padding: 20px; }
    .card { max-width: 580px; margin: 0 auto; background: #FFFDF9; border: 1px solid #E8E0D5; border-radius: 16px; padding: 24px; }
    .tag { display: inline-block; background: #1F1D1B; color: #FAF7F2; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
    .msg-box { background: #FAF7F2; border-left: 4px solid #C84B31; padding: 14px 18px; margin: 16px 0; border-radius: 0 12px 12px 0; font-size: 15px; color: #1F1D1B; line-height: 1.6; }
    .btn { display: inline-block; background: #25D366; color: white !important; text-decoration: none; padding: 12px 20px; border-radius: 25px; font-size: 13px; font-weight: bold; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag">Omnichannel Mirror • ${channelSource}</span>
    <h2 style="font-family: 'Georgia', serif; margin: 12px 0 4px 0; font-size: 20px;">New Inbound Customer Message</h2>
    <p style="font-size: 12px; color: #8C7D72; margin: 0 0 16px 0;">Received on ${timestamp}</p>

    <div style="font-size: 13px; color: #5C4F46;">
      <strong>Sender:</strong> ${senderName} (${senderId})<br>
      <strong>Channel:</strong> ${channelSource}<br>
      <strong>Type:</strong> ${messageType}
    </div>

    <div class="msg-box">
      ${messageText.replace(/\n/g, "<br>")}
      ${mediaUrl ? `<br><br><a href="${mediaUrl}" target="_blank" style="color:#C84B31; font-weight:bold;">🖼️ View Attached Media Link ↗</a>` : ""}
    </div>

    <div style="text-align: center; margin-top: 18px;">
      ${
        channelSource.includes("WhatsApp")
          ? `<a href="https://wa.me/${senderId.replace(/[^0-9]/g, "")}" class="btn" target="_blank">💬 Open WhatsApp Chat with Customer</a>`
          : `<a href="${initialSiteSettings.instagram_url}" class="btn" style="background:#1F1D1B;" target="_blank">📸 Open Instagram DMs</a>`
      }
    </div>
  </div>
</body>
</html>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "ArtByThread.7 Studio <onboarding@resend.dev>",
          to: [adminEmail],
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      console.log(`[MIRRORED TO ADMIN INBOX] Message from ${senderName} forwarded to ${adminEmail}`);
    }

    return NextResponse.json({
      status: "SUCCESS",
      mirrored: true,
      sender: senderName,
      channel: channelSource,
    });
  } catch (error) {
    console.error("[META WEBHOOK ERROR]", error);
    return NextResponse.json({ status: "ERROR", message: "Failed to process webhook" }, { status: 500 });
  }
}
