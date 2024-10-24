"use client";

import { Button, Dialog, DialogTrigger, Group, Text, Modal } from "react-aria-components";
import { CreateUserPermission } from "./create-user-permission";
import { useQuery } from "@tanstack/react-query";
import { Invite } from "@/types/model";
import { UpdateUserPermission } from "./update-user-permission";

// Function to fetch a single invite by ID
const fetchInviteById = async (invId: string): Promise<Invite> => {
  const response = await fetch(`/api/invites/byId?id=${invId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch invite");
  }
  return response.json(); // Returning a single invite object
};

const RowDialog = ({
  invId,
  invitee,
  isReadonly = false,
}: {
  invId: string;
  invitee: string;
  isReadonly?: boolean;
}) => {
  // Fetch invite by ID using useQuery
  const {
    data: invite,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invById", invId], // Query key to uniquely identify this invite
    queryFn: () => fetchInviteById(invId), // Function to fetch invite
  });

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (!invite || error) return <div>Error fetching invite</div>;

  return (
    <Modal className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <Dialog className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
        {({ close }) => (
          <Group className="flex-row space-y-4">
            <Group className="flex justify-between mx-6">
              <Text>{invitee}</Text>
              <Text>{invite.status}</Text>
            </Group>
            <UpdateUserPermission close={close} invite={invite} isReadonly={isReadonly} />
          </Group>
        )}
      </Dialog>
    </Modal>
  );
};

export default RowDialog;
