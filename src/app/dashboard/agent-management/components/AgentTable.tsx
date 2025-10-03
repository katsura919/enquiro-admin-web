"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Mail, Phone, UserX } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export interface Agent {
  _id: string
  businessId: string
  name: string
  email: string
  phone?: string
  profilePic?: string
  role: string
  createdAt: string
  deletedAt?: string | null
}

interface AgentTableProps {
  agents: Agent[]
  onEdit: (agent: Agent) => void
  onDelete: (agent: Agent) => void
  loading?: boolean
}

export function AgentTable({
  agents,
  onEdit,
  onDelete,
  loading = false
}: AgentTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <Card className="w-full">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading agents...</p>
        </div>
      </Card>
    )
  }

  if (agents.length === 0) {
    return (
      <Card className="w-full">
        <div className="p-8 text-center">
          <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No agents found</h3>
          <p className="text-muted-foreground">There are no agents to display at the moment.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-card w-full border-border shadow-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={agent.profilePic} alt={agent.name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(agent.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-sm text-muted-foreground">{agent.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{agent.email}</span>
                  </div>
                  {agent.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{agent.phone}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(agent)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(agent)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
