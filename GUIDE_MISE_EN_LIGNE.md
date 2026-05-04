# Mettre Splittr en ligne — guide pas à pas

> Pour Sam qui ne code pas. Lis tout, fais dans l'ordre, ça prend 30 minutes.

À la fin de ce guide, tu auras une vraie URL du genre `splittr.vercel.app` que tu pourras partager à n'importe qui.

---

## Ce dont tu as besoin

- Une connexion internet
- Un email
- Le dossier `splittr/` que je viens de te créer (zippé, à télécharger plus bas)

C'est tout. Pas besoin d'installer quoi que ce soit sur ton ordinateur.

---

## Étape 1 — Créer un compte GitHub (5 min, gratuit)

GitHub c'est l'endroit où on stocke le code. Vercel se branche dessus pour mettre ton site en ligne automatiquement.

1. Va sur https://github.com
2. Clique **"Sign up"** en haut à droite
3. Email → mot de passe → username (choisis quelque chose de simple, genre `samdupont` — c'est public)
4. Vérifie ton email
5. Quand il te demande "What do you want to do" → choisis "I am a hobbyist" (gratuit)
6. Tu arrives sur ton dashboard GitHub. Voilà, c'est fait.

---

## Étape 2 — Créer un dépôt (repository) pour ton code (3 min)

Un "dépôt" (ou "repo"), c'est juste un dossier en ligne pour ton code.

1. Sur ton dashboard GitHub, clique sur le bouton **"+"** en haut à droite → **"New repository"**
2. **Repository name** : tape `splittr`
3. **Description** : "Achat groupé sécurisé entre particuliers"
4. Coche **"Public"** (ou Private si tu préfères, ça marche aussi)
5. **Coche "Add a README file"**
6. Clique **"Create repository"**

Tu arrives sur la page de ton repo, qui pour l'instant ne contient qu'un fichier README.

---

## Étape 3 — Uploader ton code (5 min)

1. Télécharge le fichier `splittr.zip` que je t'ai préparé
2. **Décompresse-le** sur ton ordinateur (clic droit → Extraire)
3. Sur ta page GitHub `splittr`, clique sur **"Add file"** → **"Upload files"**
4. **Glisse-dépose tout le contenu du dossier décompressé** dans la zone (pas le dossier lui-même, son contenu : `app/`, `package.json`, etc.)
5. ⚠️ Important : assure-toi de glisser TOUS les fichiers, y compris ceux qui commencent par un point (`.gitignore`, `next-env.d.ts`)
6. Attends que les fichiers se chargent (barre de progression en bas)
7. Tout en bas, dans **"Commit changes"**, mets : "Initial commit"
8. Clique **"Commit changes"** (le bouton vert)

Voilà, ton code est sur GitHub. Tu peux le voir dans la liste des fichiers.

---

## Étape 4 — Créer un compte Vercel (3 min, gratuit)

1. Va sur https://vercel.com
2. Clique **"Sign Up"**
3. Choisis **"Continue with GitHub"** (le plus simple)
4. Autorise Vercel à voir tes repos GitHub
5. Tu arrives sur ton dashboard Vercel, vide pour l'instant.

---

## Étape 5 — Déployer ton site (5 min)

C'est là que la magie opère.

1. Sur ton dashboard Vercel, clique **"Add New..."** → **"Project"**
2. Vercel te liste tes repos GitHub. Trouve **`splittr`** et clique **"Import"**
3. Une page de configuration apparaît. **Tu ne touches RIEN**, Vercel détecte tout seul que c'est du Next.js
4. Clique **"Deploy"**
5. Attends 1-2 minutes que ça compile (tu vois des logs défiler)
6. 🎉 Ça s'affiche : "Congratulations!" avec une URL du genre `splittr-xxxxx.vercel.app`
7. Clique sur l'URL → ton site est EN LIGNE

---

## Tu y es. Quoi maintenant ?

**Teste ton site** : ouvre l'URL sur ton tel, ton ordi, montre-le à un pote. C'est en ligne 24/7.

**Partage la démo** : copie le lien et envoie-le à 10 personnes. L'URL `/app` te mène directement à la démo cliquable (genre `splittr-xxxxx.vercel.app/app`).

**Mettre à jour le site** : à chaque fois que tu modifieras un fichier sur GitHub, Vercel re-déploiera automatiquement en 1 minute. T'as pas à toucher à Vercel.

---

## Optionnel : ton vrai nom de domaine (10 min, ~12€/an)

Si tu veux `splittr.fr` au lieu de `splittr-xxxxx.vercel.app` :

1. Va sur **OVH** (https://www.ovh.com/fr/) ou **Gandi** (https://www.gandi.net)
2. Cherche `splittr.fr` — s'il est dispo, achète-le (12-15€/an)
3. Sur Vercel, ouvre ton projet → onglet **"Domains"**
4. Tape `splittr.fr` → "Add"
5. Vercel te donne 2 lignes (des "DNS records") à copier-coller dans OVH/Gandi
6. Connecte-toi à OVH/Gandi → "Configurer le domaine" → colle les valeurs
7. Attends 1-24h que ça se propage
8. Voilà, ton site est sur `splittr.fr`

---

## Si ça plante quelque part

Pas de panique. Les erreurs les plus fréquentes :

- **"Build failed" sur Vercel** → t'as oublié des fichiers en uploadant. Vérifie sur GitHub que tu as bien `package.json`, `tsconfig.json`, `next.config.js`, et le dossier `app/`. S'il en manque, ré-upload.
- **Le site s'affiche mais pas de style** → t'as oublié `globals.css`. Vérifie qu'il est dans `app/globals.css` sur GitHub.
- **Page blanche sur `/app`** → vérifie que `app/app/page.tsx` est bien présent (oui, le dossier "app" dans le dossier "app", c'est normal).

Si tu coinces, dis-moi exactement ce que tu vois et je débugue.

---

## Récap visuel des étapes

1. ✅ Compte GitHub
2. ✅ Repo `splittr`
3. ✅ Upload des fichiers
4. ✅ Compte Vercel
5. ✅ Import du repo
6. ✅ Deploy
7. 🎉 Site en ligne

Allez, fonce.
