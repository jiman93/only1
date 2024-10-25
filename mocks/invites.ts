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

  Invites.push({
    id: uuidv4(),
    inviterId,
    inviteeId,
    permissions,
    status: i % 3 === 0 ? "Pending" : i % 3 === 1 ? "Active" : "Trashed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    delegationExpiry: Math.floor(Math.random() * 30) + 1,
  });
}
