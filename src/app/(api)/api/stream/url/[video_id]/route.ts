// Create a JWT token signed using the private key
// Return a time-limited signed URL (valid for a few minutes)
import { NextResponse } from "next/server";
import crypto from "crypto";
import { encodeBase64Url } from "@/lib/jwt-encode";

interface VideoStreamProps {
  params: Promise<{ video_id: string }>;
}

export async function GET(req: Request, { params }: VideoStreamProps) {
  const { video_id } = await params;
  const videoId = parseInt(video_id);

  const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
  const CLOUDFLARE_SIGNING_KEY = process.env.CLOUDFLARE_SIGNING_KEY!;
  const CLOUDFLARE_PRIVATE_KEY = process.env.CLOUDFLARE_PRIVATE_KEY!;

  const expiresInSecond = 60 * 5;
  const exp = Math.floor(Date.now() / 1000) + expiresInSecond;

  // Create Payload JWT
  const payload = {
    kid: CLOUDFLARE_SIGNING_KEY,
    exp,
    videoId,
  };

  // Create Header JWT
  const header = {
    alg: "RS256", // algoritma tanda tangan (RS256 = RSA + SHA-256)
    type: "JWT",
    kid: CLOUDFLARE_SIGNING_KEY,
  };

  // Create Unsigned JWT
  const unsignedToken = `${encodeBase64Url(header)}.${encodeBase64Url(
    payload
  )}`;

  // Create signer with RSA-SHA256 method
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsignedToken);

  // Signing JWT with Private Key
  const signature = sign
    .sign(CLOUDFLARE_PRIVATE_KEY, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  // Generate Signed Token
  const signedToken = `${unsignedToken}.${signature}`;

  return NextResponse.json({
    signed_url: `https://customer-${CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/manifest/video.m3u8?token=${signedToken}`,
  });
}
