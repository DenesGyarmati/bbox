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
            <nav>
              {isLoggedIn ? (
                <LogoutButton />
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
