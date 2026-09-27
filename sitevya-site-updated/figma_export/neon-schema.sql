-- ═══════════════════════════════════════════════════════════════════════════
-- Schéma Neon/Postgres pour Sitévya
--
-- À exécuter UNE FOIS dans la console SQL de Neon (neon.tech → ton projet →
-- SQL Editor → colle tout ce fichier → Run), avant le premier déploiement.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS demandes (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  company      TEXT,
  project_type TEXT NOT NULL,
  description  TEXT NOT NULL,
  deadline     TEXT,
  extra        TEXT,
  channel      TEXT NOT NULL DEFAULT 'email',   -- toujours 'email' ici (le parcours Discord ne passe pas par cette table)
  status       TEXT NOT NULL DEFAULT 'nouveau', -- nouveau | en_cours | traite | refuse
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS avis (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT NOT NULL,
  project_type TEXT,
  status       TEXT NOT NULL DEFAULT 'en_attente', -- en_attente | approuve | refuse
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demandes_status ON demandes(status);
CREATE INDEX IF NOT EXISTS idx_avis_status ON avis(status);
