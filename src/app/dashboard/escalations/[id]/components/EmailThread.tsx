import * as React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { 
  Mail, 
  Send, 
  Reply, 
  Paperclip, 
  Clock,
  RefreshCw,
  MoreVertical,
  Archive,
  Star,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ComposeEmail } from "./ComposeEmail";
import { formatSenderName, formatEmailDate, sanitizeHTML, cleanHtmlEntities } from "./emailUtils";
import "./email-content.css";

interface EmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
  quotedContent: string | null;
  isHTML: boolean;
  labels: string[];
  internalDate: string;
  attachments: { name: string; size: string; url?: string; contentType?: string }[];
  isFromCustomer?: boolean;
  isRead?: boolean;
}

interface EmailThreadProps {
  emails: EmailMessage[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onSendReply: (content: string, recipients: string[], originalMessageId?: string) => void;
  onSendNewEmail: (emailData: { to: string; subject: string; content: string }) => void;
  formatTime: (dateString: string) => string;
  formatEmailDate?: (dateString: string) => string;
  customerEmail: string;
  customerName: string;
  concernSubject: string;
  userEmail?: string; // Add user email prop
}

export function EmailThread({
  emails,
  loading,
  refreshing,
  onRefresh,
  onSendReply,
  onSendNewEmail,
  formatTime,
  formatEmailDate,
  customerEmail,
  customerName,
  concernSubject,
  userEmail = 'katsuragik919@gmail.com', // Default user email
}: EmailThreadProps) {
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyTo, setReplyTo] = useState<EmailMessage | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set());
  const [expandedQuotedText, setExpandedQuotedText] = useState<Set<string>>(new Set());

  // Helper function to format sender display
  const formatSenderDisplay = (sender: string) => {
    if (!sender) return 'Unknown Sender';
    
    // Extract email from sender string
    const emailMatch = sender.match(/<([^>]+)>/);
    const email = emailMatch ? emailMatch[1] : sender;
    
    // Check if this is the user's email
    if (email.toLowerCase() === userEmail.toLowerCase()) {
      return 'You';
    }
    
    // Return original sender for others
    return sender;
  };

  // Auto-expand the latest email
  React.useEffect(() => {
    if (emails.length > 0 && !expandedEmails.has(emails[emails.length - 1].id)) {
      setExpandedEmails(new Set([emails[emails.length - 1].id]));
    }
  }, [emails]);

  const handleSendReply = () => {
    if (!replyContent.trim() || !replyTo) return;
    
    const recipients = [replyTo.from];
    onSendReply(replyContent, recipients, replyTo.id);
    setReplyContent("");
    setIsReplying(false);
    setReplyTo(null);
  };

  const handleSendNewEmail = (emailData: { to: string; subject: string; content: string }) => {
    onSendNewEmail(emailData);
    setIsComposing(false);
  };

  const toggleEmailExpansion = (emailId: string) => {
    const newExpanded = new Set(expandedEmails);
    if (newExpanded.has(emailId)) {
      newExpanded.delete(emailId);
    } else {
      newExpanded.add(emailId);
    }
    setExpandedEmails(newExpanded);
  };

  const toggleQuotedText = (emailId: string) => {
    const newExpanded = new Set(expandedQuotedText);
    if (newExpanded.has(emailId)) {
      newExpanded.delete(emailId);
    } else {
      newExpanded.add(emailId);
    }
    setExpandedQuotedText(newExpanded);
  };

  // Helper function to clean and parse snippet content
  const parseSnippetContent = (snippet: string) => {
    // Clean up HTML entities
    const cleanSnippet = snippet
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    // Check for quoted text patterns
    const quotedPatterns = [
      /On .+? wrote:/i,
      /From: .+?(?:Sent:|Date:)/i,
      /^> /m,
      /-----Original Message-----/i,
      /_{5,}/,
      /\n> /,
      /Sent from my/i,
      /Original Message/i
    ];
    
    let quotedStartIndex = -1;
    for (const pattern of quotedPatterns) {
      const match = cleanSnippet.match(pattern);
      if (match && match.index !== undefined) {
        quotedStartIndex = match.index;
        break;
      }
    }
    
    if (quotedStartIndex >= 0) {
      const mainText = cleanSnippet.substring(0, quotedStartIndex).trim();
      const quotedText = cleanSnippet.substring(quotedStartIndex).trim();
      return { mainText, quotedText, hasQuoted: true };
    }
    
    return { mainText: cleanSnippet, quotedText: '', hasQuoted: false };
  };

  const startReply = (email: EmailMessage) => {
    setReplyTo(email);
    setIsReplying(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Email Thread</h2>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Email Thread</h2>
          {emails.some(email => !email.isRead) && (
            <Badge variant="destructive" className="text-xs">
              {emails.filter(email => !email.isRead).length} unread
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <Card className="bg-card overflow-hidden">
        <ScrollArea className="h-[650px]">
          {emails.length === 0 ? (
            <div className="p-4">
              <ComposeEmail
                customerEmail={customerEmail}
                customerName={customerName}
                concernSubject={concernSubject}
                onSendEmail={handleSendNewEmail}
                isLoading={loading}
              />
            </div>
          ) : (
            <div className="p-3">
              <div className="space-y-2 max-w-full">
                {emails.map((email, index) => {
                const senderInfo = formatSenderName(email.from);
                const isExpanded = expandedEmails.has(email.id);
                const isLastEmail = index === emails.length - 1;
                
                return (
                  <div 
                    key={email.id} 
                    className={cn(
                      "border rounded-lg transition-all duration-200 w-full",
                      !email.isRead && "bg-muted/20",
                      isExpanded && "shadow-sm",
                      !isExpanded && "hover:bg-muted/30"
                    )}
                  >
                    {/* Email Header - Always Visible */}
                    <div 
                      className={cn(
                        "flex items-center justify-between p-3 cursor-pointer transition-colors w-full",
                        isExpanded && "border-b bg-background/50",
                        !isExpanded && "hover:bg-muted/50 rounded-lg"
                      )}
                      onClick={() => toggleEmailExpansion(email.id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                          email.isFromCustomer 
                            ? "bg-blue-500/10 text-blue-600" 
                            : "bg-primary/10 text-primary"
                        )}>
                          {senderInfo.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm",
                              !email.isRead && "font-medium text-foreground",
                              email.isRead && "text-foreground"
                            )}>
                              {formatSenderDisplay(email.from)}
                            </span>
                            {!email.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {isExpanded ? (
                              <span>To: {email.to}</span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className={cn(!email.isRead && "font-medium")}>
                                  {(() => {
                                    let snippet = email.snippet.length > 80 
                                      ? `${email.snippet.substring(0, 80)}...` 
                                      : email.snippet;
                                    
                                    // Clean HTML entities
                                    snippet = cleanHtmlEntities(snippet);
                                    
                                    // Check for quoted text patterns in snippet
                                    const quotedPatterns = [
                                      /On .+? wrote:/i,
                                      /From: .+?(?:Sent:|Date:)/i,
                                      /^> /m,
                                      /-----Original Message-----/i,
                                      /_{5,}/,
                                      /\n> /,
                                      /Sent from my/i,
                                      /Original Message/i
                                    ];
                                    
                                    let quotedStartIndex = -1;
                                    for (const pattern of quotedPatterns) {
                                      const match = snippet.match(pattern);
                                      if (match && match.index !== undefined) {
                                        quotedStartIndex = match.index;
                                        break;
                                      }
                                    }
                                    
                                    // Special handling for snippets that start with quoted content
                                    if (quotedStartIndex === 0) {
                                      return (
                                        <span className="text-muted-foreground/50 italic font-normal text-[11px]">
                                          {snippet}
                                        </span>
                                      );
                                    }
                                    
                                    if (quotedStartIndex > 0) {
                                      const mainText = snippet.substring(0, quotedStartIndex).trim();
                                      const quotedText = snippet.substring(quotedStartIndex).trim();
                                      
                                      return (
                                        <>
                                          <span className={cn(!email.isRead && "font-medium")}>
                                            {mainText}
                                          </span>
                                          {quotedText && (
                                            <span className="text-muted-foreground/50 italic ml-1 font-normal text-[11px]">
                                              {quotedText}
                                            </span>
                                          )}
                                        </>
                                      );
                                    }
                                    
                                    return snippet;
                                  })()}
                                </span>
                                {/* Show quoted text indicator for collapsed view */}
                                {email.quotedContent && (
                                  <button
                                    className="quoted-text-indicator text-[10px] text-primary hover:text-primary/80 whitespace-nowrap"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleEmailExpansion(email.id);
                                    }}
                                  >
                                    • quoted text
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatEmailDate ? formatEmailDate(email.date) : formatTime(email.date)}</span>
                        {isExpanded && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                              <div className="p-3 text-xs space-y-2">
                                <div className="grid grid-cols-[60px_1fr] gap-2">
                                  <span className="font-medium text-muted-foreground">From:</span>
                                  <span className="break-words">{formatSenderDisplay(email.from)}</span>
                                </div>
                                <div className="grid grid-cols-[60px_1fr] gap-2">
                                  <span className="font-medium text-muted-foreground">To:</span>
                                  <span className="break-words">{email.to}</span>
                                </div>
                                <div className="grid grid-cols-[60px_1fr] gap-2">
                                  <span className="font-medium text-muted-foreground">Date:</span>
                                  <span>{new Date(email.date).toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-[60px_1fr] gap-2">
                                  <span className="font-medium text-muted-foreground">Subject:</span>
                                  <span className="break-words">{email.subject}</span>
                                </div>
                                {email.labels && email.labels.length > 0 && (
                                  <div className="grid grid-cols-[60px_1fr] gap-2">
                                    <span className="font-medium text-muted-foreground">Labels:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {email.labels.map((label, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {label}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="grid grid-cols-[60px_1fr] gap-2">
                                  <span className="font-medium text-muted-foreground">Message ID:</span>
                                  <span className="break-all font-mono text-[10px]">{email.id}</span>
                                </div>
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </div>
                    </div>

                    {/* Email Content - Expandable */}
                    {isExpanded && (
                      <div className="px-4 py-3 w-full overflow-hidden space-y-4">
                        {/* Main email content */}
                        <div className="w-full overflow-hidden">
                          {email.body ? (
                            // Use backend-parsed content
                            <div className="prose prose-sm max-w-none">
                              {email.isHTML ? (
                                <div 
                                  className="email-content text-sm leading-relaxed break-words"
                                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(email.body) }}
                                />
                              ) : (
                                <div className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                                  {email.body}
                                </div>
                              )}
                            </div>
                          ) : (
                            // Fallback to snippet parsing for older emails
                            (() => {
                              const content = email.snippet;
                              
                              // Parse Gmail-style quoted content from snippet
                              const quotedPattern = /On .+? wrote:/;
                              const match = content.match(quotedPattern);
                              
                              if (match && match.index !== undefined) {
                                const mainContent = content.substring(0, match.index).trim();
                                
                                return (
                                  <div className="prose prose-sm max-w-none">
                                    {/* Main content */}
                                    {mainContent && (
                                      <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                        {mainContent}
                                      </div>
                                    )}
                                  </div>
                                );
                              } else {
                                // No quoted content found, render snippet normally
                                return (
                                  <div className="prose prose-sm max-w-none">
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                                      {content}
                                    </div>
                                  </div>
                                );
                              }
                            })()
                          )}
                        </div>

                        {/* Quoted content detection and toggle button */}
                        {(() => {
                          // Check if we have backend-parsed quoted content
                          const hasBackendQuoted = email.quotedContent && email.quotedContent.trim().length > 0;
                          
                          // Check if we can detect quoted content in the snippet/body
                          const content = email.body || email.snippet;
                          const quotedPattern = /On .+? wrote:/;
                          const match = content.match(quotedPattern);
                          const hasSnippetQuoted = match && match.index !== undefined;
                          
                          if (hasBackendQuoted || hasSnippetQuoted) {
                            const quotedContentToShow = hasBackendQuoted 
                              ? email.quotedContent 
                              : (hasSnippetQuoted && match && match.index !== undefined ? content.substring(match.index).trim() : '');
                              
                            return (
                              <div className="w-full">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleQuotedText(email.id)}
                                  className="quoted-text-toggle text-xs text-blue-600 hover:text-blue-700 h-auto px-2 py-1 hover:bg-blue-50 border-none"
                                >
                                  <ChevronDown 
                                    className={cn(
                                      "inline h-3 w-3 mr-1 transition-transform duration-200",
                                      expandedQuotedText.has(email.id) && "rotate-180"
                                    )} 
                                  />
                                  {expandedQuotedText.has(email.id) ? "Hide" : "Show"} quoted text
                                </Button>
                                
                                {expandedQuotedText.has(email.id) && quotedContentToShow && (
                                  <div className="mt-3 pl-4 border-l-4 rounded-r-md p-4 text-xs  overflow-hidden">
                                    {email.isHTML && hasBackendQuoted ? (
                                      <div 
                                        className="break-words prose prose-xs max-w-none"
                                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(quotedContentToShow) }} 
                                      />
                                    ) : (
                                      <div className="whitespace-pre-wrap break-words leading-relaxed">
                                        {cleanHtmlEntities(quotedContentToShow)}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          }
                          
                          return null;
                        })()}

                        {/* Attachments */}
                        {email.attachments && email.attachments.length > 0 && (
                          <div className="w-full">
                            <div className="text-sm font-medium text-muted-foreground mb-3">
                              Attachments ({email.attachments.length})
                            </div>
                            <div className="space-y-2">
                              {email.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 rounded-md p-3">
                                  <Paperclip className="h-4 w-4 flex-shrink-0" />
                                  <span className="truncate flex-1">{attachment.name}</span>
                                  <span className="text-xs whitespace-nowrap">({attachment.size} bytes)</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Email actions */}
                        <div className="flex items-center gap-2 pt-3 border-t">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => startReply(email)}
                            className="gap-2 text-sm h-8"
                          >
                            <Reply className="h-4 w-4" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );})}

                {/* Reply Compose Area */}
                {isReplying && replyTo && (
                  <div className="border rounded-lg p-3 bg-background w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium truncate">Reply to {formatSenderDisplay(replyTo.from)}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setIsReplying(false);
                          setReplyTo(null);
                          setReplyContent("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3 truncate">
                      Subject: Re: {replyTo.subject}
                    </div>
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[100px] mb-3 w-full"
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSendReply}
                        disabled={!replyContent.trim()}
                        size="sm"
                        className="gap-2"
                      >
                        <Send className="h-3 w-3" />
                        Send
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}
