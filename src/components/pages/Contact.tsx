'use client'

import { useState } from "react"

const sections = [
  { id: "contact", title: "Contact Us" },
  { id: "faq", title: "Frequently Asked Questions" },
  { id: "help-center", title: "Help Center" },
  { id: "support", title: "Support Options" },
  { id: "feedback", title: "Feedback" },
]

const faqItems = [
  {
    question: "How do I create an account?",
    answer: "To create an account, click on the 'Sign Up' button in the top right corner of the website. Follow the registration process by providing your email address, creating a password, and completing your profile information."
  },
  {
    question: "How can I reset my password?",
    answer: "If you've forgotten your password, click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you instructions to reset your password."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept various payment methods including credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All transactions are secure and encrypted."
  },
  {
    question: "How do I update my profile information?",
    answer: "You can update your profile information by going to your account settings. Click on your profile picture in the top right corner and select 'Settings' from the dropdown menu."
  },
  {
    question: "What is your refund policy?",
    answer: "We offer a 30-day refund policy for most services. Please contact our support team for specific refund requests and we'll be happy to assist you."
  }
]

const helpTopics = [
  {
    title: "Getting Started",
    items: [
      "Creating an Account",
      "Setting Up Your Profile",
      "Navigating the Platform",
      "Basic Features Overview"
    ]
  },
  {
    title: "Account Management",
    items: [
      "Updating Profile Information",
      "Managing Security Settings",
      "Privacy Controls",
      "Account Deletion"
    ]
  },
  {
    title: "Troubleshooting",
    items: [
      "Common Issues",
      "Error Messages",
      "Browser Compatibility",
      "Mobile App Support"
    ]
  }
]

export default function ContactPage() {
  const [activeSection, setActiveSection] = useState("contact")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="sticky top-4 lg:top-8 bg-white rounded-lg shadow-sm p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Table of Contents</h2>
            <nav className="space-y-1 sm:space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`block w-full text-left px-2 sm:px-3 py-1 sm:py-2 rounded-md transition-colors text-sm sm:text-base ${
                    activeSection === section.id
                      ? "bg-gray-100 text-black"
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
          <h1 className="text-4xl font-bold mb-8">Contact & Support</h1>
          
          <section id="contact">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Email</h4>
                    <p>support@kaarbi.com</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Phone</h4>
                    <p>+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Address</h4>
                    <p>123 Business Street<br />San Francisco, CA 94105<br />United States</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM PST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </section>

          <section id="faq">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-4 flex justify-between items-center"
                  >
                    <span className="font-medium">{faq.question}</span>
                    <span className="text-black">
                      {expandedFaq === index ? '−' : '+'}
                    </span>
                  </button>
                  {expandedFaq === index && (
                    <div className="p-4 border-t">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section id="help-center">
            <h2 className="text-2xl font-semibold mb-4">Help Center</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {helpTopics.map((topic, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">{topic.title}</h3>
                  <ul className="space-y-2">
                    {topic.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center">
                        <span className="text-black mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="support">
            <h2 className="text-2xl font-semibold mb-4">Support Options</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Live Chat Support</h3>
                <p className="mb-4">Get immediate assistance from our support team through our live chat feature.</p>
                <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                  Start Chat
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Email Support</h3>
                <p className="mb-4">Send us an email and we'll get back to you within 24 hours.</p>
                <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                  Send Email
                </button>
              </div>
            </div>
          </section>

          <section id="feedback">
            <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="mb-4">We value your feedback! Help us improve our services by sharing your thoughts and suggestions.</p>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    rows={4}
                    placeholder="Your feedback"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 