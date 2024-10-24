"use client";

import { z } from "zod";
import { Button, Form, Group, Input, Label, TextField } from "react-aria-components";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema";

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginResponse {
  result: boolean;
  message?: string; // Optionally handle error messages like "User not found"
}

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  // Function to handle the API request
  const login = async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    // Handle different statuses returned by the API
    if (!response.ok) {
      const resData = await response.json();
      if (resData.message === "User not found") {
        throw new Error("User not found");
      } else {
        throw new Error("Invalid login credentials");
      }
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      router.push("/access-management");
    },
    onError: (e: Error) => {
      setError(e.message);
    },
  });

  return (
    <Form
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full"
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
    >
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700 dark:text-gray-300">
        Only1 Login
      </h2>

      <div className="mb-4">
        <Label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Email
        </Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="Enter your email"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-300"
            />
          )}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition duration-150"
      >
        {mutation.isPending ? "Logging in..." : "Submit"}
      </Button>
    </Form>
  );
};

export default LoginPage;
