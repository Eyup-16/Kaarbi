import Contact from "@/components/pages/Contact"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact & Support | Kaarbi",
  description: "Get in touch with Kaarbi's support team. Find answers to frequently asked questions, access our help center, and submit feedback.",
}

export default function ContactPage() {
  return <Contact />
} 