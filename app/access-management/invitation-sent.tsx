"use client";

import {
  Button,
  Cell,
  Column,
  DialogTrigger,
  Group,
  Row,
  Table,
  TableBody,
  TableHeader,
  Text,
} from "react-aria-components";
import SearchBox from "./search-box";
import { CreateUserPermission } from "./create-user-permission";
import { Invite, User } from "@/types/model";
import { formatDate, processPermissions } from "../../utils/formatter";
import RowDialog from "./rowDialog";
import { useAppContext } from "../context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Fetch function to retrieve users from your API endpoint
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("/api/users/listing");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

// Function to handle updating an invite's status to "Trashed"
const trashInvite = async (inviteId: string) => {
  const response = await fetch(`/api/invites?id=${inviteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "Trashed", // Set the status to Trashed
      updatedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update invite");
  }

  return response.json();
};

export const InvitationSent = ({ invites }: { invites: Invite[] }) => {
  const { selectedUser } = useAppContext();
  const queryClient = useQueryClient();
  const [selectedRow, setSelectedRow] = useState("");

  // Use useQuery to fetch user data
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"], // The query key as an array
    queryFn: fetchUsers, // The function to fetch data
  });

  const mapInviteeIdToUser = (inviteeId: string) => users?.find((u) => inviteeId === u.id);

  // UseMutation for updating invite status to "Trashed" with optimistic updates
  const mutation = useMutation({
    mutationFn: trashInvite,
    onMutate: async (inviteId: string) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["invites"] });

      // Snapshot the previous value
      const previousInvites = queryClient.getQueryData<Invite[]>(["invites"]);

      // Optimistically update to "Trashed" status
      if (previousInvites) {
        queryClient.setQueryData(
          ["invites"],
          previousInvites.map((invite) =>
            invite.id === inviteId ? { ...invite, status: "Trashed" } : invite
          )
        );
      }

      // Return the snapshot value for rollback in case of error
      return { previousInvites };
    },
    onError: (err, inviteId, context) => {
      // Rollback on error
      if (context?.previousInvites) {
        queryClient.setQueryData(["invites"], context.previousInvites);
      }
    },
    onSettled: () => {
      // Refetch the invites to ensure server state is in sync with client
      queryClient.invalidateQueries({ queryKey: ["invites"] });
    },
  });

  const renderCreatePermission = () => {
    if (selectedUser) {
      return (
        <Group className="w-full md:w-1/3 space-y-4">
          {selectedUser && <Text>{`${selectedUser.name}`}</Text>}
          <CreateUserPermission />
        </Group>
      );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching users</div>;
  }

  return (
    <Group className="space-y-4">
      <SearchBox />
      <div className="p-6">{renderCreatePermission()}</div>

      <Group className="space-y-2">
        <h1 className="text-xl font-bold mb-2">Invitations Sent</h1>

        <Table
          aria-label="Invitations Sent"
          selectionMode="single"
          className="min-w-full text-center bg-white dark:bg-gray-800"
        >
          <TableHeader className="bg-gray-200 dark:bg-gray-700">
            <Column isRowHeader className="text-gray-900 dark:text-gray-200">
              Invitee
            </Column>
            <Column className="text-gray-900 dark:text-gray-200">Sent Date</Column>
            <Column className="text-gray-900 dark:text-gray-200">Last Update</Column>
            <Column className="text-gray-900 dark:text-gray-200">Summary of Permissions</Column>
            <Column className="text-gray-900 dark:text-gray-200">Status</Column>
            <Column className="text-gray-900 dark:text-gray-200">Action</Column>
          </TableHeader>
          <TableBody>
            {invites.map((invitation) => (
              <Row className="hover:bg-gray-100 dark:hover:bg-gray-600" key={invitation.id}>
                <Cell className="text-gray-900 dark:text-gray-200">
                  <Group className="flex-row space-y-2">
                    <Text className="block">
                      {mapInviteeIdToUser(invitation.inviteeId)?.name || ""}
                    </Text>
                    <Text className="block">
                      {mapInviteeIdToUser(invitation.inviteeId)?.email || ""}
                    </Text>
                  </Group>
                </Cell>
                <Cell className="text-gray-900 dark:text-gray-200">
                  {formatDate(invitation.createdAt)}
                </Cell>
                <Cell className="text-gray-900 dark:text-gray-200">
                  {formatDate(invitation.updatedAt)}
                </Cell>
                <Cell className="text-gray-900 dark:text-gray-200">
                  {processPermissions(invitation.permissions)}
                </Cell>
                <Cell className="text-gray-900 dark:text-gray-200">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      invitation.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : invitation.status === "Active"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {invitation.status}
                  </span>
                </Cell>
                <Cell className="flex space-x-2 w-full justify-center text-gray-900 dark:text-gray-200">
                  {/**
                   * Cell doesn't support colspan to do collapse properly, so we do dialog instead
                   */}
                  {invitation.status !== "Trashed" ? (
                    <>
                      <DialogTrigger>
                        <Button
                          onPress={() => setSelectedRow(invitation.id)}
                          className="p-2 my-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
                        >
                          Modify
                        </Button>
                        {selectedRow === invitation.id && (
                          <RowDialog
                            invId={invitation.id}
                            invitee={mapInviteeIdToUser(invitation.inviteeId)?.name || ""}
                          />
                        )}
                      </DialogTrigger>

                      <Button
                        onPress={() => mutation.mutate(invitation.id)} // Trigger the mutation
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold p-2 my-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition duration-150"
                      >
                        Trash
                      </Button>
                    </>
                  ) : (
                    <> </>
                  )}
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </Group>
    </Group>
  );
};
