import { Metadata } from "next";
import About from "@/components/pages/About";

export const metadata: Metadata = {
  title: "About | Kaarbi",
  description: "Learn more about Kaarbi, our story, values, and team.",
};

export default function AboutPage() {
  return <About />;
} 