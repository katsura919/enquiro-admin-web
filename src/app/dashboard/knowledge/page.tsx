"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import KnowledgeList from "./components/KnowledgeList";
import KnowledgeModal from "./components/knowledge-modal";
import { useAuth } from "@/lib/auth";
import { useKnowledge } from "./components/KnowledgeContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function KnowledgePage() {
  const { user } = useAuth();
  const { categories, selectedCategory } = useKnowledge();
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);
  const [selectedKnowledge, setSelectedKnowledge] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  console.log(categories);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const businessId = user?.businessId;

  // Fetch knowledge
  const fetchKnowledge = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/knowledge/business/${businessId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setKnowledge(res.data);
    } catch (err) {
      setKnowledge([]);
    } finally {
      setLoading(false);
    }
  }, [businessId, token]);

  useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);

  // CRUD handlers
  const handleSaveKnowledge = async (data: any) => {
    try {
      if (data._id) {
        // Update
        await axios.put(`${API_URL}/knowledge/${data._id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create
        await axios.post(
          `${API_URL}/knowledge`,
          { ...data, businessId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      fetchKnowledge();
    } catch (err) {
      // handle error
    }
    setIsKnowledgeModalOpen(false);
  };

  const handleDeleteKnowledge = async (itemId: string) => {
    try {
      await axios.delete(`${API_URL}/knowledge/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchKnowledge();
    } catch (err) {
      // handle error
    }
  };

  // Filter knowledge items based on category and search query
  const filteredKnowledge = knowledge.filter((item) => {
    const matchesCategory =
      !selectedCategory || item.categoryId === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Manage your chatbot's knowledge
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            setSelectedKnowledge(null);
            setIsKnowledgeModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Knowledge
        </Button>
      </div>

      {/* Knowledge List */}
      <Card className="bg-card border-muted-gray shadow-none">
        <CardContent className="p-6">
          <KnowledgeList
            items={filteredKnowledge}
            categories={categories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEditItem={(item) => {
              setSelectedKnowledge(item);
              setIsKnowledgeModalOpen(true);
            }}
            onDeleteItem={handleDeleteKnowledge}
            loading={loading}
          />
        </CardContent>
      </Card>

      <KnowledgeModal
        isOpen={isKnowledgeModalOpen}
        onClose={() => setIsKnowledgeModalOpen(false)}
        onSave={handleSaveKnowledge}
        categories={categories}
        initialData={selectedKnowledge}
      />
    </div>
  );
}
