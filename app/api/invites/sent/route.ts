import { NextResponse } from "next/server";
import { Invite } from "@/types/model";
import { entries } from "@/app/entries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");

  // If no userId is provided, return a 400 Bad Request
  if (!userId) {
    return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
  }

  // Parse page and pageSize parameters with default values
  const page = parseInt(pageParam ?? "0", 10); // Default to page 0
  const pageSize = parseInt(pageSizeParam ?? "10", 10); // Default page size of 10

  // Validate page and pageSize parameters
  if (isNaN(page) || page < 0) {
    return NextResponse.json({ error: "Invalid page parameter" }, { status: 400 });
  }
  if (isNaN(pageSize) || pageSize <= 0) {
    return NextResponse.json({ error: "Invalid pageSize parameter" }, { status: 400 });
  }

  const sentInvites: Invite[] = entries.filter((invite) => invite.inviterId === userId);

  // Calculate total number of pages
  const totalInvites = sentInvites.length;
  const totalPages = Math.ceil(totalInvites / pageSize);

  // Check if the requested page is within the valid range
  if (page >= totalPages) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  // Get the invites for the requested page
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const invitesForPage = sentInvites.slice(startIndex, endIndex);

  // Determine if there is a next page
  const nextPage = page + 1 < totalPages ? page + 1 : null;

  // Return the paginated invites and pagination info
  return NextResponse.json({
    invites: invitesForPage,
    pageInfo: {
      currentPage: page,
      nextPage,
      totalPages,
      totalInvites,
    },
  });
}
