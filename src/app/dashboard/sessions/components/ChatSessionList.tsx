import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";

interface ChatSession {
  _id: string;
  businessId: string;
  customerName: string;
  lastMessageTime: Date;
}

interface ChatSessionListProps {
  sessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  selectedSessionId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export default function ChatSessionList({
  sessions,
  onSelectSession,
  selectedSessionId,
  searchQuery,
  onSearchChange,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  loading,
}: ChatSessionListProps) {
  return (
    <div className="flex flex-col h-screen bg-card backdrop-blur-lg">
      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background text-foreground border-border"
          />
        </div>
        {totalCount > 0 && (
          <div className="text-sm text-muted-foreground">
            {totalCount} session{totalCount !== 1 ? "s" : ""} found
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-2" />
            <p>No chat sessions found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session._id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  session._id === selectedSessionId
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-accent"
                }`}
                onClick={() => onSelectSession(session)}
              >
                <div className="font-medium">{session.customerName}</div>
                <div className="text-sm opacity-70">
                  {new Date(session.lastMessageTime).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
