'use client'
import { useState } from "react"

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "information-collection", title: "Information Collection" },
  { id: "information-usage", title: "Information Usage" },
  { id: "data-protection", title: "Data Protection" },
  { id: "cookies", title: "Cookies & Tracking" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "data-retention", title: "Data Retention" },
  { id: "user-rights", title: "User Rights" },
  { id: "children", title: "Children's Privacy" },
  { id: "international", title: "International Transfers" },
  { id: "changes", title: "Changes to Policy" },
  { id: "contact", title: "Contact Us" },
]

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction")

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <div className="sticky top-8 bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow space-y-8 text-gray-700">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <section id="introduction">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Kaarbi's Privacy Policy. This comprehensive document outlines how we collect, use, disclose, and safeguard your information when you use our platform. We are committed to protecting your privacy and ensuring you have a positive experience on our website.
            </p>
            <p className="mb-4">
              This policy applies to all information collected through our website, mobile applications, and any related services, sales, marketing, or events. Please read this privacy policy carefully as it will help you make informed decisions about sharing your personal information with us.
            </p>
          </section>

          <section id="information-collection">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="mb-4">We collect several types of information for various purposes:</p>
            
            <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials and profile information</li>
              <li>Billing and payment information</li>
              <li>Demographic information (age, gender, location)</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Usage Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Log data and device information</li>
              <li>IP address and browser type</li>
              <li>Pages visited and time spent</li>
              <li>Search queries and interactions</li>
              <li>Performance data and error reports</li>
            </ul>
          </section>

          <section id="information-usage">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the collected information for various purposes:</p>
            
            <h3 className="text-xl font-semibold mb-3">3.1 Service Provision</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and maintain our services</li>
              <li>To process transactions and manage accounts</li>
              <li>To deliver customer support and respond to inquiries</li>
              <li>To send important updates and notifications</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.2 Improvement and Development</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>To improve user experience and platform functionality</li>
              <li>To develop new features and services</li>
              <li>To conduct research and analysis</li>
              <li>To prevent fraud and enhance security</li>
            </ul>
          </section>

          <section id="data-protection">
            <h2 className="text-2xl font-semibold mb-4">4. Data Protection</h2>
            <p className="mb-4">
              We implement a comprehensive set of security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure data storage and backup procedures</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to track activity on our platform and store certain information. These technologies help us:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze how you use our platform</li>
              <li>Personalize your experience</li>
              <li>Provide targeted advertising</li>
            </ul>
          </section>

          <section id="third-party">
            <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
            <p className="mb-4">
              We may use third-party services that collect, monitor, and analyze data. These services include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Analytics providers</li>
              <li>Payment processors</li>
              <li>Cloud service providers</li>
              <li>Marketing and advertising partners</li>
            </ul>
          </section>

          <section id="data-retention">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>

          <section id="user-rights">
            <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
            <p className="mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to request deletion of your data</li>
              <li>Right to object to data processing</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section id="children">
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="mb-4">
              Our services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section id="international">
            <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in compliance with applicable data protection laws.
            </p>
          </section>

          <section id="changes">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date. We encourage you to review this privacy policy periodically.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">Email: privacy@kaarbi.com</p>
              <p className="mb-2">Address: [Your Company Address]</p>
              <p>Phone: [Your Contact Number]</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 