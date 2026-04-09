import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = body.password;

    if (!password) {
      return new Response("Password is required", { status: 400 });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return new Response("Invalid password", { status: 401 });
    }

    const response = NextResponse.json({ ok: true });

    response.cookies.set("admin_auth", "ok", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return new Response("Login error", { status: 500 });
  }
}