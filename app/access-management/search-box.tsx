"use client";

import {
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import { useState } from "react";
import { User } from "@/types/model";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "../context";

// Function to fetch users based on a search query
const fetchUsers = async (query: string): Promise<User[]> => {
  const response = await fetch(`/api/users/autocomplete?q=${query}`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

const UserSearchComboBox = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const { setSelectedUser } = useAppContext();

  // UseQuery to fetch users based on the input value
  const {
    data: searchResults = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search"],
    queryFn: () => fetchUsers(inputValue),
    enabled: !!inputValue, // Only run the query if there is input
  });

  // Handle input change and trigger search
  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  return (
    <ComboBox
      aria-label="Search Users"
      onInputChange={handleInputChange}
      className="relative w-full"
    >
      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Search user
      </Label>
      <div className="flex mt-1 relative">
        <Input
          placeholder="Search..."
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
        />
        <Button
          className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
                         dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          ▼
        </Button>
      </div>
      <Popover className="absolute z-10 mt-1 w-1/3 bg-white border border-gray-300 rounded-md shadow-lg dark:bg-gray-700 dark:border-gray-600">
        <ListBox className="max-h-60 overflow-auto focus:outline-none">
          {isLoading ? (
            <ListBoxItem className="px-3 py-2 text-gray-500 dark:text-gray-300">
              Loading...
            </ListBoxItem>
          ) : error ? (
            <ListBoxItem className="px-3 py-2 text-red-500 dark:text-red-400">
              Error fetching users
            </ListBoxItem>
          ) : searchResults.length === 0 ? (
            <ListBoxItem className="px-3 py-2 text-gray-500 dark:text-gray-300">
              No users found
            </ListBoxItem>
          ) : (
            searchResults.map((user: User) => (
              <ListBoxItem
                key={user.id}
                textValue={user.name}
                onAction={() => setSelectedUser(user)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                {`${user.name} (${user.email})`}
              </ListBoxItem>
            ))
          )}
        </ListBox>
      </Popover>
    </ComboBox>
  );
};

export default UserSearchComboBox;
