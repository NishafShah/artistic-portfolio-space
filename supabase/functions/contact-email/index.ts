import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { Resend } from "npm:resend";

// CORS headers for preflight & actual requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("OK", { status: 200, headers: corsHeaders });
  }

  try {
    console.log("⏳ Function triggered");

    // Safer parsing with fallback
    const bodyText = await req.text();
    console.log("📨 Raw body:", bodyText);

    let name = "";
    let email = "";
    let message = "";

    try {
      const body = JSON.parse(bodyText);
      name = body.name;
      email = body.email;
      message = body.message;
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("✅ Parsed input:", { name, email, message });

    const resend = new Resend("re_8rYXFsAf_3W1LBMr9HtWoJ34CQ6Vxa6Zg"); // Replace if needed

    const result = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "shahmurrawat@gmail.com",
      subject: `Contact Message From PortFolio from ${name}`,
      html: `
        <h2>Contact Message From PortFolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    console.log("✅ Email sent result:", result);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("🔥 Email send error:", err);
    return new Response(JSON.stringify({ success: false, error: "Email failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
