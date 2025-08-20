import AdminAction from "@/components/AdminAction";
import { apiGet } from "@/lib/api/axios";
import { AdminEP } from "@/lib/api/ep";

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: Role | string;
  is_active: boolean;
}

export default async function UsersPage() {
  let users: User[] = [];
  let error = "";

  try {
    const { data } = await apiGet<User[]>(AdminEP.USERS);
    users = data ? data : [];
  } catch (err: any) {
    console.log(err);
    error =
      err.response?.data?.error ||
      err.message ||
      "Failed to fetch users from API";
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {users.length > 0 ? (
        <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  {typeof user.role === "string" ? user.role : user.role?.name}
                </td>
                <td className="p-3">
                  {user.is_active ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Blocked</span>
                  )}
                </td>
                <td className="p-3">
                  <AdminAction id={user.id} isActive={user.is_active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : !error ? (
        <p>Loading users...</p>
      ) : null}
    </div>
  );
}
