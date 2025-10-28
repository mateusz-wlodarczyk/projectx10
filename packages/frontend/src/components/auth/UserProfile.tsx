"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Calendar, Edit, Save, X, LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";

interface UserProfileProps {
  onEdit?: () => void;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export default function UserProfile({
  onEdit,
  onSave,
  onCancel,
  isEditing = false,
}: UserProfileProps) {
  const { user, logout, isLoading } = useAuth();
  const [editData, setEditData] = React.useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  React.useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user]);

  const handleSave = () => {
    onSave?.(editData);
  };

  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    });
    onCancel?.();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No user data available</p>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback className="text-lg">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex items-center space-x-2">
                {user.emailVerified ? (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-600"
                  >
                    Unverified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Profile Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">{user.email}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Member Since</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-2">
              <Label>First Name</Label>
              {isEditing ? (
                <Input
                  value={editData.firstName}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {user.firstName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Last Name</Label>
              {isEditing ? (
                <Input
                  value={editData.lastName}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                />
              ) : (
                <p className="text-sm text-muted-foreground">{user.lastName}</p>
              )}
            </div>

            {user.lastLoginAt && (
              <div className="space-y-2">
                <Label>Last Login</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.lastLoginAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex items-center space-x-2 pt-4">
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Sign Out</h4>
              <p className="text-sm text-muted-foreground">
                Sign out of your account on this device
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
