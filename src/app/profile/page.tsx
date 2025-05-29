import { Metadata } from "next";
import Profile from "@/components/pages/Profile";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Profile | Kaarbi",
  description: "Manage your account settings and preferences",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }
  return <Profile />;
} 