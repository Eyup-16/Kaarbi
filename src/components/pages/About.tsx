'use client'

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Car, 
  Shield, 
  Users, 
  Award, 
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  Instagram
} from "lucide-react";

const teamMembers = [
  {
    name: "Younes Ouassaa",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop",
    bio: "With over 15 years of experience in the automotive industry, Younes founded Kaarbi with a vision to revolutionize car buying and selling.",
    social: {
      linkedin: "https://linkedin.com/in/younesouassaa",
      twitter: "https://twitter.com/younesouassaa"
    }
  },
  {
    name: "Youcef Ouassaa",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop",
    bio: "Michael leads our technology team, bringing 10+ years of experience in building scalable platforms and innovative solutions.",
    social: {
      linkedin: "https://linkedin.com/in/michaelchen",
      twitter: "https://twitter.com/michaelchen"
    }
  },
  {
    name: "Imen Merouane",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
    bio: "Emily ensures smooth operations and exceptional customer service across all our locations.",
    social: {
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      twitter: "https://twitter.com/emilyrodriguez"
    }
  }
];

const values = [
  {
    icon: <Car className="h-8 w-8 text-primary" />,
    title: "Quality First",
    description: "We maintain the highest standards in vehicle quality and customer service."
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Trust & Safety",
    description: "Your safety and trust are our top priorities in every transaction."
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Customer Focus",
    description: "We put our customers first, ensuring their needs are always met."
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Excellence",
    description: "We strive for excellence in everything we do."
  }
];

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Kaarbi</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Revolutionizing the way people buy and sell cars with transparency, trust, and technology.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
            alt="Kaarbi Office"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-gray-600">
            Founded in 2020, Kaarbi emerged from a simple observation: buying and selling cars should be easier, more transparent, and more enjoyable. What started as a small team of automotive enthusiasts has grown into a trusted platform connecting thousands of buyers and sellers.
          </p>
          <p className="text-gray-600">
            Today, we&apos;re proud to be at the forefront of automotive innovation, combining cutting-edge technology with personalized service to create the best car buying and selling experience.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index}>
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index}>
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary mb-3">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  <div className="flex gap-4">
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      <Linkedin className="h-5 w-5 text-gray-600" />
                    </a>
                    <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      <Twitter className="h-5 w-5 text-gray-600" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-primary/5 rounded-lg p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              Have questions or want to learn more about Kaarbi? We&apos;d love to hear from you.
            </p>
            <div className="space-y-4">
              {[
                { icon: MapPin, text: "123 Automotive Way, Car City, CC 12345" },
                { icon: Phone, text: "+1 (555) 123-4567" },
                { icon: Mail, text: "contact@kaarbi.com" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-4">
            <h3 className="text-xl font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "https://facebook.com/kaarbi" },
                { icon: Twitter, href: "https://twitter.com/kaarbi" },
                { icon: Instagram, href: "https://instagram.com/kaarbi" },
                { icon: Linkedin, href: "https://linkedin.com/company/kaarbi" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <div>
              <Button className="mt-4">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 