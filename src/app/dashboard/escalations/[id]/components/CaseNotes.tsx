import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Clock, FileText, PenLine, Send, Trash2, User } from "lucide-react";

export interface CaseNote {
  id: string
  content: string
  author: string
  createdAt: string
}

interface CaseNotesProps {
  notes: CaseNote[];
  onAddNote: (content: string) => void;
  onDeleteNote: (id: string) => void;
  formatDate: (dateString: string) => string;
  loading?: boolean;
}

export function CaseNotes({
  notes,
  onAddNote,
  onDeleteNote,
  formatDate,
  loading = false
}: CaseNotesProps) {
  const [noteText, setNoteText] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setIsAdding(true);
    try {
      await onAddNote(noteText);
      setNoteText("");
    } finally {
      setIsAdding(false);
    }
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

  return (
    <div className="space-y-6">
      {/* Add Note Form */}
      <Card className="border-2 border-dashed hover:border-solid hover:border-primary/50 transition-colors bg-gradient-to-br from-card to-muted/20">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <PenLine className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-base">Add New Note</h3>
          </div>
          <Textarea
            placeholder="Write your note here... You can use basic formatting:&#10;**bold text**&#10;*italic text*&#10;- bullet points"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="min-h-[140px] resize-none bg-background border-border/50 focus:border-primary"
            disabled={isAdding}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {noteText.length} characters
            </p>
            <Button 
              onClick={handleAddNote}
              disabled={!noteText.trim() || isAdding}
              size="sm"
              className="gap-2"
            >
              {isAdding ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Add Note
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Notes List Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">All Notes</h2>
          <Badge variant="secondary" className="ml-1">{notes.length}</Badge>
        </div>
      </div>
      
      {/* Notes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse bg-card border-muted-gray">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-32" />
                    <div className="h-3 bg-muted rounded w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              </Card>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <Card className="border-dashed">
            <div className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold mb-2">No notes yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Start documenting this case by adding your first note above.
              </p>
            </div>
          </Card>
        ) : (
          notes.map((note, index) => (
            <Card key={note.id} className="overflow-hidden hover:shadow-md bg-card border-muted-gray shadow-none">
              <div className="p-6 space-y-4">
                {/* Note Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-sm">{note.author}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3" />
                        {formatDate(note.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    #{notes.length - index}
                  </Badge>
                </div>
                
                {/* Note Content */}
                <div className="">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="text-sm leading-relaxed space-y-1 text-foreground/90">
                      {renderNoteContent(note.content)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
