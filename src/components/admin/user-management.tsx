"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inviteUser, deleteUser } from "@/app/(protected)/admin/users/actions";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string | null;
  email_confirmed_at?: string | null;
}

export function UserManagement({ users }: { users: User[] }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.set("email", email);

    const result = await inviteUser(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(`Invitation sent to ${email}`);
      setEmail("");
      router.refresh();
    }

    setLoading(false);
  }

  async function handleDelete(userId: string, userEmail: string) {
    if (!confirm(`Remove ${userEmail} from the system? They will lose access.`)) {
      return;
    }

    setDeletingId(userId);
    setError(null);

    const result = await deleteUser(userId);

    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }

    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      {/* Invite Form */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-navy mb-4">Invite New User</h2>
        <form onSubmit={handleInvite} className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" loading={loading}>
            Send Invite
          </Button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
        {success && (
          <p className="mt-3 text-sm text-green-600">{success}</p>
        )}
      </div>

      {/* Users List */}
      <div className="rounded-lg border border-border bg-white">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">
            Current Users ({users.length})
          </h2>
        </div>

        {users.length === 0 ? (
          <div className="px-6 py-8 text-center text-medium-gray text-sm">
            No users found.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-navy">
                    {user.email || "No email"}
                  </p>
                  <div className="flex gap-4 mt-1">
                    <p className="text-xs text-medium-gray">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    {user.last_sign_in_at && (
                      <p className="text-xs text-medium-gray">
                        Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}
                      </p>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        user.email_confirmed_at
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.email_confirmed_at ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  loading={deletingId === user.id}
                  onClick={() => handleDelete(user.id, user.email || "this user")}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
