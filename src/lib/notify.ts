const adminPhone = "01059298267";

export function adminContactPhone() {
  return adminPhone;
}

export async function sendMemberApprovedEmail(input: {
  email: string;
  phone: string;
  name: string;
  username: string;
  tier: string;
}) {
  const body = `안녕하세요 ${input.name}님. CAREBASE 회원 승인이 완료되었습니다.\n아이디: ${input.username}\n등급: ${input.tier}\n\n로그인: https://carebaseone.com/ko/member/login`;
  console.info("[CAREBASE email]", input.email, body.slice(0, 120));
  if (process.env.SMTP_URL) {
    // SMTP 연동 자리 — Render 환경변수 설정 후 구현 확장
  }
  if (input.phone) {
    await sendSmsSlot({
      phone: input.phone,
      message: `[CAREBASE] ${input.name}님, 회원 승인이 완료되었습니다.`,
    });
    await sendKakaoSlot({ phone: input.phone, template: "member-approved" });
  }
}

export async function sendSmsSlot(input: { phone: string; message: string }) {
  if (!process.env.SOLAPI_API_KEY) {
    console.info("[CAREBASE sms-slot]", adminPhone, input.phone, input.message.slice(0, 80));
    return;
  }
  // 솔라피 연동 자리
}

export async function sendKakaoSlot(input: { phone: string; template: string }) {
  if (!process.env.KAKAO_ALIMTALK_KEY) {
    console.info("[CAREBASE kakao-slot]", input.phone, input.template);
    return;
  }
}

export async function sendPhoneVerificationCode(input: { phone: string; code: string }) {
  await sendSmsSlot({
    phone: input.phone,
    message: `[CAREBASE] 인증번호 ${input.code}`,
  });
}
