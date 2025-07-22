export const sendContactEmail = async ({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) => {
  try {
    const response = await fetch(
      "https://plzmnpbzqbmdbbxdpgwi.supabase.co/functions/v1/contact-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsem1ucGJ6cWJtZGJieGRwZ3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMTA0NjIsImV4cCI6MjA2ODU4NjQ2Mn0._UeV30YVj68ivtbQubAhU3fZVf9MgzfRZvSh31btZcw`, // 👈 Replace this below
        },
        body: JSON.stringify({ name, email, message }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Email send failed:", data);
      throw new Error(data?.error || "Email failed");
    }

    console.log("✅ Email send response:", data);
    return data;
  } catch (err: any) {
    console.error("🔥 Exception caught in sendContactEmail:", err);
    throw new Error(err?.message || "Unknown email error");
  }
};
