"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
  Settings,
  Database,
  FileText,
  Search,
  MoreHorizontal,
  Lock,
  Unlock,
} from "lucide-react";
import {
  RoleManagementProps,
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../../types/admin";

const RoleManagement: React.FC<RoleManagementProps> = ({
  roles,
  permissions,
  onRoleCreate,
  onRoleUpdate,
  onRoleDelete,
  onPermissionUpdate,
  loading,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleForm, setRoleForm] = useState<CreateRoleRequest>({
    name: "",
    description: "",
    permissions: [],
  });

  // Mock data for development
  const mockRoles: Role[] = [
    {
      id: "1",
      name: "admin",
      description: "Full system access with all permissions",
      permissions: [
        {
          id: "1",
          name: "user_management",
          resource: "users",
          action: "all",
          description: "Manage users, roles, and permissions",
          category: "administration",
        },
        {
          id: "2",
          name: "system_settings",
          resource: "system",
          action: "all",
          description: "Configure system settings",
          category: "administration",
        },
      ],
      isSystem: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "manager",
      description: "Manage boats and bookings",
      permissions: [
        {
          id: "3",
          name: "boats_view",
          resource: "boats",
          action: "read",
          description: "View boats and their details",
          category: "boats",
        },
        {
          id: "4",
          name: "boats_manage",
          resource: "boats",
          action: "write",
          description: "Manage boat information",
          category: "boats",
        },
      ],
      isSystem: false,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-14"),
    },
    {
      id: "3",
      name: "user",
      description: "Basic user access",
      permissions: [
        {
          id: "3",
          name: "boats_view",
          resource: "boats",
          action: "read",
          description: "View boats and their details",
          category: "boats",
        },
      ],
      isSystem: false,
      createdAt: new Date("2024-01-03"),
      updatedAt: new Date("2024-01-13"),
    },
  ];

  const mockPermissions: Permission[] = [
    {
      id: "1",
      name: "user_management",
      resource: "users",
      action: "all",
      description: "Manage users, roles, and permissions",
      category: "administration",
    },
    {
      id: "2",
      name: "system_settings",
      resource: "system",
      action: "all",
      description: "Configure system settings",
      category: "administration",
    },
    {
      id: "3",
      name: "boats_view",
      resource: "boats",
      action: "read",
      description: "View boats and their details",
      category: "boats",
    },
    {
      id: "4",
      name: "boats_manage",
      resource: "boats",
      action: "write",
      description: "Manage boat information",
      category: "boats",
    },
    {
      id: "5",
      name: "sync_operations",
      resource: "sync",
      action: "execute",
      description: "Execute synchronization operations",
      category: "operations",
    },
    {
      id: "6",
      name: "admin_logs",
      resource: "logs",
      action: "read",
      description: "View system logs",
      category: "monitoring",
    },
  ];

  const displayedRoles = mockRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPermissionCategories = () => {
    return Array.from(new Set(mockPermissions.map((p) => p.category)));
  };

  const getPermissionsByCategory = (category: string) => {
    return mockPermissions.filter((p) => p.category === category);
  };

  const handleCreateRole = () => {
    onRoleCreate(roleForm);
    setIsCreateDialogOpen(false);
    setRoleForm({ name: "", description: "", permissions: [] });
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions.map((p) => p.id),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateRole = () => {
    if (selectedRole) {
      const updateData: UpdateRoleRequest = {
        id: selectedRole.id,
        ...roleForm,
      };
      onRoleUpdate(updateData);
      setIsEditDialogOpen(false);
      setSelectedRole(null);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      onRoleDelete(roleId);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    const currentPermissions = roleForm.permissions;
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter((id) => id !== permissionId)
      : [...currentPermissions, permissionId];

    setRoleForm({ ...roleForm, permissions: newPermissions });
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Management
          </CardTitle>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role Name</label>
                  <Input
                    value={roleForm.name}
                    onChange={(e) =>
                      setRoleForm({ ...roleForm, name: e.target.value })
                    }
                    placeholder="Enter role name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={roleForm.description}
                    onChange={(e) =>
                      setRoleForm({ ...roleForm, description: e.target.value })
                    }
                    placeholder="Enter role description"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium">Permissions</label>
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {getPermissionCategories().map((category) => (
                      <div key={category} className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 capitalize">
                          {category} Permissions
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {getPermissionsByCategory(category).map(
                            (permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`permission-${permission.id}`}
                                  checked={roleForm.permissions.includes(
                                    permission.id
                                  )}
                                  onCheckedChange={() =>
                                    handlePermissionToggle(permission.id)
                                  }
                                />
                                <label
                                  htmlFor={`permission-${permission.id}`}
                                  className="text-sm cursor-pointer flex-1"
                                >
                                  <div className="font-medium">
                                    {permission.name}
                                  </div>
                                  <div className="text-gray-500 text-xs">
                                    {permission.description}
                                  </div>
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateRole}>Create Role</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Roles Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Shield className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-sm text-gray-500">
                          {role.permissions.length} permissions
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{role.description}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge
                          key={permission.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {permission.name}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {role.isSystem ? (
                        <>
                          <Lock className="h-4 w-4 text-gray-400" />
                          <Badge variant="secondary">System</Badge>
                        </>
                      ) : (
                        <>
                          <Unlock className="h-4 w-4 text-gray-400" />
                          <Badge variant="outline">Custom</Badge>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                        disabled={role.isSystem}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        disabled={role.isSystem}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Role Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role Name</label>
                <Input
                  value={roleForm.name}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={roleForm.description}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium">Permissions</label>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {getPermissionCategories().map((category) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 capitalize">
                        {category} Permissions
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {getPermissionsByCategory(category).map(
                          (permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`edit-permission-${permission.id}`}
                                checked={roleForm.permissions.includes(
                                  permission.id
                                )}
                                onCheckedChange={() =>
                                  handlePermissionToggle(permission.id)
                                }
                              />
                              <label
                                htmlFor={`edit-permission-${permission.id}`}
                                className="text-sm cursor-pointer flex-1"
                              >
                                <div className="font-medium">
                                  {permission.name}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  {permission.description}
                                </div>
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateRole}>Update Role</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RoleManagement;
