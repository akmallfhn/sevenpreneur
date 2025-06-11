// --- Defining type result
export type GoogleOAuthVerificationResult =
  | {
      name: string;
      email: string;
      picture: string;
    }
  | false;

export async function GoogleOAuthVerifier(
  accessToken: string
): Promise<GoogleOAuthVerificationResult> {
  // --- Request verification to Google
  try {
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user info");
    }
    const userInfo = await userInfoResponse.json();

    // --- Return user info
    const { name, email, picture } = userInfo;

    // --- Validate data
    if (
      typeof name !== "string" ||
      name.trim() === "" ||
      typeof email !== "string" ||
      email.trim() === "" ||
      typeof picture !== "string" ||
      picture.trim() === ""
    ) {
      return false;
    }

    // Return data if valid
    return { name, email, picture };
  } catch (error: any) {
    console.error("GoogleOAuthVerifier error:", error);
    return false;
  }
}
