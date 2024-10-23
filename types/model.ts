type User = {
  id: string; // Unique identifier for the user
  email: string; // User's email address (used for logging in)
  name: string; // User's name
  verified: boolean; // Whether the user is verified or not
  createdAt: Date; // Timestamp of account creation
  updatedAt: Date; // Timestamp of the last update to the user's account
};

type Permission = {
  canReadPosts: boolean; // Permission to read posts
  canWritePosts: boolean; // Permission to create/write posts
  canReadMessages: boolean; // Permission to read messages
  canWriteMessages: boolean; // Permission to write/send messages
  canReadProfile: boolean; // Permission to read profile information
  canWriteProfile: boolean; // Permission to update profile information
};

type Invite = {
  id: string; // Unique identifier for the invite
  inviterId: string; // The user who sent the invite
  inviteeId: string; // The user who is receiving the invite
  permissions: Permission; // The set of permissions granted to the invitee
  status: "pending" | "accepted" | "rejected"; // Current status of the invite
  createdAt: Date; // Timestamp of when the invite was created
  updatedAt: Date; // Timestamp of when the invite was last updated
  expiresAt?: Date; // Optional expiration date for the invite
};

type AccountDelegation = {
  id: string; // Unique identifier for the delegation entry
  delegatorId: string; // The user whose account is being delegated
  delegateeId: string; // The user who is managing the account
  permissions: Permission; // The permissions the delegatee has for managing the account
  createdAt: Date; // Timestamp of when the delegation started
  updatedAt: Date; // Timestamp of the last update to the delegation
  expires?: number; // Optional expiration date for the delegation
  window: DelegationWindow;
};

type DelegationWindow = {
  activeDays?: (
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"
  )[]; // Days on which permissions are valid
};
