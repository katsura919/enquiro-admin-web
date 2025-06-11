"use client"

import { AlertTriangle } from "lucide-react"

export default function EscalationsPage() {
  return (
    <div className="flex items-center justify-center h-full bg-card/50">
      <div className="text-center text-muted-foreground">
        <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Welcome to Escalations</h2>
        <p>Select an escalation from the sidebar to view details and take action</p>
      </div>
    </div>
  )
}
