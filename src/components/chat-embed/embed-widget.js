// Chat Embed Widget - Standalone JavaScript Version
// This can be included in any website via <script> tag

(function() {
  'use strict';
  
  // Prevent multiple initializations
  if (window.ChatEmbedWidget) return;
  
  class ChatEmbedWidget {
    constructor(config) {
      this.config = {
        frontendUrl: config.frontendUrl || 'http://localhost:3000',
        businessSlug: config.businessSlug,
        position: config.position || 'bottom-right',
        primaryColor: config.primaryColor || '#3b82f6',
        title: config.title || 'Chat with us',
        showNotificationBadge: config.showNotificationBadge !== false,
        ...config
      };
      
      this.isOpen = false;
      this.isMinimized = false;
      this.sessionId = localStorage.getItem(`chat_session_${this.config.businessSlug}`);
      
      this.init();
    }
    
    init() {
      this.createWidget();
      this.bindEvents();
      this.addStyles();
    }
    
    createWidget() {
      // Create widget container
      this.container = document.createElement('div');
      this.container.id = 'chat-embed-widget-container';
      this.container.className = `chat-embed-widget-${this.config.position}`;
      
      this.container.innerHTML = `
        <div id="chat-embed-bubble" class="chat-embed-bubble">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/>
          </svg>
          ${this.config.showNotificationBadge ? '<div class="chat-embed-notification-badge">1</div>' : ''}
        </div>
        
        <div id="chat-embed-window" class="chat-embed-window chat-embed-hidden">
          <div class="chat-embed-header">
            <h3 class="chat-embed-title">${this.config.title}</h3>
            <div class="chat-embed-controls">
              <button id="chat-embed-minimize" class="chat-embed-control-btn">−</button>
              <button id="chat-embed-close" class="chat-embed-control-btn">×</button>
            </div>
          </div>
          <div class="chat-embed-content">
            <iframe 
              id="chat-embed-iframe"
              src="${this.config.frontendUrl}/chat/${this.config.businessSlug}?embed=true" 
              class="chat-embed-iframe"
              frameborder="0"
              allow="camera; microphone"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups">
            </iframe>
          </div>
        </div>
      `;
      
      // Add to page
      document.body.appendChild(this.container);
    }
    
    addStyles() {
      if (document.getElementById('chat-embed-widget-styles')) return;
      
      const styles = `
        #chat-embed-widget-container {
          position: fixed;
          z-index: 2147483647;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .chat-embed-widget-bottom-right {
          bottom: 20px;
          right: 20px;
        }
        
        .chat-embed-widget-bottom-left {
          bottom: 20px;
          left: 20px;
        }
        
        .chat-embed-widget-top-right {
          top: 20px;
          right: 20px;
        }
        
        .chat-embed-widget-top-left {
          top: 20px;
          left: 20px;
        }
        
        .chat-embed-bubble {
          width: 60px;
          height: 60px;
          background: ${this.config.primaryColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0,0,0,0.24);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        
        .chat-embed-bubble:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.32);
        }
        
        .chat-embed-notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          animation: chat-embed-pulse 2s infinite;
        }
        
        @keyframes chat-embed-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .chat-embed-window {
          position: absolute;
          background: white;
          border-radius: 12px;
          box-shadow: 0 12px 48px rgba(0,0,0,0.24);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          width: 400px;
          height: 600px;
        }
        
        .chat-embed-widget-bottom-right .chat-embed-window,
        .chat-embed-widget-top-right .chat-embed-window {
          right: 0;
        }
        
        .chat-embed-widget-bottom-left .chat-embed-window,
        .chat-embed-widget-top-left .chat-embed-window {
          left: 0;
        }
        
        .chat-embed-widget-bottom-right .chat-embed-window,
        .chat-embed-widget-bottom-left .chat-embed-window {
          bottom: 80px;
        }
        
        .chat-embed-widget-top-right .chat-embed-window,
        .chat-embed-widget-top-left .chat-embed-window {
          top: 80px;
        }
        
        .chat-embed-window.chat-embed-minimized {
          height: 60px;
        }
        
        .chat-embed-hidden {
          opacity: 0;
          visibility: hidden;
          transform: scale(0.8) translateY(20px);
        }
        
        .chat-embed-header {
          background: ${this.config.primaryColor};
          color: white;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          user-select: none;
        }
        
        .chat-embed-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .chat-embed-controls {
          display: flex;
          gap: 8px;
        }
        
        .chat-embed-control-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          transition: background 0.2s;
        }
        
        .chat-embed-control-btn:hover {
          background: rgba(255,255,255,0.3);
        }
        
        .chat-embed-content {
          height: calc(100% - 60px);
          display: flex;
          flex-direction: column;
        }
        
        .chat-embed-window.chat-embed-minimized .chat-embed-content {
          display: none;
        }
        
        .chat-embed-iframe {
          width: 100%;
          height: 100%;
          border: none;
          flex: 1;
        }
        
        @media (max-width: 480px) {
          .chat-embed-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 140px);
            left: 20px !important;
            right: 20px !important;
            bottom: 80px !important;
          }
          
          .chat-embed-bubble {
            width: 56px;
            height: 56px;
          }
        }
      `;
      
      const styleSheet = document.createElement('style');
      styleSheet.id = 'chat-embed-widget-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
    
    bindEvents() {
      const bubble = document.getElementById('chat-embed-bubble');
      const closeBtn = document.getElementById('chat-embed-close');
      const minimizeBtn = document.getElementById('chat-embed-minimize');
      
      bubble.addEventListener('click', () => this.toggleWidget());
      closeBtn.addEventListener('click', () => this.closeWidget());
      minimizeBtn.addEventListener('click', () => this.minimizeWidget());
      
      // Handle escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeWidget();
        }
      });
    }
    
    toggleWidget() {
      if (!this.isOpen) {
        this.openWidget();
      } else if (this.isMinimized) {
        this.maximizeWidget();
      } else {
        this.minimizeWidget();
      }
    }
    
    openWidget() {
      this.isOpen = true;
      this.isMinimized = false;
      const window = document.getElementById('chat-embed-window');
      window.classList.remove('chat-embed-hidden');
      window.classList.remove('chat-embed-minimized');
    }
    
    closeWidget() {
      this.isOpen = false;
      this.isMinimized = false;
      const window = document.getElementById('chat-embed-window');
      window.classList.add('chat-embed-hidden');
      window.classList.remove('chat-embed-minimized');
    }
    
    minimizeWidget() {
      this.isMinimized = true;
      const window = document.getElementById('chat-embed-window');
      window.classList.add('chat-embed-minimized');
    }
    
    maximizeWidget() {
      this.isMinimized = false;
      const window = document.getElementById('chat-embed-window');
      window.classList.remove('chat-embed-minimized');
    }
    
    // Public API methods
    show() {
      this.openWidget();
    }
    
    hide() {
      this.closeWidget();
    }
    
    toggle() {
      this.toggleWidget();
    }
    
    destroy() {
      if (this.container) {
        this.container.remove();
      }
      const styles = document.getElementById('chat-embed-widget-styles');
      if (styles) {
        styles.remove();
      }
    }
  }
  
  // Global initialization function
  window.ChatEmbedWidget = {
    init: function(config) {
      if (!config || !config.businessSlug) {
        console.error('ChatEmbedWidget: businessSlug is required');
        return null;
      }
      
      return new ChatEmbedWidget(config);
    },
    
    // Version info
    version: '1.0.0'
  };
  
  // Auto-initialize if config is provided in script tag
  const currentScript = document.currentScript;
  if (currentScript) {
    const autoConfig = {
      businessSlug: currentScript.getAttribute('data-business-slug'),
      frontendUrl: currentScript.getAttribute('data-frontend-url'),
      position: currentScript.getAttribute('data-position'),
      primaryColor: currentScript.getAttribute('data-primary-color'),
      title: currentScript.getAttribute('data-title')
    };
    
    if (autoConfig.businessSlug) {
      // Initialize after DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          window.ChatEmbedWidget.init(autoConfig);
        });
      } else {
        window.ChatEmbedWidget.init(autoConfig);
      }
    }
  }
})();
