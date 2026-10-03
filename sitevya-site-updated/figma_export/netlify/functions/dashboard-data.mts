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
// netlify/functions/dashboard-data.ts
//
// Donne au dashboard staff un accès aux VRAIES données (demandes, avis,
// réalisations, posts) stockées dans Neon — plus jamais coincées dans le
// localStorage, et donc jamais perdues lors d'un redéploiement ou d'un
// changement d'appareil/navigateur.
//
// Protection : vérifie un en-tête Authorization contre TEAM_API_PASSWORD,
// une variable d'environnement SERVEUR (jamais préfixée VITE_, donc jamais
// visible dans le code JS envoyé au navigateur — contrairement au mot de
// passe de connexion actuel qui n'est qu'un filtre visuel côté client).
//
//   GET    /dashboard-data?resource=demandes|avis|realisations|posts
//   POST   /dashboard-data?resource=realisations|posts        → { ...champs }
//   PATCH  /dashboard-data?resource=...&id=xxx                → { ...champs à modifier }
//   DELETE /dashboard-data?resource=...&id=xxx
// ═══════════════════════════════════════════════════════════════════════════
import { neon } from "@neondatabase/serverless";

// Connexion créée à la première requête : une base mal configurée ne fait pas planter toute la
// fonction, ce qui permet au login de distinguer "mauvais mot de passe" de "serveur non configuré".
let _sql: ReturnType<typeof neon> | null = null;
const sql = ((strings: TemplateStringsArray, ...values: unknown[]) => {
  _sql ??= neon(process.env.DATABASE_URL!);
  return _sql(strings, ...values);
}) as ReturnType<typeof neon>;
const TEAM_API_PASSWORD = process.env.TEAM_API_PASSWORD;

type Resource = "demandes" | "avis" | "realisations" | "posts";
const RESOURCES: Resource[] = ["demandes", "avis", "realisations", "posts"];

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
  // Vérification du mot de passe seule (sans toucher à la base) — utilisée par la page de login.
  if (url.searchParams.get("resource") === "ping") return json({ ok: true });

  const resource = url.searchParams.get("resource") as Resource | null;
  const id = url.searchParams.get("id");

  if (!resource || !RESOURCES.includes(resource)) {
    return new Response(JSON.stringify({ error: "Paramètre 'resource' invalide (demandes|avis|realisations|posts)." }), { status: 400 });
  }

  try {
    if (req.method === "GET") {
      const rows =
        resource === "demandes" ? await sql`SELECT * FROM demandes ORDER BY created_at DESC LIMIT 200` :
        resource === "avis" ? await sql`SELECT * FROM avis ORDER BY created_at DESC LIMIT 200` :
        resource === "realisations" ? await sql`SELECT * FROM realisations ORDER BY created_at DESC LIMIT 200` :
        await sql`SELECT * FROM posts ORDER BY created_at DESC LIMIT 200`;
      return json({ [resource]: rows });
    }

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));

      if (resource === "realisations") {
        const { title, description, category, projectDate, link, published, tags } = body;
        if (!title?.trim() || !category?.trim()) return json({ error: "Titre et catégorie requis." }, 400);
        const [row] = await sql`
          INSERT INTO realisations (title, description, category, project_date, link, published, tags, created_at)
          VALUES (${title}, ${description || null}, ${category}, ${projectDate || null}, ${link || null}, ${!!published}, ${tags || []}, now())
          RETURNING *
        `;
        return json({ ok: true, row });
      }

      if (resource === "posts") {
        const { title, content, published } = body;
        if (!title?.trim() || !content?.trim()) return json({ error: "Titre et contenu requis." }, 400);
        const [row] = await sql`
          INSERT INTO posts (title, content, published, created_at)
          VALUES (${title}, ${content}, ${!!published}, now())
          RETURNING *
        `;
        return json({ ok: true, row });
      }

      return json({ error: "Création non supportée pour cette ressource." }, 400);
    }

    if (req.method === "PATCH") {
      if (!id) return json({ error: "Paramètre 'id' manquant." }, 400);
      const body = await req.json().catch(() => ({}));

      if (resource === "demandes") {
        if (!body.status) return json({ error: "Champ 'status' manquant." }, 400);
        await sql`UPDATE demandes SET status = ${body.status} WHERE id = ${id}`;
      } else if (resource === "avis") {
        if (!body.status) return json({ error: "Champ 'status' manquant." }, 400);
        await sql`UPDATE avis SET status = ${body.status} WHERE id = ${id}`;
      } else if (resource === "realisations") {
        const [current] = await sql`SELECT * FROM realisations WHERE id = ${id}`;
        if (!current) return json({ error: "Réalisation introuvable." }, 404);
        const merged = {
          title: body.title ?? current.title,
          description: body.description !== undefined ? body.description : current.description,
          category: body.category ?? current.category,
          project_date: body.projectDate !== undefined ? body.projectDate : current.project_date,
          link: body.link !== undefined ? body.link : current.link,
          published: body.published !== undefined ? body.published : current.published,
          tags: body.tags ?? current.tags,
        };
        await sql`
          UPDATE realisations SET
            title = ${merged.title}, description = ${merged.description}, category = ${merged.category},
            project_date = ${merged.project_date}, link = ${merged.link}, published = ${merged.published}, tags = ${merged.tags}
          WHERE id = ${id}
        `;
      } else if (resource === "posts") {
        const [current] = await sql`SELECT * FROM posts WHERE id = ${id}`;
        if (!current) return json({ error: "Post introuvable." }, 404);
        const merged = {
          title: body.title ?? current.title,
          content: body.content ?? current.content,
          published: body.published !== undefined ? body.published : current.published,
        };
        await sql`UPDATE posts SET title = ${merged.title}, content = ${merged.content}, published = ${merged.published} WHERE id = ${id}`;
      }
      return json({ ok: true });
    }

    if (req.method === "DELETE") {
      if (!id) return json({ error: "Paramètre 'id' manquant." }, 400);
      if (resource === "demandes") await sql`DELETE FROM demandes WHERE id = ${id}`;
      else if (resource === "avis") await sql`DELETE FROM avis WHERE id = ${id}`;
      else if (resource === "realisations") await sql`DELETE FROM realisations WHERE id = ${id}`;
      else await sql`DELETE FROM posts WHERE id = ${id}`;
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
