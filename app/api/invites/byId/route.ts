import { NextResponse } from "next/server";
import { Invite } from "@/types/model"; // Import your Invite type
import { Invites } from "@/mocks/invites";
import { entries } from "../route";

// API route to get a single invite by its id
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inviteId = searchParams.get("id");

  // If no id is provided, return a 400 Bad Request
  if (!inviteId) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  // Find the invite by its id
  const invite = entries.find((invite) => invite.id === inviteId);

  // If the invite is not found, return a 404 Not Found
  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  // Return the found invite in the response
  return NextResponse.json(invite);
}
