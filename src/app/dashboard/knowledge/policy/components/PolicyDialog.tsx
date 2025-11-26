"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { Policy, PolicyFormData, policyTypes } from "./types";

interface PolicyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingPolicy: Policy | null;
  formData: PolicyFormData;
  onFormChange: (field: keyof PolicyFormData, value: string | boolean) => void;
  onSubmit: () => void;
  onDelete?: (id: string) => void;
}

export default function PolicyDialog({
  isOpen,
  onClose,
  editingPolicy,
  formData,
  onFormChange,
  onSubmit,
  onDelete,
}: PolicyDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const isFormValid = formData.title && formData.content && formData.type;

  const handleDelete = () => {
    const policyId = editingPolicy?._id || editingPolicy?.id;
    if (policyId && onDelete) {
      onDelete(policyId);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {editingPolicy ? "Edit Policy" : "Create New Policy"}
        </DialogTitle>
        <DialogDescription>
          {editingPolicy
            ? "Update the policy details below."
            : "Create a new business policy document."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Policy Title *</Label>
            <Input
              id="title"
              placeholder="Enter policy title..."
              value={formData.title}
              onChange={(e) => onFormChange("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Policy Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => onFormChange("type", value as any)}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Select policy type..." />
              </SelectTrigger>
              <SelectContent>
                {policyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Policy Content *</Label>
          <Textarea
            id="content"
            placeholder="Enter the full policy content..."
            value={formData.content}
            onChange={(e) => onFormChange("content", e.target.value)}
            rows={12}
            className="min-h-[300px]"
          />
          <p className="text-xs text-muted-foreground">
            This will be the complete text of your policy document.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            placeholder="tag1, tag2, tag3..."
            value={formData.tags}
            onChange={(e) => onFormChange("tags", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Add tags to help categorize and search for this policy.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => onFormChange("isActive", checked)}
          />
          <Label htmlFor="isActive">Active (visible to customers)</Label>
        </div>

        <div className="flex gap-3 pt-4">
          {editingPolicy && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="cursor-pointer"
              type="button"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <div className="flex-1" />
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!isFormValid}
            className="cursor-pointer"
          >
            {editingPolicy ? "Update Policy" : "Create Policy"}
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the policy:{" "}
              <span className="font-semibold">{editingPolicy?.title}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              Delete Policy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DialogContent>
  );
}
