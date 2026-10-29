// Chiffre un modèle 3D pour pouvoir le publier sans risque dans le dépôt.
// Usage : node scripts/encrypt-model.mjs fichier.glb mon-slug "Titre affiché"
import { randomBytes, createCipheriv } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { basename } from "node:path";

const [input, slug, title] = process.argv.slice(2);
if (!input || !slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage : node scripts/encrypt-model.mjs fichier.glb mon-slug "Titre"  (slug = a-z, 0-9, tirets)');
  process.exit(1);
}

const key = randomBytes(32);
const iv = randomBytes(12);
const cipher = createCipheriv("aes-256-gcm", key, iv);
const enc = Buffer.concat([cipher.update(readFileSync(input)), cipher.final(), cipher.getAuthTag()]);
writeFileSync(`models/${slug}.glb.enc`, Buffer.concat([iv, enc]));

const modelsPath = "models.json";
const models = existsSync(modelsPath) ? JSON.parse(readFileSync(modelsPath, "utf8")) : {};
models[slug] = {
  title: title || slug,
  file: `models/${slug}.glb.enc`,
  downloadName: basename(input),
};
writeFileSync(modelsPath, JSON.stringify(models, null, 2) + "\n");

console.log(JSON.stringify({ [slug]: key.toString("base64") }));
