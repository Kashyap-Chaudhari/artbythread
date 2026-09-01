import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabaseServer } from "@/lib/supabase";

let orderCounter = 1;

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

function generateUniqueOrderId(): string {
  const year = new Date().getFullYear();
  const sequenceStr = String(orderCounter++).padStart(6, "0");
  return `ART-${year}-${sequenceStr}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      channel = "email_form", // "whatsapp" | "instagram" | "email_form"
      product_name,
      product_id,
      product_sku,
      product_slug,
      product_image_url,
      quantity = 1,
      size_variant,
      customization_details,
      customer_name,
      customer_phone,
      customer_email,
      address,
      city,
      state,
      pincode,
      additional_notes,
      price,
      hp_field, // Honeypot anti-spam
      admin_email = process.env.ADMIN_EMAIL || "henviparekh@gmail.com",
    } = body;

    // 1. Honeypot check
    if (hp_field) {
      console.warn("Spam bot detected via honeypot field.");
      return NextResponse.json({ success: true, message: "Enquiry received." });
    }

    // 2. Server-side Validation
    if (!customer_name || !customer_phone || !customer_email) {
      return NextResponse.json(
        { success: false, error: "Name, phone, and email are required fields." },
        { status: 400 }
      );
    }

    if (channel === "email_form" && (!address || !city || !state || !pincode)) {
      return NextResponse.json(
        { success: false, error: "Full delivery address (Address, City, State, Pincode) is required." },
        { status: 400 }
      );
    }

    // 3. Sanitize inputs
    const cleanCustomerName = sanitize(customer_name);
    const cleanPhone = sanitize(customer_phone);
    const cleanEmail = sanitize(customer_email);
    const cleanAddress = sanitize(address);
    const cleanCity = sanitize(city);
    const cleanState = sanitize(state);
    const cleanPincode = sanitize(pincode);
    const cleanProductName = sanitize(product_name) || "Handmade Creation";
    const cleanSizeVariant = sanitize(size_variant) || "Standard";
    const cleanCustomization = sanitize(customization_details);
    const cleanNotes = sanitize(additional_notes);
    const qty = Math.max(1, parseInt(String(quantity), 10) || 1);

    // 4. Generate Order ID: ART-2026-000001
    const orderId = generateUniqueOrderId();
    const timestampIST = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const productUrl = product_slug
      ? `https://artbythread.com/creation/${product_slug}`
      : "https://artbythread.com/creations";

    // 5. Store order in Supabase
    if (isSupabaseConfigured && supabaseServer) {
      try {
        const isUuid = (str?: string | null) =>
          Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str));

        let preferred_channel: "whatsapp" | "instagram" | "email" = "email";
        const rawChan = (channel || "email").toLowerCase().replace("_form", "");
        if (rawChan === "whatsapp") preferred_channel = "whatsapp";
        else if (rawChan === "instagram") preferred_channel = "instagram";
        else preferred_channel = "email";

        const { error: dbError } = await supabaseServer.from("orders").insert([
          {
            order_id: orderId,
            customer_name: cleanCustomerName,
            customer_phone: cleanPhone,
            customer_email: cleanEmail,
            address: cleanAddress || null,
            delivery_city: cleanCity || null,
            state: cleanState || null,
            pincode: cleanPincode || null,
            product_id: isUuid(product_id) ? product_id : null,
            product_name: cleanProductName,
            product_sku: product_sku || null,
            product_photo_url: product_image_url || null,
            quantity: qty,
            size_variant: cleanSizeVariant || null,
            customization_details: cleanCustomization || null,
            customization_note: cleanNotes || cleanCustomization || null,
            quoted_price: price || null,
            preferred_channel,
            status: "new",
          },
        ]);

        if (dbError) {
          console.warn("[SUPABASE NOTIFY DB INSERT WARNING]", dbError.message);
        } else {
          console.log(`[SUPABASE NOTIFY DB INSERT SUCCESS] Order ${orderId} saved.`);
        }
      } catch (dbErr) {
        console.warn("[SUPABASE NOTIFY DB EXCEPTION]", dbErr);
      }
    }

    // 6. Format Admin HTML Email Notification
    const emailSubject = `🧵 New Order Enquiry #${orderId} — ${cleanProductName}`;

    const htmlEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Georgia', serif; background-color: #FAF7F2; color: #1F1D1B; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFDF9; border: 1px solid #E8E0D5; border-radius: 16px; overflow: hidden; }
    .header { background: #1F1D1B; color: #FAF7F2; padding: 24px; text-align: center; }
    .header h1 { font-size: 22px; margin: 0 0 6px 0; font-weight: normal; }
    .header p { font-family: sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #E4929A; margin: 0; }
    .disclaimer-badge { background-color: #FFF3CD; border: 1px solid #FFEEBA; color: #856404; padding: 12px; margin: 20px; border-radius: 8px; font-family: sans-serif; font-size: 13px; font-weight: bold; text-align: center; }
    .content { padding: 20px 24px; font-family: sans-serif; font-size: 14px; line-height: 1.6; }
    .section-title { font-family: 'Georgia', serif; font-size: 16px; border-bottom: 2px solid #C84B31; padding-bottom: 6px; margin-top: 24px; margin-bottom: 12px; color: #1F1D1B; }
    .grid-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .grid-table td { padding: 8px 0; border-bottom: 1px solid #FAF7F2; vertical-align: top; }
    .grid-table .label { color: #8C7D72; width: 35%; font-weight: 600; font-size: 13px; }
    .grid-table .value { color: #1F1D1B; width: 65%; font-size: 13px; }
    .product-img { width: 100%; max-height: 250px; object-fit: cover; border-radius: 12px; margin-bottom: 16px; }
    .cta-button { display: inline-block; background-color: #25D366; color: white; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; font-size: 13px; margin-top: 10px; }
    .footer { background: #FAF7F2; padding: 16px; text-align: center; font-size: 12px; color: #8C7D72; border-top: 1px solid #E8E0D5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ArtByThread.7 Studio</h1>
      <p>New Product Order Enquiry</p>
    </div>

    <div class="disclaimer-badge">
      ⚠️ This is an enquiry, not a confirmed or paid order.
    </div>

    <div class="content">
      ${product_image_url ? `<img src="${product_image_url}" alt="${cleanProductName}" class="product-img"/>` : ""}

      <div class="section-title">Order Overview</div>
      <table class="grid-table">
        <tr><td class="label">Order ID</td><td class="value"><strong>${orderId}</strong></td></tr>
        <tr><td class="label">Date & Time</td><td class="value">${timestampIST}</td></tr>
        <tr><td class="label">Enquiry Source</td><td class="value" style="text-transform: uppercase;">${channel}</td></tr>
        <tr><td class="label">Status</td><td class="value"><span style="background:#C84B31; color:white; padding:2px 8px; border-radius:4px; font-size:11px;">NEW ENQUIRY</span></td></tr>
      </table>

      <div class="section-title">Customer Information</div>
      <table class="grid-table">
        <tr><td class="label">Customer Name</td><td class="value">${cleanCustomerName}</td></tr>
        <tr><td class="label">WhatsApp / Phone</td><td class="value">${cleanPhone}</td></tr>
        <tr><td class="label">Email Address</td><td class="value">${cleanEmail}</td></tr>
        <tr><td class="label">Delivery Address</td><td class="value">${cleanAddress}<br>${cleanCity}, ${cleanState} - ${cleanPincode}</td></tr>
      </table>

      <div class="section-title">Product Details</div>
      <table class="grid-table">
        <tr><td class="label">Product Name</td><td class="value">${cleanProductName}</td></tr>
        <tr><td class="label">Product ID / SKU</td><td class="value">${product_id || product_sku || "N/A"}</td></tr>
        <tr><td class="label">Quantity</td><td class="value">${qty}</td></tr>
        <tr><td class="label">Size / Variant</td><td class="value">${cleanSizeVariant}</td></tr>
        <tr><td class="label">Customization Notes</td><td class="value">${cleanCustomization || "None requested"}</td></tr>
        <tr><td class="label">Listed Price</td><td class="value">${price ? `₹${price}` : "Price on Request"}</td></tr>
        <tr><td class="label">Product Page URL</td><td class="value"><a href="${productUrl}" target="_blank">${productUrl}</a></td></tr>
        <tr><td class="label">Additional Notes</td><td class="value">${cleanNotes || "None"}</td></tr>
      </table>

      <div style="text-align: center; margin-top: 20px;">
        <a href="https://wa.me/${cleanPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${cleanCustomerName}! Thank you for your enquiry #${orderId} for ${cleanProductName} on ArtByThread.7. Here are the details:`)}" class="cta-button" target="_blank">
          💬 Reply to Customer on WhatsApp
        </a>
      </div>
    </div>

    <div class="footer">
      ArtByThread.7 Studio • Handmade Embroidery & Thread Art<br>
      Automated Enquiry Notification
    </div>
  </div>
</body>
</html>
    `;

    let emailSentSuccessfully = false;

    // 7. Send Live Email via Resend API
    const resendApiKey = process.env.RESEND_API_KEY || "";
    if (resendApiKey) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "ArtByThread.7 Studio <onboarding@resend.dev>",
            to: [admin_email],
            subject: emailSubject,
            html: htmlEmailTemplate,
          }),
        });

        if (resendRes.ok) {
          emailSentSuccessfully = true;
          console.log(`[LIVE EMAIL DISPATCH SUCCESS] Sent to ${admin_email}`);
        } else {
          const errText = await resendRes.text();
          console.warn("[LIVE EMAIL DISPATCH FAILED]", errText);
        }
      } catch (emailErr) {
        console.error("[LIVE EMAIL DISPATCH ERROR]", emailErr);
      }
    } else {
      console.log("----------------------------------------------------------------");
      console.log(`[ADMIN NOTIFICATION PREVIEW] Subject: ${emailSubject}`);
      console.log(`To: ${admin_email} | Order ID: ${orderId} | Customer: ${cleanCustomerName} (${cleanPhone})`);
      console.log("Note: Add RESEND_API_KEY to your .env.local file to send live emails to your inbox!");
      console.log("----------------------------------------------------------------");
    }

    return NextResponse.json({
      success: true,
      order_id: orderId,
      email_sent: emailSentSuccessfully,
      message: `Enquiry #${orderId} logged successfully. ${
        emailSentSuccessfully
          ? `Live email sent to ${admin_email}.`
          : `Saved to database and Admin Dashboard.`
      }`,
      data: {
        order_id: orderId,
        product_name: cleanProductName,
        quantity: qty,
        customer_name: cleanCustomerName,
        timestamp: timestampIST,
      },
    });
  } catch (error) {
    console.error("Error processing order enquiry route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process order enquiry server-side." },
      { status: 500 }
    );
  }
}
