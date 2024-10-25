"use client";
import { Group } from "react-aria-components";
import { InvitationSent } from "./invitation-sent";
import { InvitationReceived } from "./invitation-received";
import { Invite, User } from "@/types/model";
import { useQuery } from "@tanstack/react-query";

// Function to fetch invites (sent and received) based on userId
const fetchInvites = async (userId: string): Promise<{ sent: Invite[]; received: Invite[] }> => {
  const response = await fetch(`/api/invites?userId=${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch invites");
  }
  return response.json(); // Returning { sent, received }
};

const Container = ({ currentUser }: { currentUser: User }) => {
  if (!currentUser) {
    return <div>Please log in to view your invites.</div>;
  }

  // Use useQuery to fetch invites for the current user
  const { data, isLoading, error } = useQuery({
    queryKey: ["invites", currentUser.id], // Include userId in the queryKey for caching
    queryFn: () => fetchInvites(currentUser.id), // Fetch invites based on the user's ID
    enabled: !!currentUser.id, // Ensure the query only runs when currentUser is available
  });

  if (isLoading) {
    return <div>Loading invites...</div>;
  }

  if (!data || error) {
    return <div>Error fetching invites.</div>;
  }

  // Destructure sent and received from the API response
  const { sent, received } = data;

  return (
    <Group className="container mx-auto p-4 space-y-8">
      <InvitationSent />
      <InvitationReceived invites={received} />
    </Group>
  );
};

export default Container;
