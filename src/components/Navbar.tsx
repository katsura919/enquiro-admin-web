"use client"
import { useState } from "react"
import { 
  Navbar as AceternityNavbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton
} from "@/components/ui/resizable-navbar"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Features", link: "/features" },
  ]

  return (
    <AceternityNavbar className="fixed inset-x-0 top-3 z-50">
      {/* Desktop Navigation */}
      <NavBody className="bg-black/20 dark:bg-black/20 backdrop-blur-md ">
        {/* Logo */}
        <div className="flex items-center">
          <a
            href="/"
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-white"
          >
            <span className="font-bold text-xl text-white">Enquiro</span>
          </a>
        </div>

        {/* Navigation Items */}
        <NavItems items={navItems} className="text-gray-300" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <NavbarButton 
            href="/auth/login" 
            variant="secondary" 
            className="text-gray-300 hover:text-white bg-transparent hover:bg-white/10"
          >
            Sign In
          </NavbarButton>
          <NavbarButton 
            href="/auth/register" 
            variant="gradient"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
          >
            Get Started
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav className="bg-black/20 dark:bg-black/20 backdrop-blur-md ">
        <MobileNavHeader>
          {/* Mobile Logo */}
          <a
            href="/"
            className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-white"
          >
            <span className="font-bold text-xl text-white">Enquiro</span>
          </a>

          {/* Mobile Menu Toggle */}
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        {/* Mobile Menu */}
        <MobileNavMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          className="bg-black dark:bg-black backdrop-blur-sm border border-white/20"
        >
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="flex flex-col gap-2 w-full mt-4">
            <NavbarButton 
              href="/auth/login" 
              variant="secondary" 
              className="text-gray-300 hover:text-white bg-transparent hover:bg-white/10 w-full"
            >
              Sign In
            </NavbarButton>
            <NavbarButton 
              href="/auth/register" 
              variant="gradient"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 w-full"
            >
              Get Started
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </AceternityNavbar>
  )
}
