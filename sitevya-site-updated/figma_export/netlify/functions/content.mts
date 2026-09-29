// ═══════════════════════════════════════════════════════════════════════════
// netlify/functions/content.ts
//
// GET public (sans authentification) des contenus déjà publiés par l'équipe :
// réalisations du portfolio. Persisté dans Neon — visible par tous les
// visiteurs, sur n'importe quel appareil, même après un redéploiement.
//
//   GET /content?resource=realisations  → réalisations publiées uniquement
// ═══════════════════════════════════════════════════════════════════════════
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export default async (req: Request): Promise<Response> => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée." }), { status: 405 });
  }

  const url = new URL(req.url);
  const resource = url.searchParams.get("resource");

  if (resource !== "realisations") {
    return new Response(JSON.stringify({ error: "Paramètre 'resource' invalide." }), { status: 400 });
  }

  try {
    const rows = await sql`
      SELECT id, title, description, category, project_date, link, published, tags, created_at
      FROM realisations
      WHERE published = true
      ORDER BY created_at DESC
      LIMIT 100
    `;
    return new Response(JSON.stringify({ realisations: rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[CONTENT] Erreur :", err);
    return new Response(JSON.stringify({ error: "Erreur serveur." }), { status: 500 });
  }
};
