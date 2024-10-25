"use client";
import { Group } from "react-aria-components";
import { InvitationSent } from "./invitation-sent";
import { InvitationReceived } from "./invitation-received";
import { User } from "@/types/model";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

const fetchCurrentUser = async () => {
  const response = await fetch("/api/users/currentUser");
  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }
  return response.json();
};

const Container = ({ currentUser }: { currentUser: User }) => {
  const path = usePathname();

  // Use useQuery to fetch the current user data
  const { data: loggedIn } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    enabled: path !== "/login" && path !== "/users",
  });
  if (!currentUser || !loggedIn) {
    return <div>Please log in to view your invites.</div>;
  }

  return (
    <Group className="container mx-auto p-4 space-y-8">
      <InvitationSent />
      <InvitationReceived />
    </Group>
  );
};

export default Container;
