"use client";

import React from "react";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import AdminHeader from "@/src/components/admin/AdminHeader";
import UserManagement from "@/src/components/admin/UserManagement";
import NotesManagement from "@/src/components/admin/NotesManagement";
import { useAuth } from "@/src/components/auth/AuthProvider";
import AuthGuard from "@/src/components/auth/AuthGuard";
import { createDashboardUser } from "@/src/lib/user-utils";
import { BACKEND_URL } from "@/src/config/urls";
import { devLog } from "@/src/lib/devLog";

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [lastSync, setLastSync] = React.useState<Date | null>(null);

  // Create user object for DashboardLayout with all required fields
  const dashboardUser = createDashboardUser(user);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    try {
      devLog("=== ADMIN PAGE: FETCHING USERS FROM BACKEND ===", `${BACKEND_URL}/admin/users`);

      const response = await fetch(`${BACKEND_URL}/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add auth token here if needed
        },
      });

      devLog("Admin users response status:", response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        devLog("Admin users data received:", data, "count:", data.users?.length || 0);
        setUsers(data.users || []);
        setLastSync(new Date());
      } else {
        console.error(
          "Admin users fetch failed:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Admin users fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  React.useEffect(() => {
    fetchUsers();
  }, []);

  // System metrics with real data
  const systemMetrics = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.emailVerified).length,
    lastSync: lastSync || undefined,
  };

  devLog("=== ADMIN PAGE: BACKEND DATA ===", { users, usersCount: users.length, loading, lastSync, systemMetrics });
  devLog("=== END ADMIN PAGE DATA ===");

  const handleRefresh = () => {
    fetchUsers();
  };

  return (
    <AuthGuard requireAuth={true}>
      {dashboardUser && (
        <DashboardLayout user={dashboardUser} currentPath="/admin">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between" data-testid="admin-header">
              <div>
                <h1 className="text-3xl font-bold tracking-tight" data-testid="admin-title">
                  Admin Panel
                </h1>
                <p className="text-muted-foreground">
                  System administration and user management
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground" data-testid="last-sync">
                  Last sync: {lastSync ? lastSync.toLocaleTimeString() : "—"}
                </div>
              </div>
            </div>

            {/* Admin Header */}
            <AdminHeader
              metrics={systemMetrics}
              onRefresh={handleRefresh}
              loading={loading}
            />

            {/* User Management */}
            <div data-testid="user-management">
              <UserManagement users={users} loading={loading} />
            </div>

            {/* Notes Management */}
            <div data-testid="system-metrics">
              <NotesManagement loading={loading} />
            </div>
          </div>
        </DashboardLayout>
      )}
    </AuthGuard>
  );
};

export default AdminPage;
