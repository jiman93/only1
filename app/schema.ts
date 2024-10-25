import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Define the permissions schema
export const permissionsSchema = z.object({
  canReadPosts: z.boolean(),
  canWritePosts: z.boolean(),
  canReadMessages: z.boolean(),
  canWriteMessages: z.boolean(),
  canReadProfile: z.boolean(),
  canWriteProfile: z.boolean(),
});

// Define the invite schema
export const inviteSchema = z.object({
  id: z.string(), // Ensure id is a valid UUID
  inviterId: z.string(), // Can add custom validation if necessary
  inviteeId: z.string(),
  permissions: permissionsSchema, // Use the permissions schema
  status: z.enum(["Pending", "Active", "Trashed"]), // Enum for the status field
  createdAt: z.string(), // Validate as ISO string for date
  delegationExpiry: z.number(), // Validate as ISO string for date
});
