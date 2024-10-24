import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User } from "@/types/model"; // Import User type

export async function GET() {
  // Get the cookies from the request
  const cookieStore = await cookies();

  // Get the currentUser cookie value
  const currentUserCookie = cookieStore.get("currentUser")?.value;

  // If there is no currentUser cookie, return a 401 Unauthorized response
  if (!currentUserCookie) {
    return NextResponse.json(
      { error: "No currentUser cookie found. Please log in." },
      { status: 401 }
  );
  }

  let currentUser: User;
  try {
    currentUser = JSON.parse(currentUserCookie) as User; // Type casting to User
  } catch (error) {
    return NextResponse.json({ error: "Invalid cookie format." }, { status: 400 });
  }

  // Return the currentUser data as a JSON response
  return NextResponse.json(currentUser);
}
