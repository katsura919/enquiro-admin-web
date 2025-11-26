"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, EyeOff, Tag, FileText } from "lucide-react";
import { Policy } from "./types";

interface PolicyCardProps {
  policy: Policy;
  onEdit: (policy: Policy) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function PolicyCard({
  policy,
  onEdit,
  onDelete,
  onToggleStatus,
}: PolicyCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "privacy":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "terms":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "refund":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "shipping":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "warranty":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "general":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "privacy":
        return "Privacy Policy";
      case "terms":
        return "Terms of Service";
      case "refund":
        return "Refund Policy";
      case "shipping":
        return "Shipping Policy";
      case "warranty":
        return "Warranty Policy";
      case "general":
        return "General Policy";
      default:
        return type;
    }
  };

  return (
    <TooltipProvider>
      <Card
        className={`transition-all hover:bg-muted/50 ${
          policy.isActive ? "" : "opacity-60"
        } bg-card border-muted-gray cursor-pointer shadow-none`}
        onClick={() => onEdit(policy)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-lg leading-tight">
                      {policy.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {policy.content.length > 200
                      ? `${policy.content.substring(0, 200)}...`
                      : policy.content}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getTypeColor(policy.type)}>
                  {getTypeLabel(policy.type)}
                </Badge>
                {policy.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="text-xs text-muted-foreground">
                Created: {new Date(policy.createdAt).toLocaleDateString()} •
                Updated: {new Date(policy.updatedAt).toLocaleDateString()}
              </div>
            </div>

            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  {(policy.id ?? policy._id) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus((policy.id ?? policy._id) as string);
                      }}
                      className="h-8 w-8 p-0 cursor-pointer"
                    >
                      {policy.isActive ? (
                        <Eye className="h-4 w-4 text-blue-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {policy.isActive
                      ? "Active policy - Click to deactivate"
                      : "Inactive policy - Click to activate"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
