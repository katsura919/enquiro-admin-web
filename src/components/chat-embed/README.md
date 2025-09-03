# Chat Embed Widget

A customizable chat widget that can be embedded into any website using either React components or vanilla JavaScript.

## React Component Usage (Internal)

For use within your React/Next.js application:

```jsx
import { ChatEmbedWidget } from "@/components/chat-embed"

function MyComponent() {
  return (
    <ChatEmbedWidget 
      businessSlug="your-business-slug" 
      position="bottom-right"
      primaryColor="#3b82f6"
      title="Need Help?"
      frontendUrl="http://localhost:3000"
    />
  )
}
```

### Props

- `businessSlug` (required): The unique identifier for the business
- `position`: Widget position - `'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'`
- `primaryColor`: Hex color for the widget theme
- `title`: Title shown in the chat header
- `frontendUrl`: URL of your frontend application

## Vanilla JavaScript Usage (External Sites)

For embedding in external websites:

### Method 1: Script Tag with Data Attributes

```html
<script 
  src="https://yourdomain.com/embed-widget.js"
  data-business-slug="your-business-slug"
  data-frontend-url="https://yourdomain.com"
  data-position="bottom-right"
  data-primary-color="#3b82f6"
  data-title="Chat with us">
</script>
```

### Method 2: Manual Initialization

```html
<script src="https://yourdomain.com/embed-widget.js"></script>
<script>
  ChatEmbedWidget.init({
    businessSlug: 'your-business-slug',
    frontendUrl: 'https://yourdomain.com',
    position: 'bottom-right',
    primaryColor: '#3b82f6',
    title: 'Chat with us',
    showNotificationBadge: true
  });
</script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `businessSlug` | string | required | Business identifier |
| `frontendUrl` | string | `'http://localhost:3000'` | Frontend application URL |
| `position` | string | `'bottom-right'` | Widget position on screen |
| `primaryColor` | string | `'#3b82f6'` | Primary theme color |
| `title` | string | `'Chat with us'` | Chat window title |
| `showNotificationBadge` | boolean | `true` | Show notification badge |

## API Methods

When using the JavaScript version, you can control the widget programmatically:

```javascript
// Get widget instance
const widget = ChatEmbedWidget.init(config);

// Control methods
widget.show();        // Open the chat
widget.hide();        // Close the chat
widget.toggle();      // Toggle open/close
widget.destroy();     // Remove widget from page
```

## Features

- ✅ Responsive design (mobile-friendly)
- ✅ Customizable colors and positioning
- ✅ Minimize/maximize functionality
- ✅ Notification badge
- ✅ Keyboard navigation (ESC to close)
- ✅ Cross-origin iframe support
- ✅ No external dependencies
- ✅ Multiple instances support

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Security

The widget uses sandboxed iframes with restricted permissions for security. Only necessary permissions are granted:
- `allow-scripts`: For chat functionality
- `allow-same-origin`: For API calls
- `allow-forms`: For form submissions
- `allow-popups`: For escalation features

## Deployment

1. Host the `embed-widget.js` file on your CDN or static server
2. Ensure CORS headers allow embedding from target domains
3. Update the `frontendUrl` to point to your production frontend
4. Test on target websites before production deployment
