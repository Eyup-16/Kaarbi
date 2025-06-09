import { Metadata } from "next";
import { MessageSquare, Mail,Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support Center | Kaarbi",
  description: "Get help and support for your Kaarbi experience. Contact our team, browse FAQs, and find the assistance you need.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re here to help you make the most of your Kaarbi experience. Get assistance, find answers, and connect with our support team.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Live Chat
                </CardTitle>
                <CardDescription>
                  Get instant help from our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  Email Support
                </CardTitle>
                <CardDescription>
                  Send us a detailed message and we&apos;ll respond soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">Send Email</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                  Help Center
                </CardTitle>
                <CardDescription>
                  Browse our knowledge base and FAQs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Browse FAQs</Button>
              </CardContent>
            </Card>
          </div>

          {/* Support Hours */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Support Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Live Chat & Phone</h4>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM EST</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
                  <p className="text-gray-600">24/7 - We respond within 24 hours</p>
                  <p className="text-gray-600">Priority support for urgent issues</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Help Topics</CardTitle>
              <CardDescription>
                Quick access to the most frequently requested help topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Link href="#" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">Account & Profile</h4>
                    <p className="text-sm text-gray-600">Manage your account settings and profile information</p>
                  </Link>
                  <Link href="#" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">Buying a Car</h4>
                    <p className="text-sm text-gray-600">Guide to purchasing vehicles on Kaarbi</p>
                  </Link>
                  <Link href="#" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">Selling Your Car</h4>
                    <p className="text-sm text-gray-600">How to list and sell your vehicle</p>
                  </Link>
                </div>
                <div className="space-y-3">
                  <Link href="#" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">Payments & Pricing</h4>
                    <p className="text-sm text-gray-600">Understanding fees, payments, and pricing</p>
                  </Link>
                  <Link href="#" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">Safety & Security</h4>
                    <p className="text-sm text-gray-600">Tips for safe transactions and account security</p>
                  </Link>
                  <Link href="#" className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900">Technical Issues</h4>
                    <p className="text-sm text-gray-600">Troubleshoot common technical problems</p>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
