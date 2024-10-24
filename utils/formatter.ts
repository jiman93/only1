import { Permission } from "@/types/model";

export const processPermissions = (permissions: Permission) => {
  let result: string[] = [];

  // Process Posts
  if (permissions.canReadPosts || permissions.canWritePosts) {
    const postPermission = permissions.canWritePosts ? "Read&Write" : "Read";
    result.push(`Posts: ${postPermission}`);
  }

  // Process Messages
  if (permissions.canReadMessages || permissions.canWriteMessages) {
    const messagePermission = permissions.canWriteMessages ? "Read&Write" : "Read";
    result.push(`Messages: ${messagePermission}`);
  }

  // Process Profile
  if (permissions.canReadProfile || permissions.canWriteProfile) {
    const profilePermission = permissions.canWriteProfile ? "Read&Write" : "Read";
    result.push(`Profile: ${profilePermission}`);
  }
  return result.join(", ");
};

export const formatDate = (dateString: string) => {
  // Create a Date object from the string
  const date = new Date(dateString);

  // Extract the parts we need
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  // Format the date as DD/MM/YYYY HH:mm
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
  return formattedDate;
};
