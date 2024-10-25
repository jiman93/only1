import { Invite } from "@/types/model";
import { v4 as uuidv4 } from "uuid";

const permissions = {
  canReadPosts: true,
  canWritePosts: false,
  canReadMessages: true,
  canWriteMessages: false,
  canReadProfile: true,
  canWriteProfile: false,
};

// List of user IDs from your users array
const userIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

// Helper function to generate a random date within the last 30 days
const randomDateWithinLast30Days = () => {
  const daysAgo = Math.floor(Math.random() * 30); // Random number of days ago (0 to 29)
  const randomDate = new Date();
  randomDate.setDate(randomDate.getDate() - daysAgo); // Move back by the random number of days
  return randomDate.toISOString();
};

// Helper function to add 1-5 days to a given date
const randomUpdateDateWithin5Days = (createdAt: string) => {
  const createdDate = new Date(createdAt);
  const additionalDays = Math.floor(Math.random() * 5) + 1; // Random number of days (1 to 5)
  createdDate.setDate(createdDate.getDate() + additionalDays); // Add the random days to created date
  return createdDate.toISOString();
};

// Generate 100 invites
export const Invites: Invite[] = [];

for (let i = 0; i < 100; i++) {
  // Randomly select inviterId and inviteeId
  let inviterId = userIds[Math.floor(Math.random() * userIds.length)];
  let inviteeId = userIds[Math.floor(Math.random() * userIds.length)];

  // Ensure inviter and invitee are not the same user
  while (inviterId === inviteeId) {
    inviteeId = userIds[Math.floor(Math.random() * userIds.length)];
  }

  // Generate random createdAt and updatedAt dates
  const createdAt = randomDateWithinLast30Days();
  const updatedAt = randomUpdateDateWithin5Days(createdAt);

  Invites.push({
    id: uuidv4(),
    inviterId,
    inviteeId,
    permissions,
    status: i % 3 === 0 ? "Pending" : i % 3 === 1 ? "Active" : "Trashed",
    createdAt,
    updatedAt,
    delegationExpiry: Math.floor(Math.random() * 30) + 1, // Random expiry between 1 and 30 days
  });
}
