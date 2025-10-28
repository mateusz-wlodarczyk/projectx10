"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  Settings,
  LogOut,
  Shield,
  RefreshCw,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationItem, UserRole } from "../../types/dashboard";
import { useAuth } from "../auth/AuthProvider";

interface NavigationBarProps {
  user: UserRole | null;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  user,
  currentPath,
  onNavigate,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const navigationItems: NavigationItem[] = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "bar-chart",
    },
    {
      label: "Boats",
      path: "/boats",
      icon: "anchor",
      requiresAuth: true,
    },
    {
      label: "Admin",
      path: "/admin",
      icon: "shield",
      requiresAuth: true,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: "settings",
      requiresAuth: true,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleSettingsClick = () => {
    console.log("NavigationBar: Navigating to settings, user:", user);
    router.push("/settings");
  };

  const handleAdminClick = () => {
    console.log("NavigationBar: Navigating to admin, user:", user);
    router.push("/admin");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const getUserInitials = (user: UserRole | null) => {
    if (!user) return "U";

    // If user has firstName and lastName, use those
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }

    // Fallback to email-based initials
    if (user.email) {
      return user.email
        .split("@")[0]
        .split(".")
        .map((part: string) => part.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2);
    }

    return "U";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary"></div>
            <span className="hidden font-bold sm:inline-block">
              Boats Analytics
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => {
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  currentPath === item.path ||
                    currentPath.startsWith(item.path + "/")
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            title="Refresh page"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src=""
                    alt={
                      user
                        ? user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.email
                        : "User"
                    }
                  />
                  <AvatarFallback className="text-xs">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">
                    {user
                      ? user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.email
                      : "User"}
                  </p>
                  {user?.email && user.firstName && user.lastName && (
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAdminClick}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                data-testid="logout-button"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="container px-4 py-2">
            {navigationItems.map((item) => {
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "block px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                    currentPath === item.path ||
                      currentPath.startsWith(item.path + "/")
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavigationBar;
