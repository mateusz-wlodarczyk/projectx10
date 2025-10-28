import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

interface ProfileActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  isValid: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  isEditing,
  isSaving,
  isValid,
  onEdit,
  onCancel,
  onSave,
}) => {
  if (!isEditing) {
    return (
      <Button onClick={onEdit}>
        <Edit className="mr-2 h-4 w-4" />
        Edit Profile
      </Button>
    );
  }

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isSaving}
      >
        <X className="mr-2 h-4 w-4" />
        Cancel
      </Button>
      <Button 
        onClick={onSave} 
        disabled={isSaving || !isValid}
      >
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};
