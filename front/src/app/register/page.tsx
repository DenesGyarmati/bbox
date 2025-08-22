import RegisterForm from "./RegisterForm";
import { apiGet } from "@/lib/api/axios";
import { AuthEP } from "@/lib/api/ep";

export default async function RegisterPage() {
  const { data } = await apiGet(AuthEP.ROLES);

  return (
    <div className="flex justify-center items-center min-h-calc[100vh-200px]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Register
        </h1>
        <RegisterForm roles={data} />
      </div>
    </div>
  );
}
