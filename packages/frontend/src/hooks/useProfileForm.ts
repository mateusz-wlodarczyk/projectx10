import { useState, useCallback, useEffect } from "react";
import { User } from "@/src/lib/user-utils";

export interface ProfileFormData {
  firstName: string;
  lastName: string;
}

interface UseProfileFormProps {
  user: User | null;
  onSave: (data: ProfileFormData) => Promise<void>;
}

/**
 * Custom hook for profile form management
 */
export const useProfileForm = ({ user, onSave }: UseProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form data when user is loaded (but not during editing)
  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user, isEditing]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setError(null);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setError(null);
    // Reset form data to original values
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    } else {
      // When user is null, reset to empty strings
      setFormData({
        firstName: "",
        lastName: "",
      });
    }
  }, [user]);

  const handleInputChange = useCallback(
    (field: keyof ProfileFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (!user) {
      setError("No user data available to save.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(formData);
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  }, [formData, onSave, user]);

  const isValid =
    formData.firstName.trim() !== "" && formData.lastName.trim() !== "";

  return {
    formData,
    isEditing,
    isSaving,
    error,
    isValid,
    handleEdit,
    handleCancel,
    handleInputChange,
    handleSave,
  };
};
