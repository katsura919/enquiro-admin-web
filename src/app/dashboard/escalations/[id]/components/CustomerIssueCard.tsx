import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, UserCircle, AlertTriangle, Clock, CheckCircle, Edit2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CustomerIssueCardProps {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  concern: string;
  description?: string;
  status: "escalated" | "pending" | "resolved";
  escalationId: string;
  onUpdate?: (updatedData: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    concern: string;
    description?: string;
  }) => Promise<void>;
}

export function CustomerIssueCard({ 
  customerName, 
  customerEmail, 
  customerPhone,
  concern,
  description,
  status,
  escalationId,
  onUpdate
}: CustomerIssueCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({
    customerName,
    customerEmail,
    customerPhone: customerPhone || "",
    concern,
    description: description || ""
  });

  const statusColors = {
    escalated: "text-orange-400",
    pending: "text-yellow-400",
    resolved: "text-green-400"
  };

  const StatusIcon = status === 'escalated' ? AlertTriangle : status === 'pending' ? Clock : CheckCircle;

  const handleEdit = () => {
    setEditData({
      customerName,
      customerEmail,
      customerPhone: customerPhone || "",
      concern,
      description: description || ""
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData({
      customerName,
      customerEmail,
      customerPhone: customerPhone || "",
      concern,
      description: description || ""
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!onUpdate) return;
    
    setIsLoading(true);
    try {
      await onUpdate({
        customerName: editData.customerName,
        customerEmail: editData.customerEmail,
        customerPhone: editData.customerPhone || undefined,
        concern: editData.concern,
        description: editData.description || undefined
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating customer issue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="bg-card overflow-hidden border-muted-gray shadow-none">
      <div className="p-4">
        {/* Compact Header with Edit Button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold">Customer Issue</h3>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="gap-1.5 cursor-pointer h-8 bg-card"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
                className="gap-1.5 bg-card cursor-pointer h-8"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isLoading}
                className="gap-1.5 cursor-pointer h-8"
              >
                <Check className="h-3.5 w-3.5" />
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-3">
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <UserCircle className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Name</p>
                  {isEditing ? (
                    <Input
                      value={editData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      className="bg-card h-8"
                      placeholder="Enter customer name"
                    />
                  ) : (
                    <p className="text-sm font-medium truncate">{customerName}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      className="bg-card h-8"
                      placeholder="Enter customer email"
                    />
                  ) : (
                    <p className="text-sm font-medium break-all">{customerEmail}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Phone</p>
                  {isEditing ? (
                    <Input
                      value={editData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      className="bg-card h-8"
                      placeholder="Enter customer phone"
                    />
                  ) : (
                    <p className="text-sm font-medium">{customerPhone || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Issue Details */}
          <div className="space-y-3">
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Concern</p>
                {isEditing ? (
                  <Input
                    value={editData.concern}
                    onChange={(e) => handleInputChange('concern', e.target.value)}
                    placeholder="Enter concern"
                    className="bg-card h-8"
                  />
                ) : (
                  <p className="text-sm leading-relaxed">{concern}</p>
                )}
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Description</p>
                {isEditing ? (
                  <div className="space-y-1">
                    <Textarea
                      value={editData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter additional description"
                      rows={3}
                      maxLength={80}
                      className="text-sm resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {editData.description.length}/80 characters
                    </p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{description || 'No additional description'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
