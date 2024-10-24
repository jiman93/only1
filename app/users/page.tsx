"use client";

import { useQuery } from "@tanstack/react-query";
import { Cell, Checkbox, Column, Row, Table, TableBody, TableHeader } from "react-aria-components";
import { User } from "@/types/model"; // Assuming you have a User type defined

// Fetch function to retrieve users from your API endpoint
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("/api/users/listing");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

const Users = () => {
  // Use useQuery to fetch user data
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"], // The query key as an array
    queryFn: fetchUsers, // The function to fetch data
  });
  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching users</div>;
  }

  return (
    <Table
      aria-label="User List"
      selectionMode="multiple"
      className="container bg-white dark:bg-gray-800"
    >
      <TableHeader className="bg-gray-200 dark:bg-gray-700">
        <Column>
          <Checkbox slot="selection" />
        </Column>
        <Column isRowHeader className="text-gray-900 dark:text-gray-200">
          Name
        </Column>
        <Column className="text-gray-900 dark:text-gray-200">Email</Column>
        <Column className="text-gray-900 dark:text-gray-200">Verified</Column>
      </TableHeader>
      <TableBody className="text-center">
        {users?.map((user) => (
          <Row key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
            <Cell>
              <Checkbox slot="selection" />
            </Cell>
            <Cell className="text-gray-900 dark:text-gray-200">{user.name}</Cell>
            <Cell className="text-gray-900 dark:text-gray-200">{user.email}</Cell>
            <Cell className="text-gray-900 dark:text-gray-200">{user.verified ? "Yes" : "No"}</Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};

export default Users;
