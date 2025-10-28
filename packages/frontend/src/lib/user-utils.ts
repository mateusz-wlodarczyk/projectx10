import { getMockUser } from "./mock-data";

export interface DashboardUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

/**
 * Creates a standardized dashboard user object from a user object
 * Handles null/undefined users by returning a mock user
 */
export const createDashboardUser = (user: User | null): DashboardUser => {
  if (!user) {
    const mockUser = getMockUser("user");
    return {
      id: mockUser.id,
      email: mockUser.email,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      avatar: undefined,
      emailVerified: mockUser.emailVerified,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
    };
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    avatar: user.avatar,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt || new Date(),
  };
};

/**
 * Generates avatar fallback text from user data
 */
export const generateAvatarFallback = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  const emailPrefix = user.email.split("@")[0];
  return emailPrefix.slice(0, 2).toUpperCase();
};

/**
 * Gets display name for a user
 */
export const getUserDisplayName = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.email;
};
