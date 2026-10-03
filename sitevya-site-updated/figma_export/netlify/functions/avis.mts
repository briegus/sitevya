// ═══════════════════════════════════════════════════════════════════════════
// netlify/functions/avis.ts
//
// GET  → renvoie les avis APPROUVÉS (visibles publiquement sur le site).
// POST → enregistre un nouvel avis en attente de modération (le PDG le
//        valide depuis le dashboard avant qu'il apparaisse publiquement).
// Persisté dans Neon — plus jamais coincé dans le localStorage d'un visiteur.
// ═══════════════════════════════════════════════════════════════════════════
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

interface AvisBody {
  name: string;
  rating: number;
  comment: string;
  projectType?: string;
}

export default async (req: Request): Promise<Response> => {
  if (req.method === "GET") {
    try {
      const rows = await sql`
        SELECT id, name, rating, comment, project_type, status, created_at
        FROM avis
        WHERE status = 'approuve'
        ORDER BY created_at DESC
        LIMIT 50
      `;
      return new Response(JSON.stringify({ avis: rows }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("[AVIS:GET] Erreur :", err);
      return new Response(JSON.stringify({ error: "Erreur serveur." }), { status: 500 });
    }
  }

  if (req.method === "POST") {
    let body: AvisBody;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corps de requête invalide." }), { status: 400 });
    }

    const { name, rating, comment, projectType } = body;

    if (typeof name !== "string" || typeof comment !== "string" || (projectType != null && typeof projectType !== "string")) {
      return new Response(JSON.stringify({ error: "Format de données invalide." }), { status: 400 });
    }
    if (name.length > 100 || comment.length > 2000 || (projectType?.length ?? 0) > 100) {
      return new Response(JSON.stringify({ error: "Un des champs est trop long." }), { status: 400 });
    }
    if (!name.trim() || !comment.trim() || !rating) {
      return new Response(JSON.stringify({ error: "Champs obligatoires manquants." }), { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ error: "Note invalide (1 à 5)." }), { status: 400 });
    }

    try {
      const [row] = await sql`
        INSERT INTO avis (name, rating, comment, project_type, status, created_at)
        VALUES (${name}, ${rating}, ${comment}, ${projectType || null}, 'en_attente', now())
        RETURNING id
      `;
      return new Response(JSON.stringify({ ok: true, id: row.id, note: "Avis envoyé — en attente de validation par l'équipe." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("[AVIS:POST] Erreur :", err);
      return new Response(JSON.stringify({ error: "Erreur serveur." }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ error: "Méthode non autorisée." }), { status: 405 });
};
