import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function getUserInfo() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return {
      username: decoded.username,
      id: decoded.sub,
      roleId: decoded.roleId,
    };
  } catch (err) {
    console.error("JWT verify error:", err);
    return null;
  }
}
