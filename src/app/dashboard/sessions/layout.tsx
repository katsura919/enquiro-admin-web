"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/lib/auth";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ChatSessionList from "./components/ChatSessionList";
import ChatWindow from "./components/ChatWindow";

interface Message {
  _id: string;
  sessionId: string;
  content: string;
  sender: "user" | "agent" | "ai" | "customer" | "system";
  displayTime: string;
  messageType?: "text" | "image" | "file";
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileSize?: number;
    mimeType: string;
  }>;
  systemMessageType?: string;
  isGoodResponse?: boolean | null;
}

interface ChatSession {
  _id: string;
  businessId: string;
  customerDetails: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10);

  console.log(messages);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const businessId = user?.businessId;

  // Fetch sessions for the business with pagination and search
  useEffect(() => {
    if (!businessId || !token) return;

    const fetchSessions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: limit.toString(),
          ...(searchQuery && { search: searchQuery }),
        });

        const response = await axios.get(
          `${API_URL}/session/business/${businessId}?${params}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSessions(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalCount(response.data.pagination?.totalCount || 0);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [businessId, token, currentPage, searchQuery, limit]);

  // Fetch messages when a session is selected
  useEffect(() => {
    if (!selectedSessionId || !token) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/chat/session/${selectedSessionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Transform the chat data into messages using new chat model
        const transformedMessages = response.data.map((chat: any) => ({
          _id: chat._id,
          sessionId: chat.sessionId,
          content: chat.message || "",
          sender: chat.senderType || "ai",
          displayTime: chat.createdAt,
          messageType: chat.messageType,
          attachments: chat.attachments,
          systemMessageType: chat.systemMessageType,
          isGoodResponse: chat.isGoodResponse,
        }));

        setMessages(transformedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [selectedSessionId, token]);

  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    if (!selectedSessionId || !businessId || !token) return;

    try {
      // Create a new chat message using new model structure
      await axios.post(
        `${API_URL}/chat/send-message`,
        {
          businessId,
          sessionId: selectedSessionId,
          message: content,
          messageType: "text",
          senderType: "agent", // Agent sending message
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refetch messages to get the updated chat including AI response
      const response = await axios.get(
        `${API_URL}/chat/session/${selectedSessionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const transformedMessages = response.data.map((chat: any) => ({
        _id: chat._id,
        sessionId: chat.sessionId,
        content: chat.message || "",
        sender: chat.senderType || "ai",
        displayTime: chat.createdAt,
        messageType: chat.messageType,
        attachments: chat.attachments,
        systemMessageType: chat.systemMessageType,
        isGoodResponse: chat.isGoodResponse,
      }));

      setMessages(transformedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const selectedSession = sessions.find(
    (session) => session._id === selectedSessionId
  );
  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
        <ChatSessionList
          sessions={sessions.map((session) => ({
            _id: session._id,
            businessId: session.businessId,
            customerName: session.customerDetails?.name || "Unknown Customer",
            lastMessageTime: new Date(session.updatedAt),
          }))}
          selectedSessionId={selectedSessionId}
          onSelectSession={(session) => setSelectedSessionId(session._id)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          loading={loading}
        />
      </ResizablePanel>
      <ResizableHandle className="w-1 bg-white/10 hover:bg-white/20 transition-colors" />
      <ResizablePanel defaultSize={75}>
        {selectedSession ? (
          <ChatWindow
            session={{
              _id: selectedSession._id,
              businessId: selectedSession.businessId,
              customerName:
                selectedSession.customerDetails?.name || "Unknown Customer",
              lastMessageTime: new Date(selectedSession.updatedAt),
            }}
            messages={messages.map((msg) => ({
              id: msg._id,
              content: msg.content,
              sender: msg.sender,
              timestamp: new Date(msg.displayTime),
              messageType: msg.messageType,
              attachments: msg.attachments,
              systemMessageType: msg.systemMessageType,
              isGoodResponse: msg.isGoodResponse,
            }))}
            onSendMessage={handleSendMessage}
          />
        ) : (
          children
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
