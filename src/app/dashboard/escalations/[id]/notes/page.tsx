"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import api from "@/utils/api"
import { useAuth } from "@/lib/auth"
import { ChevronLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CaseNotes } from "../components/CaseNotes"
import type { CaseNote } from '../components/CaseNotes'

interface Escalation {
  _id: string
  caseNumber: string
  customerName: string
  customerEmail: string
  concern: string
  status: "escalated" | "pending" | "resolved"
}

export default function CaseNotesPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params as { id: string }
  const { user } = useAuth()
  
  const [escalation, setEscalation] = React.useState<Escalation | null>(null)
  const [caseNotes, setCaseNotes] = React.useState<CaseNote[]>([])
  const [loading, setLoading] = React.useState(false)
  const [loadingNotes, setLoadingNotes] = React.useState(false)

  const fetchEscalation = async () => {
    if (!id) return
    setLoading(true)
    try {
      const response = await api.get(`/escalation/${id}`)
      setEscalation(response.data)
    } catch (error) {
      console.error('Error fetching escalation:', error)
      setEscalation(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotes = async () => {
    if (!id) return
    setLoadingNotes(true)
    try {
      // Fetch all notes without pagination
      const response = await api.get(`/notes/escalation/${id}?limit=1000`)
      if (response.data.success && response.data.data?.notes) {
        const notes = response.data.data.notes.map((note: any) => ({
          id: note._id,
          content: note.content,
          author: note.createdBy || "Unknown User",
          createdAt: note.createdAt
        }))
        setCaseNotes(notes)
      } else {
        setCaseNotes([])
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
      setCaseNotes([])
    } finally {
      setLoadingNotes(false)
    }
  }

  React.useEffect(() => {
    fetchEscalation()
    fetchNotes()
  }, [id])

  const addCaseNote = async (content: string) => {
    if (!content.trim()) return
    try {
      const createdBy = user ? `${user.firstName} ${user.lastName}` : 'Unknown User'
      const response = await api.post(`/notes/escalation/${id}`, { 
        content,
        createdBy 
      })
      
      if (response.data.success && response.data.data) {
        // Refresh notes to show the new note
        fetchNotes()
      } else {
        alert('Failed to create note.')
      }
    } catch (error) {
      alert('Error adding note.')
      console.error('Error adding note:', error)
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      const response = await api.delete(`/notes/${noteId}`)
      if (response.data.success) {
        fetchNotes() // Refresh notes
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const handleBackToEscalation = () => {
    router.push(`/dashboard/escalations/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="animate-pulse space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-8 w-20 bg-muted rounded"></div>
                <div className="h-6 w-px bg-border"></div>
                <div className="h-10 w-10 bg-muted rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-muted rounded"></div>
                  <div className="h-4 w-48 bg-muted rounded"></div>
                </div>
              </div>
              <div className="h-16 bg-muted/50 rounded-lg"></div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-muted rounded-lg"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBackToEscalation}
              className="flex items-center hover:bg-muted cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Case Notes</h1>
                {escalation && (
                  <p className="text-sm text-muted-foreground">
                    {escalation.caseNumber} • {escalation.customerName}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Case Summary Bar */}
          {escalation && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex-1">
                <p className="font-medium text-sm">{escalation.concern}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{escalation.customerEmail}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  variant={escalation.status === 'resolved' ? 'default' : escalation.status === 'pending' ? 'secondary' : 'destructive'}
                  className="capitalize"
                >
                  {escalation.status}
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {caseNotes.length} {caseNotes.length === 1 ? 'Note' : 'Notes'}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Notes Section */}
          <CaseNotes 
            notes={caseNotes}
            onAddNote={addCaseNote}
            onDeleteNote={deleteNote}
            formatDate={formatDate}
            loading={loadingNotes}
          />
        </div>
      </div>
    </div>
  )
}
