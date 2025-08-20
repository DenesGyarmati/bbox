import RegisterForm, { Role } from "./RegisterForm";
import { apiGet } from "@/lib/api/axios";
import { AuthEP } from "@/lib/api/ep";

export default async function RegisterPage() {
  const { data } = await apiGet(AuthEP.ROLES);

  return <RegisterForm roles={data} />;
}
