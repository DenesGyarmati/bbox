import Link from "next/link";
import "./globals.css";
import { ReactNode } from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import LogoutButton from "@/components/LogoutButton";
import { PopupProvider } from "@/context/PopupContext";

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
      <body className="bg-gray-100 min-h-screen text-gray-800">
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition"
              >
                Home
              </Link>
              <nav className="flex items-center gap-6 text-gray-700 font-medium">
                {roleId === 1 && (
                  <>
                    <Link
                      href="/admin/events"
                      className="hover:text-black transition"
                    >
                      Events
                    </Link>
                    <Link
                      href="/admin/users"
                      className="hover:text-black transition"
                    >
                      Users
                    </Link>
                  </>
                )}
                {roleId === 2 && (
                  <>
                    <Link
                      href="/event/my"
                      className="hover:text-black transition"
                    >
                      My Events
                    </Link>
                    <Link
                      href="/event/create"
                      className="hover:text-black transition"
                    >
                      Create Event
                    </Link>
                  </>
                )}
                {roleId && (
                  <Link
                    href="/reservations"
                    className="hover:text-black transition"
                  >
                    Reservations
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-600">
                    Welcome {userName}
                  </span>
                  <LogoutButton />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-700 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-900 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <PopupProvider>{children}</PopupProvider>
        </main>
      </body>
    </html>
  );
}
