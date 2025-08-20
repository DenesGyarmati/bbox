import Link from "next/link";
import "./globals.css";
import { ReactNode } from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import LogoutButton from "@/components/LogoutButton";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userName = cookieStore.get("user_name")?.value;
  const roleCookie = cookieStore.get("role_id");
  const roleId = roleCookie ? parseInt(roleCookie.value) : null;

  let isLoggedIn = false;

  if (token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded) {
        isLoggedIn = true;
      }
    } catch (err) {
      console.error("JWT error:", err);
      isLoggedIn = false;
    }
  }

  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <header className="bg-white shadow-md">
          <div className="container mx-auto flex justify-between items-center p-4">
            <Link href="/" className="text-xl font-bold">
              Home
            </Link>
            {roleId === 1 && (
              <>
                <Link href="/admin/events" className="text-xl font-bold">
                  Events
                </Link>
                <Link href="/admin/users" className="text-xl font-bold">
                  Users
                </Link>
              </>
            )}
            {roleId === 2 && (
              <>
                <Link href="/events/my" className="text-xl font-bold">
                  My Events
                </Link>
                <Link href="/event/create" className="text-xl font-bold">
                  Create Event
                </Link>
              </>
            )}
            {roleId === 2 && (
              <Link href="/reservations" className="text-xl font-bold">
                Reservations
              </Link>
            )}
            <nav>
              {isLoggedIn ? (
                <>
                  <span>{userName}</span>
                  <LogoutButton />
                </>
              ) : (
                <div className="space-x-4">
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
