"use client";

import React from "react";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import AdminHeader from "@/src/components/admin/AdminHeader";
import UserManagement from "@/src/components/admin/UserManagement";
import NotesManagement from "@/src/components/admin/NotesManagement";
import { useAuth } from "@/src/components/auth/AuthProvider";
import AuthGuard from "@/src/components/auth/AuthGuard";
import { createDashboardUser } from "@/src/lib/user-utils";

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
      console.log("=== ADMIN PAGE: FETCHING USERS FROM BACKEND ===");
      console.log("Making request to: http://localhost:8080/admin/users");

      const response = await fetch("http://localhost:8080/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add auth token here if needed
        },
      });

      console.log(
        "Admin users response status:",
        response.status,
        response.statusText
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Admin users data received:", data);
        console.log("Admin users array:", data.users);
        console.log("Admin users count:", data.users?.length || 0);
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

  // Console logs for admin data
  console.log("=== ADMIN PAGE: BACKEND DATA ===");
  console.log("Admin users:", users);
  console.log("Admin users count:", users.length);
  console.log("Admin loading:", loading);
  console.log("Admin lastSync:", lastSync);
  console.log("Admin systemMetrics:", systemMetrics);
  console.log("=== END ADMIN PAGE DATA ===");

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
