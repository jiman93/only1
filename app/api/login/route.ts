import { users } from "@/mocks/users";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Find the user by email
    const user = users.find((u) => u.email === email);

    if (!user) {
      // If user doesn't exist, return an error
      return NextResponse.json({ result: false, message: "User not found" }, { status: 404 });
    }

    // Create response
    const response = NextResponse.json({ result: true, user });

    // Set cookie in response with the whole user object as a stringified JSON
    response.cookies.set("currentUser", JSON.stringify(user), {
      httpOnly: false, // If you want the cookie to be accessible by client-side JavaScript
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/", // Cookie is available for the entire site
      sameSite: "strict", // Prevent CSRF attacks
    });

    return response;
  } catch (error) {
    return NextResponse.json({ result: false, message: "Invalid request" }, { status: 400 });
  }
}
