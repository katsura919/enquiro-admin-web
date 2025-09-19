"use client"

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { DocsLayout } from '@/components/docs/DocsLayout'
import { TableOfContents } from '@/components/docs/TableOfContents'

interface DocsLayoutWrapperProps {
  children: React.ReactNode
  showToc?: boolean
}

export default function DocsLayoutWrapper({ children, showToc = true }: DocsLayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="border-b">
        <div className="container mx-auto px-4">
          <DocsLayout>
            <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
              <DocsSidebar />
            </aside>
            
            <main className="relative py-6 lg:gap-10 lg:py-8">
              <div className="mx-auto w-full min-w-0">
                {children}
              </div>
            </main>

            {/* Table of Contents - Right Sidebar */}
            {showToc && (
              <div className="hidden text-sm xl:block">
                <div className="sticky top-16 -mt-10 pt-4">
                  <TableOfContents />
                </div>
              </div>
            )}
          </DocsLayout>
        </div>
      </div>

      <Footer />
    </div>
  )
}