"use client"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
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
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, isLoading, logout } = useAuth()

  const handleLogout = () => {
    setIsLoggingOut(true)
    setIsMobileMenuOpen(false) // Close mobile menu
    logout()
  }

  const handleDashboardClick = () => {
    setIsMobileMenuOpen(false) // Close mobile menu when navigating to dashboard
  }

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Docs", link: "/docs" },
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
          {isLoading && !isLoggingOut && !user ? (
            // Show loading state only during initial auth check, not during logout
            <div className="flex items-center justify-center w-8 h-8">
            </div>
          ) : user ? (
            // Show authenticated user buttons
            <>
              <NavbarButton 
                href="/dashboard" 
                variant="gradient"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                onClick={handleDashboardClick}
              >
                Dashboard
              </NavbarButton>
              <NavbarButton 
                as="button"
                onClick={handleLogout}
                variant="secondary" 
                className="text-gray-300 hover:text-white bg-transparent hover:bg-white/10"
              >
                Sign Out
              </NavbarButton>
            </>
          ) : (
            // Show unauthenticated user buttons
            <>
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
            </>
          )}
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
            {isLoading && !isLoggingOut && !user ? (
              // Show loading state in mobile only during initial auth check, not during logout
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              </div>
            ) : user ? (
              // Show authenticated user buttons in mobile
              <>
                <NavbarButton 
                  href="/dashboard" 
                  variant="gradient"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 w-full"
                  onClick={handleDashboardClick}
                >
                  Dashboard
                </NavbarButton>
                <NavbarButton 
                  as="button"
                  onClick={handleLogout}
                  variant="secondary" 
                  className="text-gray-300 hover:text-white bg-transparent hover:bg-white/10 w-full"
                >
                  Sign Out
                </NavbarButton>
              </>
            ) : (
              // Show unauthenticated user buttons in mobile
              <>
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
              </>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </AceternityNavbar>
  )
}
