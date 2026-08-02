import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminHeader } from "@/components/AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession(); if (!session) redirect("/admin/login");
  return <main className="adminPage"><AdminHeader />{children}</main>;
}
