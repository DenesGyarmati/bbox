import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getUserInfo from "@/lib/helpers/getUserInfo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const userInfo = await getUserInfo();
    if (!userInfo || userInfo.roleId < 1) {
      redirect("/403");
    }
  } catch (err) {
    redirect("/login");
  }

  return (
    <section>
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      {children}
    </section>
  );
}
