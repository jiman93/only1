import { NextResponse } from "next/server";
import { Invite } from "@/types/model"; // Import your Invite type
import { entries } from "@/app/entries";

// API route to filter invites by userId
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  // If no userId is provided, return a 400 Bad Request
  if (!userId) {
    return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
  }

  // Filter sent and received invites
  const sent: Invite[] = entries.filter((invite) => invite.inviterId === userId);
  const received: Invite[] = entries.filter((invite) => invite.inviteeId === userId);

  // Return the filtered invites in the response
  return NextResponse.json({ sent, received });
}

// POST endpoint to create a new invite
export async function POST(request: Request) {
  try {
    const newInvite: Invite = await request.json();

    // Ensure all required fields are present
    if (!newInvite.inviterId || !newInvite.inviteeId || !newInvite.permissions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a new mock ID for the invite
    newInvite.createdAt = new Date().toISOString(); // Set creation date
    newInvite.updatedAt = new Date().toISOString(); // Set updated date
    entries.push(newInvite); // Add the invite to the mock storage

    return NextResponse.json(newInvite, { status: 201 }); // Return the newly created invite
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// PUT endpoint to update an invite by its id
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const inviteId = searchParams.get("id");

  // If no id is provided, return a 400 Bad Request
  if (!inviteId) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  try {
    const updatedInviteData: Partial<Invite> = await request.json();

    // Find the invite by its id
    const inviteIndex = entries.findIndex((invite) => invite.id === inviteId);

    if (inviteIndex === -1) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Update the invite with the new data
    const updatedInvite = {
      ...entries[inviteIndex],
      ...updatedInviteData,
      updatedAt: new Date().toISOString(), // Update the timestamp
    };

    entries[inviteIndex] = updatedInvite; // Save the updated invite

    return NextResponse.json(updatedInvite, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
