import { siteUrl } from "@/lib/site";

function redirectUri(path: string) {
  return `${siteUrl}${path}`;
}

type OAuthProfile = {
  provider: "kakao" | "google";
  oauthId: string;
  email: string;
  name: string;
};

export async function profileFromKakaoCode(code: string): Promise<OAuthProfile | "error"> {
  const clientId = process.env.KAKAO_REST_API_KEY;
  if (!clientId) return "error";
  const redirect = redirectUri("/api/auth/kakao/callback");
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: redirect,
    code,
  });
  const secret = process.env.KAKAO_CLIENT_SECRET;
  if (secret) params.set("client_secret", secret);

  const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  if (!tokenRes.ok) return "error";
  const token = (await tokenRes.json()) as { access_token?: string };
  if (!token.access_token) return "error";

  const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!userRes.ok) return "error";
  const user = (await userRes.json()) as {
    id: number;
    kakao_account?: { email?: string; profile?: { nickname?: string } };
  };
  const oauthId = String(user.id);
  const email = user.kakao_account?.email ?? `${oauthId}@kakao.oauth`;
  const name = user.kakao_account?.profile?.nickname ?? "카카오 회원";
  return { provider: "kakao", oauthId, email, name };
}

export async function profileFromGoogleCode(code: string): Promise<OAuthProfile | "error"> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return "error";
  const redirect = redirectUri("/api/auth/google/callback");
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirect,
    code,
  });
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  if (!tokenRes.ok) return "error";
  const token = (await tokenRes.json()) as { access_token?: string };
  if (!token.access_token) return "error";

  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!userRes.ok) return "error";
  const user = (await userRes.json()) as {
    sub: string;
    email?: string;
    name?: string;
  };
  const oauthId = user.sub;
  const email = user.email ?? `${oauthId}@google.oauth`;
  const name = user.name ?? "Google 회원";
  return { provider: "google", oauthId, email, name };
}
