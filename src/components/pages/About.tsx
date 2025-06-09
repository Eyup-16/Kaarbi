'use client'

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
  Instagram,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Globe,
  Zap
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
    icon: <Car className="h-8 w-8" />,
    title: "Quality First",
    description: "We maintain the highest standards in vehicle quality and customer service.",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Trust & Safety",
    description: "Your safety and trust are our top priorities in every transaction.",
    color: "bg-green-50 text-green-600"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Customer Focus",
    description: "We put our customers first, ensuring their needs are always met.",
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: "Excellence",
    description: "We strive for excellence in everything we do.",
    color: "bg-yellow-50 text-yellow-600"
  }
];

const stats = [
  {
    icon: <Users className="w-12 h-12" />,
    title: "Happy Customers",
    value: "50,000+",
    description: "Satisfied customers worldwide",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: <Car className="w-12 h-12" />,
    title: "Cars Sold",
    value: "25,000+",
    description: "Vehicles successfully sold",
    color: "bg-green-50 text-green-600"
  },
  {
    icon: <Globe className="w-12 h-12" />,
    title: "Cities",
    value: "15+",
    description: "Operating locations",
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: <TrendingUp className="w-12 h-12" />,
    title: "Growth Rate",
    value: "200%",
    description: "Year over year growth",
    color: "bg-orange-50 text-orange-600"
  }
];

const milestones = [
  {
    year: "2020",
    title: "Company Founded",
    description: "Kaarbi was established with a vision to revolutionize car trading",
    icon: <Building2 className="w-6 h-6" />
  },
  {
    year: "2021",
    title: "First 1K Users",
    description: "Reached our first milestone of 1,000 registered users",
    icon: <Users className="w-6 h-6" />
  },
  {
    year: "2022",
    title: "Mobile App Launch",
    description: "Launched our mobile application for iOS and Android",
    icon: <Zap className="w-6 h-6" />
  },
  {
    year: "2023",
    title: "Series A Funding",
    description: "Secured $10M in Series A funding to expand operations",
    icon: <TrendingUp className="w-6 h-6" />
  },
  {
    year: "2024",
    title: "50K+ Customers",
    description: "Celebrated serving over 50,000 happy customers",
    icon: <Star className="w-6 h-6" />
  }
];

export default function About() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">About Kaarbi</h1>
          <p className="text-gray-500">Revolutionizing the way people buy and sell cars with transparency, trust, and technology.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-2 bg-blue-50 text-blue-700 border-blue-200">
            <Building2 className="w-4 h-4 mr-2" />
            EST. 2020
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} p-2 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card className="p-6 shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Our Team
              </TabsTrigger>
              <TabsTrigger value="journey" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Our Journey
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            {/* Story Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
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

            <Separator />

            {/* Values Section */}
            <div>
              <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0 text-center">
                      <div className={`w-16 h-16 ${value.color} p-4 rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Meet Our Leadership Team</h3>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-4 h-4 mr-2" />
                {teamMembers.length} Members
              </Badge>
            </div>
            <Separator />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <Badge variant="outline" className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
                      {member.role}
                    </Badge>
                    <p className="text-gray-600 mb-4">{member.bio}</p>
                    <div className="flex gap-4">
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                        <Twitter className="h-5 w-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="journey" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Our Journey</h3>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <TrendingUp className="w-4 h-4 mr-2" />
                Growing Since 2020
              </Badge>
            </div>
            <Separator />
            
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg flex items-center justify-center shrink-0">
                      {milestone.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          {milestone.year}
                        </Badge>
                        <h4 className="text-xl font-semibold text-gray-900">{milestone.title}</h4>
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Get in Touch</h3>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-4 h-4 mr-2" />
                Always Available
              </Badge>
            </div>
            <Separator />
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: MapPin, text: "123 Automotive Way, Car City, CC 12345", color: "text-blue-600" },
                    { icon: Phone, text: "+1 (555) 123-4567", color: "text-green-600" },
                    { icon: Mail, text: "contact@kaarbi.com", color: "text-purple-600" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className={`w-10 h-10 ${item.color === 'text-blue-600' ? 'bg-blue-50' : item.color === 'text-green-600' ? 'bg-green-50' : 'bg-purple-50'} p-2 rounded-lg flex items-center justify-center`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <span className="font-medium">{item.text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Follow Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Facebook, href: "https://facebook.com/kaarbi", name: "Facebook", color: "bg-blue-50 text-blue-600" },
                      { icon: Twitter, href: "https://twitter.com/kaarbi", name: "Twitter", color: "bg-cyan-50 text-cyan-600" },
                      { icon: Instagram, href: "https://instagram.com/kaarbi", name: "Instagram", color: "bg-pink-50 text-pink-600" },
                      { icon: Linkedin, href: "https://linkedin.com/company/kaarbi", name: "LinkedIn", color: "bg-indigo-50 text-indigo-600" }
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className={`w-10 h-10 ${social.color} p-2 rounded-lg flex items-center justify-center`}>
                          <social.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{social.name}</span>
                      </a>
                    ))}
                  </div>
                  <div className="pt-4">
                    <Button className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Us
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 