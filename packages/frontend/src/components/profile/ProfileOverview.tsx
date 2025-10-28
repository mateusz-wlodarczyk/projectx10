import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { User as UserType } from "@/src/lib/user-utils";
import {
  getUserDisplayName,
  generateAvatarFallback,
} from "@/src/lib/user-utils";

interface ProfileOverviewProps {
  user: UserType;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user }) => {
  const displayName = getUserDisplayName(user);
  const avatarFallback = generateAvatarFallback(user);
  const hasCompleteProfile = user.firstName && user.lastName;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar || undefined} alt={displayName} />
          <AvatarFallback className="text-2xl">{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="text-xl font-semibold">{displayName}</h3>
          {!hasCompleteProfile && (
            <p className="text-sm text-muted-foreground mt-1">
              Complete your profile
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Email</span>
        </div>
        <p className="text-sm">{user.email}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Member since</span>
        </div>
        <p className="text-sm">
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "Unknown"}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Email Verified</span>
        </div>
        <Badge variant={user.emailVerified ? "default" : "destructive"}>
          {user.emailVerified ? "Verified" : "Not Verified"}
        </Badge>
      </div>
    </div>
  );
};
