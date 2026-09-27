// ═══════════════════════════════════════════════════════════════════════════
// netlify/functions/dashboard-data.ts
//
// Donne au dashboard staff un accès aux VRAIES données (demandes + avis)
// stockées dans Neon — plus jamais coincées dans le localStorage.
//
// Protection : vérifie un en-tête Authorization contre TEAM_API_PASSWORD,
// une variable d'environnement SERVEUR (jamais préfixée VITE_, donc jamais
// visible dans le code JS envoyé au navigateur — contrairement au mot de
// passe de connexion actuel qui n'est qu'un filtre visuel côté client).
//
//   GET    /dashboard-data?resource=demandes        → toutes les demandes
//   GET    /dashboard-data?resource=avis             → tous les avis (tous statuts)
//   PATCH  /dashboard-data?resource=demandes&id=xxx  → { status }
//   PATCH  /dashboard-data?resource=avis&id=xxx      → { status: "approuve"|"refuse" }
//   DELETE /dashboard-data?resource=demandes&id=xxx
//   DELETE /dashboard-data?resource=avis&id=xxx
// ═══════════════════════════════════════════════════════════════════════════
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const TEAM_API_PASSWORD = process.env.TEAM_API_PASSWORD;

function checkAuth(req: Request): boolean {
  if (!TEAM_API_PASSWORD) return false; // pas configuré côté serveur → accès refusé par défaut
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;
  return token === TEAM_API_PASSWORD;
}

export default async (req: Request): Promise<Response> => {
  if (!checkAuth(req)) {
    return new Response(JSON.stringify({ error: "Non autorisé." }), { status: 401 });
  }

  const url = new URL(req.url);
  const resource = url.searchParams.get("resource");
  const id = url.searchParams.get("id");

  if (resource !== "demandes" && resource !== "avis") {
    return new Response(JSON.stringify({ error: "Paramètre 'resource' invalide (demandes|avis)." }), { status: 400 });
  }

  try {
    if (req.method === "GET") {
      const rows = resource === "demandes"
        ? await sql`SELECT * FROM demandes ORDER BY created_at DESC LIMIT 200`
        : await sql`SELECT * FROM avis ORDER BY created_at DESC LIMIT 200`;
      return json({ [resource]: rows });
    }

    if (req.method === "PATCH") {
      if (!id) return json({ error: "Paramètre 'id' manquant." }, 400);
      const body = await req.json().catch(() => ({}));
      const status = body.status as string | undefined;
      if (!status) return json({ error: "Champ 'status' manquant." }, 400);

      if (resource === "demandes") {
        await sql`UPDATE demandes SET status = ${status} WHERE id = ${id}`;
      } else {
        await sql`UPDATE avis SET status = ${status} WHERE id = ${id}`;
      }
      return json({ ok: true });
    }

    if (req.method === "DELETE") {
      if (!id) return json({ error: "Paramètre 'id' manquant." }, 400);
      if (resource === "demandes") {
        await sql`DELETE FROM demandes WHERE id = ${id}`;
      } else {
        await sql`DELETE FROM avis WHERE id = ${id}`;
      }
      return json({ ok: true });
    }

    return json({ error: "Méthode non autorisée." }, 405);
  } catch (err) {
    console.error("[DASHBOARD-DATA] Erreur :", err);
    return json({ error: "Erreur serveur." }, 500);
  }
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
