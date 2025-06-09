import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function requireSuperAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  if (session.user.role !== "SUPER_ADMIN") {
    throw new Error("Super admin access required");
  }

  return session.user;
}

export async function withSuperAdmin(handler: (user?: unknown) => Promise<NextResponse>): Promise<NextResponse> {
  try {
    const user = await requireSuperAdmin();
    return await handler(user);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Access denied" },
      { status: 403 }
    );
  }
}

export async function requireAdminAccess() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  if (!session.user.role || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role as string)) {
    throw new Error("Admin access required");
  }

  return session.user;
}

export async function withAdminAccess(handler: (user: { id: string; role?: string | null; email: string; name: string }) => Promise<NextResponse>): Promise<NextResponse> {
  try {
    const user = await requireAdminAccess();
    return await handler(user);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Access denied" },
      { status: 403 }
    );
  }
}

export async function isSuperAdmin(): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user?.role === "SUPER_ADMIN";
  } catch {
    return false;
  }
}

export async function checkSuperAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!superAdminEmail || !superAdminPassword) {
    console.error("Super admin credentials not configured");
    return false;
  }

  return email === superAdminEmail && password === superAdminPassword;
}
