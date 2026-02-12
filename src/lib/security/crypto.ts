import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

// ============= CONFIG =============

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;

/**
 * Derive a 256-bit key from the master secret using scrypt.
 * Salt is stored alongside the ciphertext so each encryption
 * produces a unique key even with the same master secret.
 */
function deriveKey(secret: string, salt: Buffer): Buffer {
  return scryptSync(secret, salt, KEY_LENGTH);
}

function getMasterSecret(): string {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ENCRYPTION_SECRET env var must be set and at least 32 characters."
    );
  }
  return secret;
}

// ============= PUBLIC API =============

/**
 * Encrypt a plaintext string.
 * Output format: `salt:iv:authTag:ciphertext` (all hex-encoded).
 */
export function encrypt(plaintext: string): string {
  const secret = getMasterSecret();
  const salt = randomBytes(SALT_LENGTH);
  const key = deriveKey(secret, salt);
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return [
    salt.toString("hex"),
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted,
  ].join(":");
}

/**
 * Decrypt a string produced by `encrypt()`.
 */
export function decrypt(ciphertext: string): string {
  const secret = getMasterSecret();
  const [saltHex, ivHex, authTagHex, encryptedHex] = ciphertext.split(":");

  if (!saltHex || !ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid ciphertext format");
  }

  const salt = Buffer.from(saltHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const key = deriveKey(secret, salt);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Check whether a string looks like it was encrypted by us.
 */
export function isEncrypted(value: string): boolean {
  const parts = value.split(":");
  return (
    parts.length === 4 &&
    parts[0].length === SALT_LENGTH * 2 &&
    parts[1].length === IV_LENGTH * 2 &&
    parts[2].length === AUTH_TAG_LENGTH * 2
  );
}

/**
 * Mask a phone number for display: +593 ****1234
 */
export function maskPhone(phone: string): string {
  if (phone.length <= 4) return "****";
  return phone.slice(0, phone.length > 10 ? 4 : 0) + "****" + phone.slice(-4);
}

/**
 * Mask an email for display: d***@gmail.com
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***@***";
  return `${local[0]}${"*".repeat(Math.min(local.length - 1, 5))}@${domain}`;
}
