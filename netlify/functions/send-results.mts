// Netlify Function: POST /api/send-results
// Body: { email: string, total: number, missed: string[] }  (missed = country codes)
// Sends "Flag quiz game: your score is X/Y" from GMAIL_USER via Gmail SMTP.
// Needs env vars GMAIL_USER and GMAIL_APP_PASSWORD (set in Netlify → Environment variables).
import nodemailer from "nodemailer";
import { COUNTRIES } from "../../src/countries.ts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export default async (req: Request) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return json(500, { error: "Email sending is not configured" });

  let data: { email?: unknown; total?: unknown; missed?: unknown };
  try {
    data = await req.json();
  } catch {
    return json(400, { error: "Invalid request" });
  }

  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (email.length > 254 || !EMAIL_RE.test(email)) return json(400, { error: "Please enter a valid email address" });

  // Only accept known country codes, so the email body can't carry arbitrary text.
  const total = data.total;
  const missedCodes = Array.isArray(data.missed) ? data.missed : null;
  if (
    !Number.isInteger(total) ||
    (total as number) < 1 ||
    (total as number) > COUNTRIES.length ||
    !missedCodes ||
    missedCodes.length > (total as number) ||
    new Set(missedCodes).size !== missedCodes.length ||
    !missedCodes.every((c) => typeof c === "string" && BY_CODE.has(c))
  ) {
    return json(400, { error: "Invalid results" });
  }

  const missed = missedCodes.map((c) => BY_CODE.get(c as string)!);
  const score = (total as number) - missed.length;
  const pct = Math.round((score / (total as number)) * 100);

  const lines = [
    `Your score: ${score}/${total} (${pct}% correct)`,
    "",
    missed.length
      ? ["Capitals to practise:", ...missed.map((c) => `  • ${c.name} — ${c.capital}`)].join("\n")
      : "No mistakes. Flawless!",
    "",
    process.env.URL ? `Play again: ${process.env.URL}` : "",
  ];

  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  try {
    await transporter.sendMail({
      from: { name: "Flag Quiz", address: user },
      to: email,
      subject: `Flag quiz game: your score is ${score}/${total}`,
      text: lines.join("\n").trim() + "\n",
    });
  } catch (err) {
    console.error("sendMail failed", err);
    return json(502, { error: "Could not send the email. Please try again later." });
  }

  return json(200, { ok: true });
};

export const config = { path: "/api/send-results" };
