# Boutique de modèles 3D — site de téléchargement

Le site est une simple page (GitHub Pages). Le modèle est **chiffré** dans le dépôt : sans code valide, le fichier est illisible.

## Mise en ligne (une seule fois)

1. Crée un dépôt **public** sur GitHub (par exemple `boutique-modeles`) et envoie-y tout le contenu de ce dossier.
2. Dépôt → **Settings → Pages** : Source = « Deploy from a branch », branche `main`, dossier `/ (root)`. Ton adresse sera `https://TON-PSEUDO.github.io/boutique-modeles/`.
3. Dépôt → **Settings → Secrets and variables → Actions → New repository secret** : nom `MODEL_KEYS`, valeur = le contenu du fichier `PRIVE-MODEL_KEYS.json` (fourni à part, à ne JAMAIS publier).
4. Crée un jeton : GitHub → Settings → Developer settings → **Fine-grained personal access tokens** → Generate. Choisis uniquement ce dépôt, permission **Contents : Read and write**. Copie-le.
5. Dans Roblox Studio, ouvre `ReplicatedStorage.ShopConfig` et remplis `GithubRepo` (`TON-PSEUDO/boutique-modeles`), `GithubToken` (le jeton) et `SiteUrl` (l’adresse du site).

Le jeton ne doit rester que dans ce script serveur : ne le mets jamais dans un LocalScript.

## Ajouter un autre modèle

1. `node scripts/encrypt-model.mjs mon-modele.glb mon-slug "Titre"`
2. La commande affiche une clé, par exemple `{"mon-slug":"..."}` : ajoute-la dans le secret `MODEL_KEYS` (même objet JSON).
3. Envoie `models.json` et `models/mon-slug.glb.enc` sur GitHub.
4. Crée le Game Pass dans Roblox et ajoute un bloc dans `ShopConfig.Products` avec `Slug = "mon-slug"`.

## Comment ça marche

Achat dans Roblox → le serveur génère un code → il prévient GitHub → une Action enregistre le code (chiffré) dans `data/codes.json` → le site le reconnaît et déchiffre le modèle dans le navigateur du joueur. Compte environ une minute entre l’achat et le moment où le code fonctionne sur le site.
