// Create a JWT token signed using the private key
// Return a time-limited signed URL (valid for a few minutes)
import { NextResponse } from "next/server";
import crypto from "crypto";
import { encodeBase64Url } from "@/lib/encode";

interface VideoStreamProps {
  params: Promise<{ video_id: string }>;
}

export async function GET(req: Request, { params }: VideoStreamProps) {
  const videoId = (await params).video_id;

  if (!videoId || !/^[a-zA-Z0-9]{32}$/.test(videoId)) {
    return NextResponse.json({ status: 400, message: "Invalid video ID" });
  }

  const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
  const CLOUDFLARE_SIGNING_KEY = process.env.CLOUDFLARE_SIGNING_KEY!;
  const CLOUDFLARE_PRIVATE_KEY = process.env.CLOUDFLARE_PRIVATE_KEY!;

  const expiresInSecond = 14400;
  const exp = Math.floor(Date.now() / 1000) + expiresInSecond;

  // Create Payload JWT
  const payload = {
    sub: videoId,
    kid: CLOUDFLARE_SIGNING_KEY,
    exp,
  };

  // Create Header JWT
  const header = {
    alg: "RS256", // algoritma tanda tangan (RS256 = RSA + SHA-256)
    type: "JWT",
    kid: CLOUDFLARE_SIGNING_KEY,
  };

  // Create unsigned JWT
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
    status: 200,
    messages: "Success",
    signed_url: `https://customer-${CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/manifest/video.m3u8?token=${signedToken}`,
  });
}
