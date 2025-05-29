'use client'

import { useState } from "react"

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "arbitration", title: "Arbitration Agreement" },
  { id: "choice-of-law", title: "Choice of Law" },
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "user-conduct", title: "User Conduct" },
  { id: "electronic-records", title: "Electronic Records" },
  { id: "communications", title: "Communications" },
  { id: "privacy", title: "Privacy" },
  { id: "services", title: "Services" },
  { id: "commercial-use", title: "Commercial Use" },
  { id: "access-modification", title: "Access & Modification" },
  { id: "indemnification", title: "Indemnification" },
  { id: "warranties", title: "Warranties" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "general", title: "General Information" },
]

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <section id="introduction">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              By accessing or using this website, any of its pages and/or any of the services referenced herein, you accept and agree to be bound by the Terms of Service set forth below.
            </p>
          </section>

          <section id="arbitration">
            <h2 className="text-2xl font-semibold mb-4">2. Arbitration Agreement and Waiver of Right to Bring Collective Action</h2>
            <p className="mb-4">
              You and Kaarbi agree to final and binding arbitration of all Claims before the American Arbitration Association pursuant to the written Arbitration Agreement. PLEASE READ THE ARBITRATION AGREEMENT CAREFULLY. IT AFFECTS YOUR RIGHTS, AND THOSE TO WHOM YOU PROVIDE ACCESS TO YOUR ACCOUNT. THE AGREEMENT TO ARBITRATE ALL CLAIMS IS A CONDITION OF YOUR USE OF THE KAARBI WEBSITE AND/OR ANY OF THE SERVICES REFERENCED HEREIN.
            </p>
          </section>

          <section id="choice-of-law">
            <h2 className="text-2xl font-semibold mb-4">3. Choice of Law</h2>
            <p className="mb-4">
              Except as otherwise expressly provided in the Arbitration Agreement, the relationship between you and Kaarbi are governed by the laws of the State of California without regard to its conflict/choice of law provisions.
            </p>
          </section>

          <section id="acceptance">
            <h2 className="text-2xl font-semibold mb-4">4. Acceptance of Terms</h2>
            <p className="mb-4">
              Kaarbi provides users with an online platform and related services that can be accessed from or through this website (collectively, "Services"). Please carefully read these Terms of Service before using the Services. By accessing or using the Services, including this website, you accept and agree to be bound by these Terms of Service and all applicable laws, rules, and regulations associated with your use of the Services.
            </p>
            <p className="mb-4">
              If you do not agree to the Terms of Service, you are not authorized to use this website or the Services. These Terms of Service also apply to any co-branded or framed version of this website.
            </p>
          </section>

          <section id="user-conduct">
            <h2 className="text-2xl font-semibold mb-4">5. User Conduct</h2>
            <p className="mb-4">
              You are authorized by Kaarbi to access and use the Services, including the information on this website, solely for your personal, non-commercial use provided that you are at least 18 years of age. The information and materials displayed on this website may not otherwise be copied, transmitted, displayed, distributed, downloaded, licensed, modified, published, posted, reproduced, used, sold, transmitted, used to create a derivative work, or otherwise used for commercial or public purposes without Kaarbi's express prior written consent.
            </p>
          </section>

          <section id="electronic-records">
            <h2 className="text-2xl font-semibold mb-4">6. Electronic Records and Signatures</h2>
            <p className="mb-4">
              You are hereby informed that: (i) you may receive records or provide your signature on paper or in a non-electronic form, and (ii) you may withdraw your consent to have records provided or made available in an electronic form. Your consent to receive records and provide your signature electronically applies to all records and transactions with Kaarbi.
            </p>
          </section>

          <section id="communications">
            <h2 className="text-2xl font-semibold mb-4">7. Communications</h2>
            <p className="mb-4">
              You acknowledge that telephone calls to or from Kaarbi may be monitored and recorded and you agree to such monitoring and recording. You verify that any contact information provided to Kaarbi, including your name, mailing address, email address, and telephone number, is true and accurate.
            </p>
          </section>

          <section id="privacy">
            <h2 className="text-2xl font-semibold mb-4">8. Privacy</h2>
            <p className="mb-4">
              Kaarbi is committed to respecting your privacy and protecting your personally identifiable information. Our data collection and use practices are subject to the Kaarbi Privacy Policy. You understand that through your use of the Services, you consent to the collection and use of this information.
            </p>
          </section>

          <section id="services">
            <h2 className="text-2xl font-semibold mb-4">9. Services</h2>
            <p className="mb-4">
              All information provided on this website is for informational purposes only. Kaarbi provides a platform for users to access various services and information. We do not guarantee the accuracy, completeness, or reliability of any information provided through our Services.
            </p>
          </section>

          <section id="commercial-use">
            <h2 className="text-2xl font-semibold mb-4">10. No Commercial Use of Services</h2>
            <p className="mb-4">
              You agree not to reproduce, duplicate, copy, sell, trade, resell or exploit for any commercial purposes, any portion or use of, or access to, the Services.
            </p>
          </section>

          <section id="access-modification">
            <h2 className="text-2xl font-semibold mb-4">11. Right to Deny Access and to Modify the Services</h2>
            <p className="mb-4">
              Kaarbi reserves the right to deny use of, or access to, the Services to you and/or anyone for any or no reason. Kaarbi also reserves the right at any time and from time-to-time to modify or discontinue, temporarily or permanently, the Services with or without notice.
            </p>
          </section>

          <section id="indemnification">
            <h2 className="text-2xl font-semibold mb-4">12. Indemnification</h2>
            <p className="mb-4">
              You will indemnify, defend and hold harmless Kaarbi and its subsidiaries, affiliates, partners, officers, directors, employees, and agents from all claims that arise out of or in connection with a breach of these Terms of Service, use of the Services, and/or any violation of law and/or the rights of any third party.
            </p>
          </section>

          <section id="warranties">
            <h2 className="text-2xl font-semibold mb-4">13. Disclaimer of Warranties</h2>
            <p className="mb-4">
              THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TIMELINESS, AND NONINFRINGEMENT.
            </p>
          </section>

          <section id="liability">
            <h2 className="text-2xl font-semibold mb-4">14. Limitation of Liability</h2>
            <p className="mb-4">
              IN NO EVENT SHALL KAARBI BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES ARISING OUT OF, OR IN CONNECTION WITH THE SERVICES.
            </p>
          </section>

          <section id="intellectual-property">
            <h2 className="text-2xl font-semibold mb-4">15. Intellectual Property</h2>
            <p className="mb-4">
              You agree that all of Kaarbi's trademarks, trade names, service marks, logos, brand features, and product and Service names are trademarks and the property of Kaarbi. The Services contain proprietary information protected by applicable intellectual property and other laws.
            </p>
          </section>

          <section id="general">
            <h2 className="text-2xl font-semibold mb-4">16. General Information</h2>
            <p className="mb-4">
              These Terms of Service may be amended from time to time without notice in Kaarbi's sole discretion. Any changes to the Terms of Service will be effective immediately upon the posting of the revised Terms of Service on this website.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="mb-2">Last updated: {new Date().toLocaleDateString()}</p>
              <p className="mb-2">Contact: legal@kaarbi.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 