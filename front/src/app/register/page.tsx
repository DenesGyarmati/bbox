import RegisterForm, { Role } from "./RegisterForm";
import axios from "@/lib/api/axios";
import { AuthEP } from "@/lib/api/ep";

export default async function RegisterPage() {
  const roles: Role[] = await axios.get(AuthEP.ROLES);

  return <RegisterForm roles={roles} />;
}
