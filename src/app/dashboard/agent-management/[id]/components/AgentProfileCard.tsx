"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Mail, Phone, Trash2 } from "lucide-react";

interface Agent {
  _id: string;
  businessId: string;
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  role: string;
  createdAt: string;
  deletedAt?: string | null;
}

interface AgentProfileCardProps {
  agent: Agent;
  onEdit: () => void;
  onDelete: () => void;
}

export function AgentProfileCard({
  agent,
  onEdit,
  onDelete,
}: AgentProfileCardProps) {
  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") {
      return "NA";
    }
    return (
      name
        .trim()
        .split(" ")
        .filter((word) => word.length > 0)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "NA"
    );
  };

  return (
    <>
      <Card className="overflow-hidden bg-card border-muted-gray shadow-none sticky top-4">
        <CardContent className="p-0">
          {/* Compact Profile Header */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl ring-2 ring-white/10">
                <AvatarImage
                  src={agent.profilePic}
                  alt={agent.name || "Agent"}
                />
                <AvatarFallback className="text-xl font-bold bg-white/20 text-white backdrop-blur-sm">
                  {getInitials(agent.name || "")}
                </AvatarFallback>
              </Avatar>

              <div className="mt-3">
                <h2 className="text-lg font-bold text-white">
                  {agent.name || "Unknown Agent"}
                </h2>
                <p className="text-xs text-white/80 capitalize mt-1">
                  {agent.role || "Support Agent"}
                </p>
              </div>
            </div>
          </div>

          {/* Compact Contact Information */}
          <div className="px-4 py-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Contact
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground font-medium truncate">
                    {agent.phone || "+1 555 666 7890"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-primary hover:underline cursor-pointer font-medium truncate">
                    {agent.email || "email@example.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="flex-1 bg-card shadow-none h-8 text-xs"
              >
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="flex-1 bg-card shadow-none h-8 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
