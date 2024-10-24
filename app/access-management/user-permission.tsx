"use client";

import { Group, Label, Switch, Text } from "react-aria-components";
import { useState } from "react";
import { Permission } from "@/types/model";

// Accepting props from the parent component to handle value and onChange
export const UserPermission = ({
  value,
  onChange,
}: {
  value: Permission;
  onChange: (newPermissions: Permission) => void;
}) => {
  const updatePermission = (key: keyof Permission, selected: boolean) => {
    const newState = { ...value };

    switch (key) {
      // Handle Write Permissions
      case "canWritePosts":
        newState.canWritePosts = selected;
        if (selected) {
          newState.canReadPosts = true; // Automatically enable Read when Write is enabled
        }
        break;
      case "canWriteMessages":
        newState.canWriteMessages = selected;
        if (selected) {
          newState.canReadMessages = true;
        }
        break;
      case "canWriteProfile":
        newState.canWriteProfile = selected;
        if (selected) {
          newState.canReadProfile = true;
        }
        break;

      // Handle Read Permissions
      case "canReadPosts":
        if (selected || !newState.canWritePosts) {
          newState.canReadPosts = selected;
        }
        break;
      case "canReadMessages":
        if (selected || !newState.canWriteMessages) {
          newState.canReadMessages = selected;
        }
        break;
      case "canReadProfile":
        if (selected || !newState.canWriteProfile) {
          newState.canReadProfile = selected;
        }
        break;
      default:
        break;
    }

    onChange(newState); // Directly pass the updated state to onChange
  };
  return (
    <Group className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-md shadow-md">
      {/* Posts Permissions */}
      <Group className="space-y-4">
        <Label className="text-xl font-semibold text-gray-800 dark:text-gray-200">Posts</Label>
        <Group className="flex space-x-8">
          {/* Read Posts */}
          <Group className="flex items-center space-x-2">
            <Switch
              isSelected={value.canReadPosts}
              onChange={(selected) => updatePermission("canReadPosts", selected)}
              isDisabled={value.canWritePosts}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
                value.canReadPosts ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              } ${value.canWritePosts ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`transform transition-transform duration-200 ${
                  value.canReadPosts ? "translate-x-5" : "translate-x-0"
                } inline-block w-5 h-5 bg-white rounded-full`}
              />
            </Switch>
            <Text className="text-gray-700 dark:text-gray-300">Read</Text>
          </Group>
          {/* Write Posts */}
          <Group className="flex items-center space-x-2">
            <Switch
              isSelected={value.canWritePosts}
              onChange={(selected) => updatePermission("canWritePosts", selected)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
                value.canWritePosts ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`transform transition-transform duration-200 ${
                  value.canWritePosts ? "translate-x-5" : "translate-x-0"
                } inline-block w-5 h-5 bg-white rounded-full`}
              />
            </Switch>
            <Text className="text-gray-700 dark:text-gray-300">Write</Text>
          </Group>
        </Group>
      </Group>

      {/* Messages Permissions */}
      <Group className="space-y-4">
        <Label className="text-xl font-semibold text-gray-800 dark:text-gray-200">Messages</Label>
        <Group className="flex space-x-8">
          {/* Read Messages */}
          <Group className="flex items-center space-x-2">
            <Switch
              isSelected={value.canReadMessages}
              onChange={(selected) => updatePermission("canReadMessages", selected)}
              isDisabled={value.canWriteMessages}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
                value.canReadMessages ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              } ${value.canWriteMessages ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`transform transition-transform duration-200 ${
                  value.canReadMessages ? "translate-x-5" : "translate-x-0"
                } inline-block w-5 h-5 bg-white rounded-full`}
              />
            </Switch>
            <Text className="text-gray-700 dark:text-gray-300">Read</Text>
          </Group>
          {/* Write Messages */}
          <Group className="flex items-center space-x-2">
            <Switch
              isSelected={value.canWriteMessages}
              onChange={(selected) => updatePermission("canWriteMessages", selected)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
                value.canWriteMessages ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`transform transition-transform duration-200 ${
                  value.canWriteMessages ? "translate-x-5" : "translate-x-0"
                } inline-block w-5 h-5 bg-white rounded-full`}
              />
            </Switch>
            <Text className="text-gray-700 dark:text-gray-300">Write</Text>
          </Group>
        </Group>
      </Group>

      {/* Profile Permissions */}
      <Group className="space-y-4">
        <Label className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Profile Info
        </Label>
        <Group className="flex space-x-8">
          {/* Read Profile */}
          <Group className="flex items-center space-x-2">
            <Switch
              isSelected={value.canReadProfile}
              onChange={(selected) => updatePermission("canReadProfile", selected)}
              isDisabled={value.canWriteProfile}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
                value.canReadProfile ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              } ${value.canWriteProfile ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`transform transition-transform duration-200 ${
                  value.canReadProfile ? "translate-x-5" : "translate-x-0"
                } inline-block w-5 h-5 bg-white rounded-full`}
              />
            </Switch>
            <Text className="text-gray-700 dark:text-gray-300">Read</Text>
          </Group>
          {/* Write Profile */}
          <Group className="flex items-center space-x-2">
            <Switch
              isSelected={value.canWriteProfile}
              onChange={(selected) => updatePermission("canWriteProfile", selected)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
                value.canWriteProfile ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`transform transition-transform duration-200 ${
                  value.canWriteProfile ? "translate-x-5" : "translate-x-0"
                } inline-block w-5 h-5 bg-white rounded-full`}
              />
            </Switch>
            <Text className="text-gray-700 dark:text-gray-300">Write</Text>
          </Group>
        </Group>
      </Group>
    </Group>
  );
};
