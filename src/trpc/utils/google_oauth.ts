import { OAuth2Client } from 'google-auth-library';

export type GoogleOAuthVerificationResult = {
  name: string,
  email: string,
  picture: string,
} | false;

export async function GoogleOAuthVerifier(credential: string): Promise<GoogleOAuthVerificationResult> {
  let user = {
    name: '',
    email: '',
    picture: '',
  };

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload() || user;
    user.name = payload.name || '';
    user.email = payload.email || '';
    user.picture = payload.picture || '';
  } catch (e: any) {
    return false;
  }

  if (
    user.name.trim().length === 0 ||
    user.email.trim().length === 0 ||
    user.picture.trim().length === 0
  ) {
    return false;
  }

  return user;
}
