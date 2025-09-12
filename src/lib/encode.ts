import crypto from "crypto";

export function encodeBase64Url(obj: object): string {
  return Buffer.from(JSON.stringify(obj))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function encodeSHA256(value: string | null | undefined) {
  if (!value) return undefined;
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}
