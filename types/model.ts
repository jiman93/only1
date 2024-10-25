export type User = {
  id: string; // Unique identifier for the user
  email: string; // User's email address (used for logging in)
  name: string; // User's name
  verified: boolean; // Whether the user is verified or not
};

export type Permission = {
  canReadPosts: boolean; // Permission to read posts
  canWritePosts: boolean; // Permission to create/write posts
  canReadMessages: boolean; // Permission to read messages
  canWriteMessages: boolean; // Permission to write/send messages
  canReadProfile: boolean; // Permission to read profile information
  canWriteProfile: boolean; // Permission to update profile information
};

export type Invite = {
  id: string; // Unique identifier for the invite
  inviterId: string; // The user who sent the invite
  inviteeId: string; // The user who is receiving the invite
  permissions: Permission; // The set of permissions granted to the invitee
  status: "Pending" | "Active" | "Trashed"; // Current status of the invite
  createdAt: string; // Timestamp of when the invite was created
  updatedAt: string; // Timestamp of when the invite was last updated
  delegationExpiry?: number; // Optional expiration date for the invite
  specifiedDelegationDays?: DelegationDay[];
};

export type DelegationDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
