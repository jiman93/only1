import { users } from "@/mocks/users";
import { User } from "@/types/model";
import { NextResponse } from "next/server";

// Search endpoint
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  // Filter users based on name or email (case-insensitive)
  const filteredUsers = query
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      )
    : users;

  return NextResponse.json(filteredUsers);
}
