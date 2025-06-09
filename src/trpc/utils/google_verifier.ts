export type GoogleTokenVerificationResult = {
  name: string;
  email: string;
  picture: string;
} | false;

export async function GoogleTokenVerifier(accessToken: string): Promise<GoogleTokenVerificationResult> {
  try {
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!userInfoResponse.ok) {
      return false;
    }

    const userInfo = await userInfoResponse.json();
    const { name, email, picture } = userInfo;
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof picture !== 'string'
    ) {
      return false;
    }
    if (
      name.trim().length === 0 ||
      email.trim().length === 0 ||
      picture.trim().length === 0) {
      return false;
    }

    return { name, email, picture };
  } catch (e: any) {
    return false;
  }
}
