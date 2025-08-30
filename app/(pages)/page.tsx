"use client"

import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChefHat, Calendar, Sparkles, ArrowRight, Phone, MapPin, Heart, Users, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Hero Section Component
function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero2.png"
          alt="Modern restaurant interior"
          fill
          className="object-cover opacity-60"
          priority
        />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/80">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto px-4 sm:px-6">
            <div className="animate-float">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-2 sm:mb-4 drop-shadow-lg">
                House of Bek
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-6 sm:mb-8 drop-shadow-md px-4">
                Experience the Future of Dining
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-pulse-slow px-4">
              <Link href="/pickup" className="w-full sm:w-auto">
                <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700 w-full sm:w-auto">
                  Order Pickup <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/menu" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-transparent w-full sm:w-auto"
                >
                  Check Our Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Services Preview Section
function ServicesPreview() {
const services = [
  {
    title: "Our Menu",
    description: "Explore our authentic dishes made with traditional recipes",
    icon: Heart,
    color: "from-orange-500 to-red-500",
    href: "/menu",
    image: "/chef-cooking-action.png",
  },
  {
    title: "Event Catering",
    description: "Let us cater your special occasions with our signature dishes",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    href: "/events",
    image: "/private-dining-room.png",
  },
  {
    title: "Order for Pickup",
    description: "Fresh meals ready when you are - order ahead for convenience",
    icon: Clock,
    color: "from-blue-500 to-cyan-500",
    href: "/pickup",
    image: "https://i.pinimg.com/1200x/15/65/f5/1565f5d18e7034fb126863659ffa6370.jpg",
  },
]

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Our Philosophy</h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto px-4">
            Every dish tells a story of tradition, love, and the warmth of home cooking
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Link key={index} href={service.href}>
                <Card className="group hover:scale-105 transition-all duration-300 bg-slate-800/50 border-slate-700 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer overflow-hidden">
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div
                      className={`absolute top-3 sm:top-4 right-3 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:animate-pulse`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4 sm:p-6 text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{service.title}</h3>
                    <p className="text-sm sm:text-base text-slate-300">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Story Section
function OurStorySection() {
  const highlights = [
    {
      title: "Family Recipes",
      description: "Time-tested recipes from our family kitchen to yours",
      image: "https://i.pinimg.com/736x/1c/77/a3/1c77a3981fa378caeb0f212bb4e80c7d.jpg"
    },
    {
      title: "Fresh Ingredients",
      description: "Locally sourced, organic ingredients selected daily",
      image: "https://i.pinimg.com/1200x/b2/0a/fb/b20afb6b53abe182112d8f26dbb4d415.jpg"
    },
    {
      title: "Made with Love",
      description: "Every meal prepared with the care you'd give your own family",
      image: "https://i.pinimg.com/1200x/c3/f8/b4/c3f8b4369dee96b85dfdef9a52cfc6d5.jpg"
    },
    {
      title: "Comfort Food",
      description: "Hearty, satisfying dishes that warm the soul",
      image: "https://i.pinimg.com/1200x/e9/cc/76/e9cc766d5aec2888addf7e5a461dbb53.jpg"
    }
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Our Story</h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto px-4">
            House of Bek began in our family kitchen, where generations of recipes were perfected and shared. 
            Today, we bring that same love and tradition to your table, one home-cooked meal at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {highlights.map((highlight, index) => (
            <div key={index} className="relative group">
              <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden">
                <Image
                  src={highlight.image}
                  alt={highlight.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{highlight.title}</h3>
                  <p className="text-sm sm:text-base opacity-90">{highlight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 sm:p-8 border border-slate-700">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">The Bek Family Promise</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
              We believe that great food brings people together. That's why we treat every order like we're 
              cooking for our own family. From our kitchen to your table, we're committed to delivering 
              the warmth, flavor, and comfort that only comes from true home cooking.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/restaurant-entrance.png" alt="House of Bek kitchen" fill className="object-cover opacity-20" />
      </div>
      <div className="absolute inset-0 bg-purple-600/80" />

      <div className="relative max-w-4xl mx-auto text-center text-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 sm:mb-8 px-4">
          Taste the Difference Home Cooking Makes
        </h2>
        <p className="text-base sm:text-lg mb-6 sm:mb-8 px-4 max-w-2xl mx-auto">
          Ready to experience meals made with love? Order today and taste what generations 
          of family cooking can bring to your table.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-6 sm:mb-8 px-4">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>(555) 123-houseofbek</span>
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Serving Your Neighborhood</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/pickup">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-slate-100 w-full sm:w-auto">
              Order Now
            </Button>
          </Link>
                    <Link href="/menu">

          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 w-full sm:w-auto">
            View Menu
          </Button></Link>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesPreview />
      <OurStorySection />
      <ContactSection />
    </main>
  )
}