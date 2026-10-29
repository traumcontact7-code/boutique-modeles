// Lancé par GitHub Actions quand Roblox envoie un nouveau code.
// Ajoute le code (sous forme chiffrée) dans data/codes.json.
import { createHash, randomBytes, createCipheriv, pbkdf2Sync } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const code = (process.env.CODE || "").trim().toUpperCase();
const model = process.env.MODEL || "";
if (!/^[A-Z0-9]+(-[A-Z0-9]{4}){4}$/.test(code)) throw new Error("Format de code invalide");
if (!/^[a-z0-9-]+$/.test(model)) throw new Error("Modèle invalide");

const keys = JSON.parse(process.env.MODEL_KEYS || "{}");
if (!keys[model]) throw new Error(`Pas de clé pour le modèle ${model}`);
const modelKey = Buffer.from(keys[model], "base64");

const salt = randomBytes(16);
const iv = randomBytes(12);
const wrapKey = pbkdf2Sync(code, salt, 100000, 32, "sha256");
const cipher = createCipheriv("aes-256-gcm", wrapKey, iv);
const ct = Buffer.concat([cipher.update(modelKey), cipher.final(), cipher.getAuthTag()]);

const id = createHash("sha256").update(code).digest("hex");
const path = "data/codes.json";
const codes = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
if (codes[id]) {
  console.log("Code déjà enregistré, rien à faire.");
  process.exit(0);
}
codes[id] = {
  model,
  salt: salt.toString("base64"),
  iv: iv.toString("base64"),
  ct: ct.toString("base64"),
};
writeFileSync(path, JSON.stringify(codes, null, 1) + "\n");
console.log("Code ajouté.");
