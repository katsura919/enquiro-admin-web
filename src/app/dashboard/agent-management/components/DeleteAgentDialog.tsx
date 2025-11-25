"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Agent } from "./AgentTable";

interface DeleteAgentDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  agent: Agent | null;
  loading?: boolean;
}

export function DeleteAgentDialog({
  open,
  onClose,
  onConfirm,
  agent,
  loading = false,
}: DeleteAgentDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      // Don't call onClose here - let the parent handle it after success
    } catch (error) {
      console.error("Delete confirmation error:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // Only allow closing when not loading and when dialog is being closed (isOpen = false)
        if (!isOpen && !loading) {
          onClose();
        }
      }}
      modal={true}
    >
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => {
          // Prevent closing by clicking outside when loading
          if (loading) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing with escape key when loading
          if (loading) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Agent</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {agent && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm">
                Are you sure you want to delete <strong>{agent.name}</strong>?
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Email: {agent.email}
              </p>
              <p className="text-sm text-muted-foreground">
                Role: {agent.role}
              </p>
            </div>

            <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4">
              <p className="text-sm text-destructive">
                <strong>Warning:</strong> This will permanently remove the agent
                from the system. All associated data and permissions will be
                lost.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Agent"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
