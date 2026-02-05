import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("OK", { status: 200, headers: corsHeaders });
  }

  try {
    console.log("⏳ Review notification triggered");

    const bodyText = await req.text();
    console.log("📨 Raw body:", bodyText);

    let reviewerName = "";
    let reviewerEmail = "";
    let rating = 0;
    let reviewText = "";

    try {
      const body = JSON.parse(bodyText);
      reviewerName = body.reviewerName;
      reviewerEmail = body.reviewerEmail;
      rating = body.rating;
      reviewText = body.reviewText;
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("✅ Parsed input:", { reviewerName, reviewerEmail, rating });

    const resend = new Resend("re_8rYXFsAf_3W1LBMr9HtWoJ34CQ6Vxa6Zg");

    // Generate star rating display
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

    const result = await resend.emails.send({
      from: "Portfolio Reviews <onboarding@resend.dev>",
      to: "shahmurrawat@gmail.com",
      subject: `New Review Submitted: ${stars} from ${reviewerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
            🌟 New Review Submitted
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Rating:</strong> <span style="color: #f59e0b; font-size: 20px;">${stars}</span> (${rating}/5)</p>
            <p style="margin: 0 0 10px 0;"><strong>Reviewer:</strong> ${reviewerName}</p>
            <p style="margin: 0;"><strong>Email:</strong> ${reviewerEmail}</p>
          </div>
          
          <div style="background: #fff; border-left: 4px solid #7c3aed; padding: 15px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Review:</h3>
            <p style="margin: 0; color: #555; line-height: 1.6;">${reviewText}</p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #92400e;">
              ⚠️ <strong>Action Required:</strong> This review needs approval before it will be displayed on your portfolio.
            </p>
          </div>
          
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            Submitted at: ${new Date().toLocaleString()}
          </p>
        </div>
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
