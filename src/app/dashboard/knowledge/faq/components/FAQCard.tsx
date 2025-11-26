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
import { Eye, EyeOff, Tag } from "lucide-react";
import { FAQ } from "./types";

interface FAQCardProps {
  faq: FAQ;
  onEdit: (faq: FAQ) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function FAQCard({
  faq,
  onEdit,
  onDelete,
  onToggleStatus,
}: FAQCardProps) {
  return (
    <TooltipProvider>
      <Card
        className={`transition-all hover:bg-muted/50 ${
          faq.isActive ? "" : "opacity-60"
        } bg-card border-muted-gray cursor-pointer shadow-none`}
        onClick={() => onEdit(faq)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg leading-tight mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{faq.category}</Badge>
                {faq.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="text-xs text-muted-foreground">
                Created: {new Date(faq.createdAt).toLocaleDateString()} •
                Updated: {new Date(faq.updatedAt).toLocaleDateString()}
              </div>
            </div>

            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(faq._id || faq.id!);
                    }}
                    className="h-8 w-8 p-0 cursor-pointer"
                  >
                    {faq.isActive ? (
                      <Eye className="h-4 w-4 text-blue-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {faq.isActive
                      ? "Visible to audiences - Click to hide"
                      : "Hidden from audiences - Click to show"}
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
