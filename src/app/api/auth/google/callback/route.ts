import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { profileFromGoogleCode } from "@/lib/oauth-exchange";
import { findMemberByOAuth, isUsernameTaken, registerMember } from "@/lib/members";
import { setMemberSession } from "@/lib/member-session";
import { siteUrl } from "@/lib/site";

function redirect(path: string) {
  return NextResponse.redirect(new URL(path, siteUrl));
}

export async function GET(request: Request) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return redirect("/ko/member/signup?oauth=missing");
  }
  const code = new URL(request.url).searchParams.get("code");
  if (!code) {
    return redirect("/ko/member/login?oauth=error");
  }

  const profile = await profileFromGoogleCode(code);
  if (profile === "error") {
    return redirect("/ko/member/login?oauth=error");
  }

  const existing = await findMemberByOAuth("google", profile.oauthId);
  if (existing) {
    if (existing.status === "approved") {
      await setMemberSession(existing.username);
      return redirect("/ko/store");
    }
    return redirect("/ko/member/login?oauth=pending");
  }

  let username = `google_${profile.oauthId.slice(0, 12).replace(/\W/g, "")}`;
  if (username.length < 5) username = `google_${randomBytes(4).toString("hex")}`;
  if (await isUsernameTaken(username)) {
    username = `${username}_${randomBytes(2).toString("hex")}`;
  }

  const error = await registerMember({
    username,
    password: randomBytes(16).toString("hex"),
    name: profile.name,
    email: profile.email,
    phone: "",
    zipcode: "",
    address: "",
    addressDetail: "",
    note: "Google OAuth 가입",
    signupChannel: "google",
    oauthId: profile.oauthId,
  });
  if (error) {
    return redirect("/ko/member/signup?oauth=register-error");
  }
  return redirect("/ko/member/login?oauth=pending");
}
