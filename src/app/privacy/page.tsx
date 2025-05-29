import Privacy from "@/components/pages/Privacy"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Kaarbi",
  description: "Privacy Policy for Kaarbi - Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return <Privacy />
} 