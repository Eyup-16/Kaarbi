'use client'

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

const Dashboard = () => {
  const { data: session, isPending, error } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <section className="flex flex-col justify-center items-center h-80">
      <LoaderCircle />
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col justify-center items-center h-80">
        <p>Error: {error.message}</p>
      </section>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <section className="flex flex-col justify-center items-center h-80">
      <h1>Welcome, {session.user.name}</h1>
      <p>This is your dashboard</p>
    </section>
  );
};

export default Dashboard;

