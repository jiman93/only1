"use client";

import { Button, Form, Group, Input, Label, NumberField, Text } from "react-aria-components";
import { v4 as uuidv4 } from "uuid";
import { Invite, User } from "@/types/model";
import { useAppContext } from "../context";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { UserPermission } from "./user-permission";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { inviteSchema } from "../schema";

type SendInviteFormData = z.infer<typeof inviteSchema>;

export const UpdateUserPermission = ({
  invite,
  close,
  isReadonly,
}: {
  invite: Invite;
  close: () => void;
  isReadonly: boolean;
}) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<SendInviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: invite,
  });

  const send = async (data: SendInviteFormData): Promise<Invite[]> => {
    const response = await fetch(`/api/invites?id=${invite.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create invite");
    }

    return response.json();
  };

  // Define the mutation to handle form submission
  const mutation = useMutation({
    mutationFn: send,
    onSuccess: (_, variables) => {
      // Refetch the invites query after mutation success
      queryClient.invalidateQueries({ queryKey: ["sentInvites", variables.inviterId] });
      queryClient.invalidateQueries({ queryKey: ["invById", variables.id] });
      reset(); // Reset the form after success
      close();
    },
  });

  console.log("isvalid", isValid);

  return (
    <>
      <Form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex-row space-y-4">
        <Controller
          name="permissions"
          control={control}
          render={({ field }) => <UserPermission value={field.value} onChange={field.onChange} />}
        />

        <Controller
          name="delegationExpiry"
          control={control}
          render={({ field }) => (
            <NumberField
              value={field.value}
              onChange={(n) => field.onChange(n)}
              minValue={0}
              className="mb-2 text-current"
            >
              <Label className="text-sm">Delegation Expiry</Label>
              <Group className="flex w-fit rounded-md focus-within:outline focus-within:outline-1 focus-within:outline-blue-500">
                <Button
                  slot="decrement"
                  className="text-xl w-[2.3rem] p-0 border-r border-gray-300 rounded-r-none focus:border-blue-500"
                >
                  -
                </Button>
                <Input
                  className="bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 
                text-sm p-2 outline-none w-[6rem] z-10"
                />
                <Button
                  slot="increment"
                  className="text-xl w-[2.3rem] p-0 border-l border-gray-300 rounded-l-none focus:border-blue-500"
                >
                  +
                </Button>
              </Group>
            </NumberField>
          )}
        />
        <Group className="flex space-x-4">
          {!isReadonly && (
            <Button
              type="submit"
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
            >
              {mutation.isPending ? "Inviting..." : "Invite"}
            </Button>
          )}
          <Button
            onPressChange={close}
            className="w-full mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-150"
          >
            Cancel
          </Button>
        </Group>
      </Form>

      {/* Error Handling */}
      {mutation.isError && <p className="text-red-600">{mutation.error?.message}</p>}
    </>
  );
};
