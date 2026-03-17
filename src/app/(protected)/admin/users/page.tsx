import { listUsers } from "./actions";
import { UserManagement } from "@/components/admin/user-management";

export default async function UsersPage() {
  const { users, error } = await listUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">User Management</h1>
        <p className="text-sm text-medium-gray">
          Invite and manage users who can access the admin panel
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <UserManagement users={users} />
    </div>
  );
}
