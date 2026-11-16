import { redirect } from "next/navigation";
import { LOGIN_PATH } from "@/lib/login-path";

export default function AdminLoginRedirect() {
  redirect(LOGIN_PATH);
}