export function kakaoAuthUrl(origin: string) {
  const client = process.env.KAKAO_REST_API_KEY;
  if (!client) return null;
  const redirect = `${origin}/api/auth/kakao/callback`;
  return `https://kauth.kakao.com/oauth/authorize?client_id=${client}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code`;
}

export function googleAuthUrl(origin: string) {
  const client = process.env.GOOGLE_CLIENT_ID;
  if (!client) return null;
  const redirect = `${origin}/api/auth/google/callback`;
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=openid%20email%20profile`;
}
