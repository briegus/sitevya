// ═══════════════════════════════════════════════════════════════════════════
// netlify/functions/contact.ts
//
// Reçoit une demande du formulaire de contact (parcours e-mail), l'enregistre
// dans Neon/Postgres, puis envoie un vrai e-mail au PDG via Resend.
// Le parcours Discord (ticket) ne passe JAMAIS par ici — il reste géré
// entièrement par le bot Discord, indépendant de ce site.
// ═══════════════════════════════════════════════════════════════════════════
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

const sql = neon(process.env.DATABASE_URL!);
const resend = new Resend(process.env.RESEND_API_KEY);
const PDG_EMAIL = process.env.PDG_EMAIL || "sitevya@outlook.fr";

interface ContactBody {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  description: string;
  deadline?: string;
  extra?: string;
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée." }), { status: 405 });
  }

  let body: ContactBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Corps de requête invalide." }), { status: 400 });
  }

  const { name, email, company, projectType, description, deadline, extra } = body;

  if (!name?.trim() || !email?.trim() || !projectType?.trim() || !description?.trim()) {
    return new Response(JSON.stringify({ error: "Champs obligatoires manquants." }), { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Adresse e-mail invalide." }), { status: 400 });
  }

  try {
    // ── 1. Enregistrement en base (source de vérité, consultable depuis le dashboard) ──
    const [row] = await sql`
      INSERT INTO demandes (name, email, company, project_type, description, deadline, extra, channel, status, created_at)
      VALUES (${name}, ${email}, ${company || null}, ${projectType}, ${description}, ${deadline || null}, ${extra || null}, 'email', 'nouveau', now())
      RETURNING id, created_at
    `;

    // ── 2. E-mail réel au PDG via Resend ──────────────────────────────────────
    await resend.emails.send({
      from: "Sitévya <onboarding@resend.dev>", // à remplacer par un domaine vérifié une fois configuré sur Resend
      to: PDG_EMAIL,
      replyTo: email,
      subject: `🌐 Nouvelle demande — ${projectType} (${name})`,
      html: `
        <h2>Nouvelle demande reçue sur Sitévya</h2>
        <p><b>Nom :</b> ${escapeHtml(name)}</p>
        <p><b>E-mail :</b> ${escapeHtml(email)}</p>
        ${company ? `<p><b>Entreprise/projet :</b> ${escapeHtml(company)}</p>` : ""}
        <p><b>Type de projet :</b> ${escapeHtml(projectType)}</p>
        <p><b>Description :</b><br>${escapeHtml(description).replace(/\n/g, "<br>")}</p>
        ${deadline ? `<p><b>Délai souhaité :</b> ${escapeHtml(deadline)}</p>` : ""}
        ${extra ? `<p><b>Infos complémentaires :</b><br>${escapeHtml(extra).replace(/\n/g, "<br>")}</p>` : ""}
        <hr>
        <p style="color:#888; font-size:12px;">Demande #${row.id} — reçue le ${new Date(row.created_at).toLocaleString("fr-FR")}</p>
      `,
    });

    return new Response(JSON.stringify({ ok: true, id: row.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[CONTACT] Erreur :", err);
    return new Response(JSON.stringify({ error: "Erreur serveur — la demande n'a pas pu être enregistrée." }), { status: 500 });
  }
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
