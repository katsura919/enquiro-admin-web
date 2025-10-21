import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Clock, FileText, Send, Trash2, User, Eye } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export interface CaseNote {
  id: string
  content: string
  author: string
  createdAt: string
}

interface CaseNotesPreviewProps {
  notes: CaseNote[];
  onAddNote: (content: string) => void;
  onDeleteNote: (id: string) => void;
  formatDate: (dateString: string) => string;
  maxDisplay?: number;
}

export function CaseNotesPreview({
  notes,
  onAddNote,
  onDeleteNote,
  formatDate,
  maxDisplay = 3
}: CaseNotesPreviewProps) {
  const [noteText, setNoteText] = React.useState("");
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    onAddNote(noteText);
    setNoteText("");
  };

  const handleViewAllNotes = () => {
    router.push(`/dashboard/escalations/${id}/notes`);
  };

  // Simple function to render basic markdown formatting
  const renderNoteContent = (content: string) => {
    // Split by line breaks and render each line
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      // Handle bold text **text**
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Handle italic text *text*
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Handle bullet points - lines starting with - or *
      const isBulletPoint = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      
      if (isBulletPoint) {
        const bulletContent = line.trim().substring(2);
        return (
          <div key={index} className="flex items-start gap-2 ml-2">
            <span className="text-xs mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: bulletContent }} />
          </div>
        );
      }
      
      // Regular line
      return (
        <div key={index}>
          {formattedLine ? (
            <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          ) : (
            <br />
          )}
        </div>
      );
    });
  };

  const displayedNotes = notes.slice(0, maxDisplay);
  const hasMoreNotes = notes.length > maxDisplay;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-500" />
          <h2 className="text-base font-semibold">Case Notes</h2>
          <Badge variant="outline" className="text-xs">{notes.length}</Badge>
        </div>
        {hasMoreNotes && (
          <Button 
            size="sm"
            onClick={handleViewAllNotes}
            variant="ghost"
            className="flex items-center gap-1 h-7 text-xs cursor-pointer"
          >
            <Eye className="h-3 w-3" />
            View All
          </Button>
        )}
      </div>
      
      {/* Compact Add Note Form */}
      <Card className="p-3 overflow-hidden bg-card shadow-none border-muted">
        <div className="space-y-2">
          <Textarea
            placeholder="Add a note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="min-h-[80px] resize-none text-sm"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              size="sm"
              className="h-7 text-xs cursor-pointer"
            >
              <Send className="h-3 w-3 mr-1.5" />
              Add Note
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Compact Notes List */}
      <div className="space-y-2">
        {displayedNotes.length === 0 ? (
          <div className="bg-muted/30 p-6 text-center rounded-lg">
            <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No case notes yet</p>
          </div>
        ) : (
          <>
            {displayedNotes.map((note) => (
              <Card key={note.id} className="bg-card p-3 overflow-hidden shadow-none border-muted">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                        <User className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-xs font-medium">{note.author}</span>
                    </div>
                  </div>
                  <div className="py-0.5">
                    <div className="text-xs leading-relaxed space-y-1">
                      {renderNoteContent(note.content)}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(note.createdAt)}
                  </div>
                </div>
              </Card>
            ))}
            
          </>
        )}
      </div>
    </div>
  );
}
