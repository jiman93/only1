import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Create response
    const response = NextResponse.json({ result: true });

    // Set cookie in response
    response.cookies.set("currentUser", email, {
      httpOnly: false, // If you want the cookie to be inaccessible to client-side JavaScript
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
