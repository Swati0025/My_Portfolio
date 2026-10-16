const recipient = "sharma.swati2673@gmail.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Please submit a valid message." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return Response.json({ error: "Please submit a valid message." }, { status: 400 });
  }

  const fields = payload as Record<string, unknown>;
  if (typeof fields.website === "string" && fields.website.trim()) {
    return Response.json({ sent: true });
  }

  const name = typeof fields.name === "string" ? fields.name.replace(/[\r\n\t]/g, " ").trim() : "";
  const email = typeof fields.email === "string" ? fields.email.trim() : "";
  const message = typeof fields.message === "string" ? fields.message.trim() : "";
  if (!name || name.length > 100 || !emailPattern.test(email) || email.length > 254 || !message || message.length > 5000) {
    return Response.json({ error: "Check your name, email address, and message, then try again." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Email delivery is not configured yet. Please try again later." }, { status: 503 });
  }

  const sender = process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `${message}\n\nFrom: ${name}\nEmail: ${email}`,
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      const providerError: unknown = await response.json().catch(() => null);
      const providerMessage = providerError && typeof providerError === "object" && "message" in providerError && typeof providerError.message === "string"
        ? providerError.message
        : "No provider message returned";
      console.error("Resend contact delivery failed:", response.status, providerMessage);
      return Response.json({ error: "Your message could not be delivered. Please try again later." }, { status: 502 });
    }
    const result: unknown = await response.json().catch(() => null);
    const messageId = result && typeof result === "object" && "id" in result && typeof result.id === "string" ? result.id : undefined;
    return Response.json({ sent: true, id: messageId });
  } catch {
    return Response.json({ error: "Your message could not be delivered. Please try again later." }, { status: 502 });
  }
}