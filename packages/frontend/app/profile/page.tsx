"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import { useAuth } from "@/src/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileOverview } from "@/src/components/profile/ProfileOverview";
import { ProfileForm } from "@/src/components/profile/ProfileForm";
import { ProfileFormData } from "@/src/hooks/useProfileForm";
import { ProfileActions } from "@/src/components/profile/ProfileActions";
import { useProfileForm } from "@/src/hooks/useProfileForm";
import { createDashboardUser } from "@/src/lib/user-utils";
import { getMockUser } from "@/src/lib/mock-data";
import {
  PageLoadingState,
  PageErrorState,
} from "@/src/components/common/LoadingStates";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();
  const router = useRouter();

  const profileForm = useProfileForm({
    user,
    onSave: async (formData) => {
      await updateProfile(formData);
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout
        user={user || getMockUser("user")}
        currentPath="/profile"
      >
        <PageLoadingState message="Loading profile..." />
      </DashboardLayout>
    );
  }

  // Show error if no user
  if (!user) {
    return (
      <DashboardLayout user={getMockUser("user")} currentPath="/profile">
        <PageErrorState error="Unable to load profile data" />
      </DashboardLayout>
    );
  }

  const dashboardUser = createDashboardUser(user);

  return (
    <DashboardLayout user={dashboardUser} currentPath="/profile">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
          <ProfileActions
            isEditing={profileForm.isEditing}
            isSaving={profileForm.isSaving}
            isValid={profileForm.isValid}
            onEdit={profileForm.handleEdit}
            onCancel={profileForm.handleCancel}
            onSave={profileForm.handleSave}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileOverview user={user} />
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  formData={profileForm.formData}
                  isEditing={profileForm.isEditing}
                  onInputChange={(
                    field: keyof ProfileFormData,
                    value: string
                  ) => profileForm.handleInputChange(field, value)}
                />
                {profileForm.error && (
                  <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {profileForm.error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
