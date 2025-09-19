"use client"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 h-full">
      <div className="max-w-5xl mx-auto px-6 py-8 h-full">
        {children}
      </div>
    </div>
  )
} 