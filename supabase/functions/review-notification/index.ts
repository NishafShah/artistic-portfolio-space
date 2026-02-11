import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const bodyText = await req.text();

    let reviewerName = "";
    let reviewerEmail = "";
    let rating = 0;
    let reviewText = "";

    try {
      const body = JSON.parse(bodyText);
      reviewerName = String(body.reviewerName || "").slice(0, 100);
      reviewerEmail = String(body.reviewerEmail || "").slice(0, 255);
      rating = Math.min(5, Math.max(1, parseInt(body.rating) || 0));
      reviewText = String(body.reviewText || "").slice(0, 1000);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!reviewerName.trim() || !reviewText.trim()) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(apiKey);

    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

    const result = await resend.emails.send({
      from: "Portfolio Reviews <onboarding@resend.dev>",
      to: "shahmurrawat@gmail.com",
      subject: `New Review Submitted: ${stars} from ${escapeHtml(reviewerName)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
            🌟 New Review Submitted
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Rating:</strong> <span style="color: #f59e0b; font-size: 20px;">${stars}</span> (${rating}/5)</p>
            <p style="margin: 0 0 10px 0;"><strong>Reviewer:</strong> ${escapeHtml(reviewerName)}</p>
            <p style="margin: 0;"><strong>Email:</strong> ${escapeHtml(reviewerEmail)}</p>
          </div>
          <div style="background: #fff; border-left: 4px solid #7c3aed; padding: 15px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Review:</h3>
            <p style="margin: 0; color: #555; line-height: 1.6;">${escapeHtml(reviewText)}</p>
          </div>
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #92400e;">
              ⚠️ <strong>Action Required:</strong> This review needs approval before it will be displayed on your portfolio.
            </p>
          </div>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            Submitted at: ${new Date().toISOString()}
          </p>
        </div>
      `,
    });

    console.log("Review notification sent");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Email send error:", err);
    return new Response(JSON.stringify({ success: false, error: "Email failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
