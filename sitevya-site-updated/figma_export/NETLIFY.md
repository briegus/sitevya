# Déployer Sitévya sur Netlify — données à remplir et compatibilité

## 1. Réglages de build (déjà lus depuis `netlify.toml`)
| Champ               | Valeur              |
|---------------------|---------------------|
| Base directory      | (vide)              |
| Build command       | `npm run build`     |
| Publish directory   | `dist`              |
| Functions directory | `netlify/functions` |
| Node                | 22                  |

Route SPA (déjà dans `netlify.toml` et `public/_redirects`) : `/*  /index.html  200`

## 2. Les 4 variables d'environnement à remplir
Netlify → Site configuration → Environment variables → Add a variable.

| Nom | Où la trouver | Format attendu |
|-----|---------------|----------------|
| `DATABASE_URL` | Neon → Dashboard → **Connect** → Connection string | `postgresql://utilisateur:motdepasse@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require` (copier telle quelle, avec `?sslmode=require`) |
| `RESEND_API_KEY` | Resend → API Keys → Create (permission « Sending access ») | commence par `re_` |
| `PDG_EMAIL` | l'adresse qui reçoit les demandes | **doit être l'adresse du compte Resend** tant qu'aucun domaine n'est vérifié (sinon erreur 403 côté Resend) |
| `TEAM_API_PASSWORD` | à inventer | 16 caractères ou plus, unique. C'est le mot de passe de connexion au dashboard. |

Cocher « All scopes ». Aucune variable ne doit commencer par `VITE_` (elle serait publique dans le code du site).
Après ajout ou modification d'une variable : **Deploys → Trigger deploy → Deploy site** (elles ne s'appliquent qu'au déploiement suivant).

## 3. Base de données
Neon → SQL Editor → coller tout `neon-schema.sql` → Run. À refaire uniquement si le schéma change.

## 4. Tester après déploiement
1. `https://TON-SITE.netlify.app/.netlify/functions/dashboard-data?resource=ping` → doit afficher `Non autorisé.` (la fonction existe).
2. Aller sur `/login` : bon mot de passe = accès ; « Serveur injoignable » = fonctions non déployées ou variables absentes.
3. Envoyer un test sur `/contact` → la demande apparaît dans le dashboard.
4. Créer une réalisation publiée, l'ouvrir sur `/realisations` depuis un autre appareil.

## 5. Limites des offres gratuites (vérifiées en septembre 2026)
- **Netlify Free** : 300 crédits/mois, plafond dur (le site se met en pause si dépassé). Un déploiement de production = 15 crédits (≈ 20 par mois maximum), bandwidth = 20 crédits/Go (≈ 15 Go). Les deploy previews / branches sont gratuits. Fonctions : timeout 10 s.
- **Neon Free** : 0,5 Go de stockage, 100 CU-heures/mois, mise en veille après 5 min d'inactivité (premier appel après une pause ≈ 0,5 s plus lent).
- **Resend Free** : 3 000 emails/mois, 100/jour, 1 domaine. Sans domaine vérifié : envoi uniquement vers l'adresse du compte Resend.
Les demandes sont enregistrées en base même si l'email échoue.

## 6. Compatibilité
- Navigateurs : Tailwind v4 exige Chrome 111+, Safari 16.4+ (iOS 16.4+), Firefox 128+. Sur un appareil plus ancien, la mise en page peut être cassée.
- Le fond vidéo est un flux HLS Mux externe : s'il disparaît, le fond reste noir mais le site fonctionne.
- Chaque nouvelle version = un déploiement de production = 15 crédits. Regrouper les modifications.
- Le dossier caché `.figma/` doit être dans le dépôt GitHub (le build en a besoin).
- En local, `npm run dev` n'a pas les fonctions : utiliser `npx netlify dev` pour tester le formulaire, les avis et le dashboard.
