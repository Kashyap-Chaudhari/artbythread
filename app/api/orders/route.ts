import { NextResponse } from "next/server";
import { OrderFormSchema } from "@/lib/validations/order";
import { isSupabaseConfigured, supabaseServer } from "@/lib/supabase";
import {
  generateOrderId,
  generateWhatsAppOrderEnquiryMessage,
  generateEmailOrderEnquiryMessage,
  generateWhatsAppUrl,
} from "@/lib/utils";
import { initialSiteSettings } from "@/lib/data";

function sanitize(str?: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .trim();
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // 1. Zod Server-side Validation
    const validationResult = OrderFormSchema.safeParse(json);
    if (!validationResult.success) {
      const errorDetails = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please review the highlighted fields.",
          details: errorDetails,
        },
        { status: 400 }
      );
    }

    const {
      customer_name,
      customer_phone,
      customer_email,
      preferred_channel,
      quantity,
      customization_note,
      delivery_city,
      product_id,
      product_name,
      product_photo_url,
      product_sku,
      product_price,
      size_variant,
      address,
      state,
      pincode,
      hp_field,
    } = validationResult.data;

    // 2. Honeypot Anti-Spam Check
    if (hp_field) {
      console.warn("[SPAM BOT DETECTED] Order submission blocked via honeypot.");
      return NextResponse.json({
        success: true,
        order_id: "AT7-0000",
        message: "Your enquiry has been received.",
      });
    }

    // 3. Clean and prepare values
    const cleanCustomerName = sanitize(customer_name);
    const cleanPhone = sanitize(customer_phone);
    const cleanEmail = sanitize(customer_email);
    const cleanCity = sanitize(delivery_city);
    const cleanCustomization = sanitize(customization_note);
    const cleanProductName = sanitize(product_name);
    const cleanVariant = sanitize(size_variant) || "Standard Size";
    const cleanAddress = sanitize(address);
    const cleanState = sanitize(state);
    const cleanPincode = sanitize(pincode);

    // 4. Generate Order ID: e.g. AT7-8492
    const orderId = generateOrderId();
    const nowIso = new Date().toISOString();

    const timestampIST = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });

    // Determine public origin for links and Open Graph previews
    const requestOrigin =
      request.headers.get("origin") ||
      request.headers.get("x-forwarded-host") ||
      "https://artbythread.com";
    const baseUrl = requestOrigin.startsWith("http")
      ? requestOrigin
      : `https://${requestOrigin}`;
    const trackingUrl = `${baseUrl}/order/${orderId}`;

    // Resolve public image URL for inline email embed
    let publicPhotoUrl = product_photo_url || "";
    if (publicPhotoUrl && publicPhotoUrl.startsWith("/")) {
      publicPhotoUrl = `${baseUrl}${publicPhotoUrl}`;
    }

    // 5. Check Supabase connection
    if (!isSupabaseConfigured || !supabaseServer) {
      console.error("[SUPABASE NOT CONFIGURED] Cannot save order enquiry.");
      return NextResponse.json(
        {
          success: false,
          error: "Database service is temporarily unavailable. Please reach out on WhatsApp directly.",
        },
        { status: 500 }
      );
    }

    const isUuid = (str?: string | null) =>
      Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str));

    let safeChannel: "whatsapp" | "instagram" | "email" = "whatsapp";
    const rawChan = (preferred_channel || "whatsapp").toLowerCase().replace("_form", "");
    if (rawChan === "instagram") safeChannel = "instagram";
    else if (rawChan === "email") safeChannel = "email";
    else safeChannel = "whatsapp";

    // 6. Insert row into Supabase `orders` table
    const { error: dbError } = await supabaseServer.from("orders").insert([
      {
        order_id: orderId,
        customer_name: cleanCustomerName,
        customer_phone: cleanPhone,
        customer_email: cleanEmail,
        preferred_channel: safeChannel,
        product_id: isUuid(product_id) ? product_id : null,
        product_name: cleanProductName,
        product_photo_url: publicPhotoUrl || null,
        product_sku: product_sku || null,
        quantity,
        size_variant: cleanVariant,
        customization_note: cleanCustomization || null,
        customization_details: cleanCustomization || null,
        delivery_city: cleanCity,
        address: cleanAddress || null,
        state: cleanState || null,
        pincode: cleanPincode || null,
        quoted_price: product_price || null,
        status: "new",
        admin_notified_at: nowIso,
        customer_confirmed_at: null,
      },
    ]);

    // Strict check: If Supabase insert fails, DO NOT proceed and return error
    if (dbError) {
      console.error("[SUPABASE DB INSERT ERROR]", dbError.message);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to save your order enquiry to the database: ${dbError.message}. Please try again or reach out on WhatsApp.`,
        },
        { status: 500 }
      );
    }

    console.log(`[SUPABASE DB INSERT SUCCESS] Order ${orderId} saved via ${safeChannel}.`);

    // 7. Create Admin Notification record in `notifications` table
    try {
      const channelLabel = safeChannel === "whatsapp" ? "WhatsApp" : safeChannel === "instagram" ? "Instagram" : "Email";
      const { error: notifError } = await supabaseServer.from("notifications").insert([
        {
          title: "New Handmade Order Enquiry",
          message: `${orderId} — ${cleanCustomerName} — ${cleanProductName} — ${channelLabel}`,
          type: "order_enquiry",
          reference_id: orderId,
          is_read: false,
        },
      ]);
      if (notifError) {
        console.warn("[NOTIFICATION INSERT WARNING]", notifError.message);
      }
    } catch (notifErr) {
      console.warn("[NOTIFICATION INSERT EXCEPTION]", notifErr);
    }

    // 6. Resend Transactional Email Dispatches
    const resendApiKey = process.env.RESEND_API_KEY || "";
    const adminEmailRecipient = process.env.ADMIN_EMAIL || initialSiteSettings.email_contact;

    let customerEmailSent = false;
    let adminEmailSent = false;

    // --- Customer Confirmation Email Template ---
    const customerEmailSubject = `🧵 Order Enquiry Received #${orderId} — ArtByThread.7 Studio`;
    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation #${orderId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; color: #1F1D1B; margin: 0; padding: 20px; }
    .container { max-width: 580px; margin: 0 auto; background: #FFFDF9; border: 1px solid #E8E0D5; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
    .header { background: #1F1D1B; color: #FAF7F2; padding: 28px 24px; text-align: center; }
    .header h1 { font-family: 'Georgia', serif; font-size: 24px; margin: 0 0 6px 0; font-weight: normal; }
    .header p { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #E4929A; margin: 0; }
    .badge { display: inline-block; background-color: #FFF3CD; border: 1px solid #FFEEBA; color: #856404; padding: 10px 16px; margin: 20px; border-radius: 12px; font-size: 12px; font-weight: 600; text-align: center; }
    .content { padding: 0 28px 28px 28px; font-size: 14px; line-height: 1.6; }
    .product-box { background: #FAF7F2; border: 1px solid #E8E0D5; border-radius: 16px; padding: 18px; margin-bottom: 20px; }
    .product-img { width: 100%; max-height: 260px; object-fit: cover; border-radius: 12px; margin-bottom: 14px; display: block; border: 1px solid #E8E0D5; }
    .title { font-family: 'Georgia', serif; font-size: 18px; margin: 0 0 8px 0; color: #1F1D1B; }
    .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .table td { padding: 6px 0; font-size: 13px; border-bottom: 1px dashed #E8E0D5; }
    .table .label { color: #8C7D72; width: 38%; font-weight: 500; }
    .table .val { color: #1F1D1B; width: 62%; font-weight: 600; }
    .btn { display: inline-block; background-color: #C84B31; color: #FAF7F2 !important; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-weight: 600; font-size: 13px; text-align: center; margin: 16px 0; }
    .footer { background: #FAF7F2; padding: 20px; text-align: center; font-size: 11px; color: #8C7D72; border-top: 1px solid #E8E0D5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ArtByThread.7</h1>
      <p>Handcrafted With Love • Slow Living</p>
    </div>

    <div class="badge">
      🌸 Thank you, ${cleanCustomerName}! We have received your order enquiry.
    </div>

    <div class="content">
      <p>Hi <strong>${cleanCustomerName}</strong>,</p>
      <p>Thank you so much for choosing ArtByThread.7! We craft every piece slowly by hand. We have logged your enquiry with <strong>Order ID: ${orderId}</strong>.</p>

      <div class="product-box">
        ${
          publicPhotoUrl
            ? `<img src="${publicPhotoUrl}" alt="${cleanProductName}" class="product-img" />`
            : ""
        }
        <div class="title">${cleanProductName}</div>
        <table class="table">
          <tr><td class="label">Order ID</td><td class="val">${orderId}</td></tr>
          <tr><td class="label">Quantity</td><td class="val">${quantity} item(s)</td></tr>
          <tr><td class="label">Size / Variant</td><td class="val">${cleanVariant}</td></tr>
          <tr><td class="label">Delivery City</td><td class="val">${cleanCity}</td></tr>
          ${
            cleanCustomization
              ? `<tr><td class="label">Customization</td><td class="val">${cleanCustomization}</td></tr>`
              : ""
          }
          <tr><td class="label">Preferred Channel</td><td class="val" style="text-transform: capitalize;">${preferred_channel}</td></tr>
          <tr><td class="label">Status</td><td class="val"><span style="color:#C84B31;">New Enquiry / In Review</span></td></tr>
        </table>
      </div>

      <div style="background: #E5EDE8; border: 1px solid #D1E0D6; border-radius: 12px; padding: 14px; margin: 16px 0; font-size: 12px; color: #2E4B37;">
        <strong>✨ What happens next?</strong><br>
        Our studio artisan will review availability, slot in the crafting timeline, and reach out to you directly on <strong>${preferred_channel === "whatsapp" ? "WhatsApp" : preferred_channel === "instagram" ? "Instagram" : "Email"}</strong> (${cleanPhone || cleanEmail}) to confirm customization and manual payment.
      </div>

      <div style="text-align: center;">
        <a href="${trackingUrl}" class="btn" target="_blank">
          🔍 Track Order Card & Live Status
        </a>
      </div>
    </div>

    <div class="footer">
      ArtByThread.7 Studio • Handmade Thread Art, Embroidery & Gifts<br>
      Shipping Across India • Questions? Reply to this email or WhatsApp +91 97731 94319
    </div>
  </div>
</body>
</html>
    `;

    // --- Admin Notification Email Template ---
    const adminEmailSubject = `🧵 [New Order #${orderId}] ${cleanProductName} (${cleanCustomerName} via ${preferred_channel.toUpperCase()})`;
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Admin Order Notification #${orderId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF7F2; color: #1F1D1B; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFDF9; border: 1px solid #E8E0D5; border-radius: 20px; overflow: hidden; }
    .header { background: #1F1D1B; color: #FAF7F2; padding: 24px; text-align: center; }
    .header h1 { font-family: 'Georgia', serif; font-size: 22px; margin: 0 0 4px 0; font-weight: normal; }
    .badge { background: #C84B31; color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; display: inline-block; margin-top: 6px; }
    .content { padding: 24px; font-size: 14px; line-height: 1.6; }
    .product-img { width: 100%; max-height: 280px; object-fit: cover; border-radius: 12px; margin-bottom: 16px; border: 1px solid #E8E0D5; display: block; }
    .section-title { font-family: 'Georgia', serif; font-size: 15px; font-weight: 600; border-bottom: 2px solid #C84B31; padding-bottom: 4px; margin-top: 20px; margin-bottom: 10px; color: #1F1D1B; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .table td { padding: 6px 0; font-size: 13px; border-bottom: 1px solid #FAF7F2; }
    .table .label { color: #8C7D72; width: 35%; font-weight: 600; }
    .table .val { color: #1F1D1B; width: 65%; }
    .wa-btn { display: inline-block; background-color: #25D366; color: white !important; text-decoration: none; padding: 12px 22px; border-radius: 30px; font-weight: bold; font-size: 13px; margin: 8px 4px; }
    .admin-btn { display: inline-block; background-color: #1F1D1B; color: white !important; text-decoration: none; padding: 12px 22px; border-radius: 30px; font-weight: bold; font-size: 13px; margin: 8px 4px; }
    .footer { background: #FAF7F2; padding: 16px; text-align: center; font-size: 11px; color: #8C7D72; border-top: 1px solid #E8E0D5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ArtByThread.7 Studio</h1>
      <div><span class="badge">New Omnichannel Order #${orderId}</span></div>
    </div>

    <div class="content">
      ${
        publicPhotoUrl
          ? `<img src="${publicPhotoUrl}" alt="${cleanProductName}" class="product-img"/>`
          : ""
      }

      <div class="section-title">Product & Order Overview</div>
      <table class="table">
        <tr><td class="label">Order ID</td><td class="val"><strong>${orderId}</strong></td></tr>
        <tr><td class="label">Product Name</td><td class="val">${cleanProductName}</td></tr>
        <tr><td class="label">Quantity</td><td class="val">${quantity}</td></tr>
        <tr><td class="label">Size / Variant</td><td class="val">${cleanVariant}</td></tr>
        <tr><td class="label">Quoted Price</td><td class="val">${product_price ? `₹${product_price}` : "Price on Request"}</td></tr>
        <tr><td class="label">Customization</td><td class="val" style="color:#C84B31;">${cleanCustomization || "None specified"}</td></tr>
        <tr><td class="label">Delivery City</td><td class="val">${cleanCity}</td></tr>
        <tr><td class="label">Channel Choice</td><td class="val"><strong>${preferred_channel.toUpperCase()}</strong></td></tr>
        <tr><td class="label">Date & Time</td><td class="val">${timestampIST}</td></tr>
      </table>

      <div class="section-title">Customer Contact Details</div>
      <table class="table">
        <tr><td class="label">Customer Name</td><td class="val">${cleanCustomerName}</td></tr>
        <tr><td class="label">Phone / WhatsApp</td><td class="val">${cleanPhone}</td></tr>
        <tr><td class="label">Email Address</td><td class="val">${cleanEmail}</td></tr>
        ${cleanAddress ? `<tr><td class="label">Address</td><td class="val">${cleanAddress}, ${cleanCity}, ${cleanState} - ${cleanPincode}</td></tr>` : ""}
      </table>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://wa.me/${cleanPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${cleanCustomerName}! 🌸 Thank you for ordering "${cleanProductName}" from ArtByThread.7 (Order #${orderId}). Here are the details:`)}" class="wa-btn" target="_blank">
          💬 Reply on WhatsApp
        </a>
        <a href="${trackingUrl}" class="admin-btn" target="_blank">
          🔍 Live Tracking Page
        </a>
      </div>
    </div>

    <div class="footer">
      ArtByThread.7 Studio Order Engine • Instant Inbox Mirroring<br>
      Saved to Supabase Database
    </div>
  </div>
</body>
</html>
    `;

    // 7. Dispatch emails using Resend if key exists
    if (resendApiKey) {
      const fromAddress = "ArtByThread.7 Studio <onboarding@resend.dev>";
      try {
        // Dispatch to admin (always delivers to verified Resend account owner email)
        const adminRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [adminEmailRecipient],
            subject: adminEmailSubject,
            html: adminEmailHtml,
          }),
        });

        if (adminRes.ok) {
          adminEmailSent = true;
          console.log(`[ADMIN NOTIFICATION EMAIL SENT] Successfully delivered to ${adminEmailRecipient}`);
        } else {
          const errText = await adminRes.text();
          console.warn("[ADMIN EMAIL RESEND FAILED]", errText);
        }

        // Dispatch to customer
        if (cleanEmail && cleanEmail !== adminEmailRecipient) {
          const customerRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: fromAddress,
              to: [cleanEmail],
              subject: customerEmailSubject,
              html: customerEmailHtml,
            }),
          });

          if (customerRes.ok) {
            customerEmailSent = true;
            console.log(`[CUSTOMER CONFIRMATION EMAIL SENT] Successfully sent to ${cleanEmail}`);
          } else {
            const errText = await customerRes.text();
            console.warn("[CUSTOMER EMAIL RESEND NOTICE - Sandbox restricted to verified email]", errText);
          }
        } else if (cleanEmail === adminEmailRecipient) {
          customerEmailSent = adminEmailSent;
        }
      } catch (emailErr) {
        console.error("[EMAIL DISPATCH EXCEPTION]", emailErr);
      }
    }

    // 8. Generate WhatsApp, Instagram & Email Information
    const whatsappMessage = generateWhatsAppOrderEnquiryMessage({
      orderId,
      productName: cleanProductName,
      productId: product_sku || product_id || "AT7-PIECE",
      quantity,
      customerName: cleanCustomerName,
      customerPhone: cleanPhone,
      customerEmail: cleanEmail,
      deliveryCity: cleanCity,
      customizationNote: cleanCustomization,
    });

    const whatsappUrl = generateWhatsAppUrl(
      initialSiteSettings.whatsapp_number,
      whatsappMessage
    );

    const emailData = generateEmailOrderEnquiryMessage({
      orderId,
      productName: cleanProductName,
      productId: product_sku || product_id || "AT7-PIECE",
      quantity,
      customerName: cleanCustomerName,
      customerPhone: cleanPhone,
      customerEmail: cleanEmail,
      deliveryCity: cleanCity,
      customizationNote: cleanCustomization,
    });

    const mailtoUrl = `mailto:${initialSiteSettings.email_contact || "kashyapchaudhari299@gmail.com"}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;

    // 9. Return structured success response
    return NextResponse.json({
      success: true,
      order_id: orderId,
      order: {
        id: orderId,
        order_id: orderId,
        customer_name: cleanCustomerName,
        customer_phone: cleanPhone,
        customer_email: cleanEmail,
        preferred_channel: safeChannel,
        product_name: cleanProductName,
        product_photo_url: publicPhotoUrl,
        quantity,
        size_variant: cleanVariant,
        customization_note: cleanCustomization,
        delivery_city: cleanCity,
        status: "new",
        created_at: nowIso,
        admin_notified_at: adminEmailSent ? nowIso : null,
      },
      tracking_url: trackingUrl,
      preferred_channel: safeChannel,
      whatsapp_url: whatsappUrl,
      whatsapp_message: whatsappMessage,
      instagram_url: initialSiteSettings.instagram_url || "https://instagram.com/artbythread.7",
      mailto_url: mailtoUrl,
      email_subject: emailData.subject,
      email_body: emailData.body,
      customer_email_sent: customerEmailSent,
      admin_email_sent: adminEmailSent,
      db_saved: true,
      message: `Enquiry #${orderId} logged successfully.`,
    });
  } catch (error) {
    console.error("[ORDER API ROUTE ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing your order.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || searchParams.get("id") || "";
    const cleanQuery = decodeURIComponent(query).trim();

    if (!cleanQuery) {
      return NextResponse.json(
        { success: false, error: "Please provide an Order ID or query." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured && supabaseServer) {
      try {
        const { data, error } = await supabaseServer
          .from("orders")
          .select("*")
          .or(`order_id.ilike.%${cleanQuery}%,customer_phone.ilike.%${cleanQuery}%,customer_email.ilike.%${cleanQuery}%`)
          .order("created_at", { ascending: false })
          .limit(10);

        if (data && data.length > 0 && !error) {
          return NextResponse.json({
            success: true,
            orders: data,
          });
        }
      } catch (e) {
        console.warn("[ORDERS SEARCH ERROR]", e);
      }
    }

    return NextResponse.json({
      success: true,
      orders: [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to look up orders." },
      { status: 500 }
    );
  }
}
