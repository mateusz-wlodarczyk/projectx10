"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Shield, Mail, Calendar } from "lucide-react";
import { UserManagementProps, User } from "../../types/admin";

const UserManagement: React.FC<UserManagementProps> = ({ users, loading }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Transform backend users to match frontend User interface
  const transformUsers = (backendUsers: any[]): User[] => {
    return backendUsers.map((user) => ({
      id: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      username: user.email?.split("@")[0] || "", // Generate username from email
      status: user.emailVerified ? "active" : "pending",
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
      lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined,
      profile: {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        timezone: "UTC",
        language: "en",
        notifications: {
          email: true,
          push: false,
          sms: false,
        },
        preferences: {
          theme: "light",
          dateFormat: "MM/DD/YYYY",
        },
      },
    }));
  };

  const transformedUsers = transformUsers(users);
  const displayedUsers = transformedUsers.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Management
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
