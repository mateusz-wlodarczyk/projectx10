import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileFormData } from "@/src/hooks/useProfileForm";

interface ProfileFormProps {
  formData: ProfileFormData;
  isEditing: boolean;
  onInputChange: (field: keyof ProfileFormData, value: string) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  formData, 
  isEditing, 
  onInputChange 
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={(e) => onInputChange("firstName", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={(e) => onInputChange("lastName", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
};
