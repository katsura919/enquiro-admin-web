"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Mail, Phone, Trash2, Key } from "lucide-react";

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
  onChangePassword: () => void;
}

export function AgentProfileCard({
  agent,
  onEdit,
  onDelete,
  onChangePassword,
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
      <Card className="overflow-hidden bg-card border-muted-gray shadow-none sticky top-24">
        <CardContent className="p-0">
          {/* Profile Header with Gradient */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div className="flex flex-col items-center text-center relative z-10">
              <Avatar className="h-28 w-28 border-4 border-white/30 shadow-2xl ring-4 ring-white/10">
                <AvatarImage
                  src={agent.profilePic}
                  alt={agent.name || "Agent"}
                />
                <AvatarFallback className="text-2xl font-bold bg-white/20 text-white backdrop-blur-sm">
                  {getInitials(agent.name || "")}
                </AvatarFallback>
              </Avatar>

              <div className="mt-4">
                <h2 className="text-xl font-bold text-white">
                  {agent.name || "Unknown Agent"}
                </h2>
                <p className="text-sm text-white/90 capitalize mt-1.5 font-medium">
                  {agent.role || "Support Agent"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="px-6 py-6 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="p-2 bg-muted rounded-lg group-hover:bg-muted/70 transition-colors">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Phone Number
                    </p>
                    <p className="text-sm text-foreground font-medium truncate">
                      {agent.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="p-2 bg-muted rounded-lg group-hover:bg-muted/70 transition-colors">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Email Address
                    </p>
                    <p className="text-sm text-primary hover:underline cursor-pointer font-medium truncate">
                      {agent.email || "email@example.com"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Actions
              </h3>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="w-full justify-start h-9 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:text-blue-400 dark:hover:border-blue-900 transition-all"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onChangePassword}
                  className="w-full justify-start h-9 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 dark:hover:bg-purple-950 dark:hover:text-purple-400 dark:hover:border-purple-900 transition-all"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="w-full justify-start h-9 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Agent
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
