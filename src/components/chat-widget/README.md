import { ChatWidget } from '@/components/chat-widget'

// Basic usage
<ChatWidget businessSlug="your-business-slug" />

// With custom styling and position
<ChatWidget 
  businessSlug="your-business-slug"
  position="bottom-left"
  primaryColor="#10b981"
  title="Need Help?"
/>

// Props interface:
interface ChatWidgetProps {
  businessSlug: string           // Required: Business slug to connect to
  position?: 'bottom-right' | 'bottom-left'  // Widget position (default: 'bottom-right')
  primaryColor?: string          // Primary color for branding (default: '#2563eb')
  title?: string                 // Title for the widget (default: 'Chat with us')
}
