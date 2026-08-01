import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  if (await getSession()) redirect("/admin/articles");
  return <main className="loginPage"><div className="loginBox"><Link className="brand" href="/">NET<span>WISE</span></Link><small>KHU VỰC QUẢN TRỊ</small><h1>Chào mừng trở lại.</h1><p>Đăng nhập để quản lý kho kiến thức.</p><LoginForm /><Link className="backHome" href="/">← Về trang chủ</Link></div></main>;
}
