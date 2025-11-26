"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import {
  Building,
  Save,
  Upload,
  Camera,
  Check,
  Copy,
  Globe,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import api from "@/utils/api";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface BusinessData {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  category: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function BusinessSettingsPage() {
  const { user } = useAuth();
  const businessId = user?.businessId;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [businessData, setBusinessData] = useState<BusinessData>({
    name: "",
    slug: "",
    description: "",
    logo: "",
    category: "",
    address: "",
  });

  const [initialBusinessData, setInitialBusinessData] = useState<BusinessData>({
    name: "",
    slug: "",
    description: "",
    logo: "",
    category: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Check if there are changes
  const hasChanges = () => {
    return (
      businessData.name !== initialBusinessData.name ||
      businessData.slug !== initialBusinessData.slug ||
      businessData.description !== initialBusinessData.description ||
      businessData.logo !== initialBusinessData.logo ||
      businessData.category !== initialBusinessData.category ||
      businessData.address !== initialBusinessData.address
    );
  };

  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId) return;

      try {
        const response = await api.get(`/business/${businessId}`);
        setBusinessData(response.data);
        setInitialBusinessData(response.data);
        setLogoPreview(response.data.logo || "");
      } catch (error) {
        console.error("Error fetching business data:", error);
        toast.error("Failed to load business data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId]);

  const handleInputChange = (field: keyof BusinessData, value: string) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug from name
    if (field === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setBusinessData((prev) => ({ ...prev, slug }));
    }

    // Update logo preview
    if (field === "logo") {
      setLogoPreview(value);
    }
  };

  const handleSave = async () => {
    if (!businessId) return;

    setIsSaving(true);

    try {
      await api.put(`/business/${businessId}`, businessData);
      setInitialBusinessData(businessData); // Update initial data after successful save
      toast.success("Business settings updated successfully!");
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error("Failed to update business settings");
    } finally {
      setIsSaving(false);
    }
  };

  const getChatUrl = () => {
    return `${window.location.origin}/chat/${businessData.slug}`;
  };

  const uploadLogoToServer = async (file: File) => {
    if (!businessId) return;

    setIsUploadingLogo(true);

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append("logo", file);

      // Upload to backend API
      const response = await api.post(
        `/business/${businessId}/logo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the business data with the new logo URL from Cloudinary
      const cloudinaryUrl = response.data.data.logo;
      setBusinessData((prev) => ({ ...prev, logo: cloudinaryUrl }));
      setLogoPreview(cloudinaryUrl);

      toast.success("Logo uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to upload logo. Please try again."
      );
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);

      // Upload to server
      await uploadLogoToServer(file);
    }
  };

  const handleLogoUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveLogo = async () => {
    if (!businessId) return;

    try {
      // Update business to remove logo URL
      await api.put(`/business/${businessId}`, {
        ...businessData,
        logo: "",
      });

      setLogoPreview("");
      setBusinessData((prev) => ({ ...prev, logo: "" }));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Logo removed successfully!");
    } catch (error) {
      console.error("Error removing logo:", error);
      toast.error("Failed to remove logo. Please try again.");
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(getChatUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy URL:", err);
      toast.error("Failed to copy URL");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">
            Loading business settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl space-y-6">
        {/* Branding Section */}
        <Card className="border-none bg-background shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <CardTitle className="text-xl text-foreground">
                Business Branding
              </CardTitle>
            </div>
            <CardDescription>
              Manage your business logo and visual identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Business Logo</FieldLabel>
                <FieldDescription>
                  Upload your business logo. Recommended size: 500x500px.
                  Accepts JPG, PNG, GIF, WebP (Max: 10MB)
                </FieldDescription>
                <div className="flex items-start gap-6 mt-3">
                  <div className="relative group">
                    <div className="w-32 h-32 border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors overflow-hidden">
                      {isUploadingLogo ? (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="text-xs text-muted-foreground">
                            Uploading...
                          </span>
                        </div>
                      ) : logoPreview ? (
                        <>
                          <img
                            src={logoPreview}
                            alt="Business logo"
                            className="w-full h-full object-cover rounded-lg"
                            onError={() => setLogoPreview("")}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="text-xs h-8"
                              onClick={handleLogoUploadClick}
                              disabled={isUploadingLogo}
                            >
                              <Camera className="h-3 w-3 mr-1" />
                              Change
                            </Button>
                          </div>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          className="h-full w-full flex-col gap-2 text-muted-foreground hover:text-foreground"
                          onClick={handleLogoUploadClick}
                          disabled={isUploadingLogo}
                        >
                          <Upload className="h-6 w-6" />
                          <span className="text-xs">Upload Logo</span>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogoUploadClick}
                      disabled={isUploadingLogo}
                      className="cursor-pointer"
                    >
                      {isUploadingLogo ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {logoPreview ? "Change Logo" : "Upload Logo"}
                        </>
                      )}
                    </Button>
                    {/* {logoPreview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveLogo}
                        disabled={isUploadingLogo}
                        className="cursor-pointer text-destructive hover:text-destructive"
                      >
                        Remove Logo
                      </Button>
                    )} */}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card className="border-none bg-background shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <CardTitle className="text-xl">Business Information</CardTitle>
            </div>
            <CardDescription>
              Your business details and public information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-6 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="name">Business Name *</FieldLabel>
                  <Input
                    id="name"
                    value={businessData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your business name"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Input
                    id="category"
                    value={businessData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    placeholder="e.g., E-commerce, Healthcare"
                  />
                  <FieldDescription>
                    Industry or business category
                  </FieldDescription>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="description">
                  Business Description
                </FieldLabel>
                <Textarea
                  id="description"
                  value={businessData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Tell us about your business..."
                  rows={4}
                  className="resize-none"
                />
                <FieldDescription>
                  A brief description of your business and services
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="address">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Business Address
                </FieldLabel>
                <Textarea
                  id="address"
                  value={businessData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your business address..."
                  rows={3}
                  className="resize-none"
                />
                <FieldDescription>
                  Physical location or registered business address
                </FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Chat Widget URL */}
        <Card className="border-none bg-background shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle className="text-xl text-foreground">
                Chat Widget URL
              </CardTitle>
            </div>
            <CardDescription>
              Your unique chat widget URL and slug configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="slug">URL Slug *</FieldLabel>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      id="slug"
                      value={businessData.slug}
                      onChange={(e) =>
                        handleInputChange("slug", e.target.value)
                      }
                      placeholder="your-business-url"
                      className="pr-16"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                      .chat
                    </div>
                  </div>
                </div>
                <FieldDescription>
                  This slug determines your chat widget URL. Auto-generated from
                  business name.
                </FieldDescription>
              </Field>

              {businessData.slug && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Your Chat Widget URL:
                    </p>
                    <div className="flex items-center justify-between gap-3 p-3 bg-background rounded-md border">
                      <code className="text-sm text-foreground font-mono flex-1 truncate">
                        {getChatUrl()}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyUrl}
                        className="shrink-0 h-8 w-8 p-0"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Share this URL with your customers to access your chat
                      widget
                    </p>
                  </div>
                </div>
              )}
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Save Button - Only show when there are changes */}
        {hasChanges() && (
          <div className="sticky bottom-6 z-10">
            <Card className="border-2 border-primary/20 bg-background/95 backdrop-blur shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Unsaved Changes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You have unsaved changes to your business settings
                    </p>
                  </div>
                  <Button onClick={handleSave} disabled={isSaving} size="lg">
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
