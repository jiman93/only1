import { users } from "@/mocks/users";
import { NextResponse } from "next/server";

// Listing endpoint
export async function GET() {
  return NextResponse.json(users);
}
