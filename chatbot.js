class Chatbot {
  constructor() {
    this.apiKey = 'YOUR_GROQ_API_KEY_HERE'; // Replace with your Groq API key
    this.isOpen = false;
    this.messages = [];
    this.knowledgeBase = '';
    this.init();
  }

  async init() {
    await this.loadKnowledgeBase();
    this.createChatbotUI();
    this.attachEventListeners();
    this.addWelcomeMessage();
  }

  async loadKnowledgeBase() {
    try {
      const response = await fetch('anil-info.txt');
      this.knowledgeBase = await response.text();
    } catch (error) {
      console.error('Failed to load knowledge base:', error);
      this.knowledgeBase = 'I am Anil Kumar S, a passionate AI/ML enthusiast and software engineer.';
    }
  }

  createChatbotUI() {
    const container = document.createElement('div');
    container.className = 'chatbot-container';
    container.innerHTML = `
      <div class="chat-bubble" id="chatBubble">
        <div class="chat-pulse"></div>
        <div class="chat-pulse" style="animation-delay: 1s;"></div>
        <span class="chat-bubble-icon">🤖</span>
      </div>
      <div class="chat-window" id="chatWindow">
        <div class="chat-header">
          <div class="chat-avatar">🤖</div>
          <div class="chat-header-text">
            <div class="chat-header-title">AK Assistant</div>
            <div class="chat-header-status">
              <span class="status-dot"></span>
              Online
            </div>
          </div>
          <button class="chat-close" id="chatClose">×</button>
        </div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input-container">
          <div class="chat-input-wrapper">
            <input 
              type="text" 
              class="chat-input" 
              id="chatInput" 
              placeholder="Ask me anything about Anil..."
              autocomplete="off"
            />
            <button class="chat-send-btn" id="chatSend">
              ⚡
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);
  }

  attachEventListeners() {
    const bubble = document.getElementById('chatBubble');
    const close = document.getElementById('chatClose');
    const send = document.getElementById('chatSend');
    const input = document.getElementById('chatInput');

    bubble.addEventListener('click', () => this.toggleChat());
    close.addEventListener('click', () => this.toggleChat());
    send.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggleChat() {
    const window = document.getElementById('chatWindow');
    this.isOpen = !this.isOpen;
    window.classList.toggle('active', this.isOpen);
    if (this.isOpen) {
      document.getElementById('chatInput').focus();
    }
  }

  addWelcomeMessage() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = `
      <div class="welcome-message">
        <div class="welcome-message-icon">👋</div>
        <div class="welcome-message-title">Hey there!</div>
        <div class="welcome-message-text">
          I'm Anil's AI assistant. Ask me anything about his work, skills, projects, or experience!
        </div>
        <div class="suggested-questions">
          <div class="suggested-question" onclick="chatbot.askQuestion('What are Anil\\'s main skills?')">
            💡 What are Anil's main skills?
          </div>
          <div class="suggested-question" onclick="chatbot.askQuestion('Tell me about Anil\\'s projects')">
            🚀 Tell me about Anil's projects
          </div>
          <div class="suggested-question" onclick="chatbot.askQuestion('What is Anil\\'s experience?')">
            💼 What is Anil's experience?
          </div>
        </div>
      </div>
    `;
  }

  askQuestion(question) {
    document.getElementById('chatInput').value = question;
    this.sendMessage();
  }

  async sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;

    // Clear input
    input.value = '';

    // Add user message
    this.addMessage(message, 'user');

    // Show typing indicator
    this.showTypingIndicator();

    // Get AI response
    try {
      const response = await this.getAIResponse(message);
      this.removeTypingIndicator();
      this.addMessage(response, 'bot');
    } catch (error) {
      this.removeTypingIndicator();
      this.addMessage('Oops! 😅 Something went wrong. Please try again!', 'bot');
      console.error('Error:', error);
    }
  }

  addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    
    // Remove welcome message if exists
    const welcome = messagesContainer.querySelector('.welcome-message');
    if (welcome) welcome.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const formattedText = this.formatMessage(text);
    
    messageDiv.innerHTML = `
      <div class="message-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
      <div class="message-content">${formattedText}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  formatMessage(text) {
    // Add emojis based on keywords
    let formatted = text;
    
    const emojiMap = {
      'python': '🐍',
      'javascript': '⚡',
      'java': '☕',
      'ai': '🤖',
      'machine learning': '🧠',
      'project': '🚀',
      'skill': '💡',
      'experience': '💼',
      'education': '🎓',
      'university': '🏛️',
      'engineer': '⚙️',
      'abap': '📊',
      'data': '📈',
      'react': '⚛️',
      'node': '🟢',
      'database': '🗄️',
      'api': '🔌',
      'contact': '📧',
      'email': '✉️',
      'linkedin': '💼'
    };

    Object.keys(emojiMap).forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(formatted) && !formatted.includes(emojiMap[keyword])) {
        formatted = formatted.replace(regex, `${keyword} ${emojiMap[keyword]}`);
      }
    });

    // Convert markdown-style bold to HTML
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert line breaks to paragraphs
    formatted = formatted.split('\n\n').map(p => `<p>${p}</p>`).join('');
    
    return formatted;
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-message';
    typingDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  removeTypingIndicator() {
    const typingMessage = document.querySelector('.typing-message');
    if (typingMessage) typingMessage.remove();
  }

  async getAIResponse(userMessage) {
    const systemPrompt = `You are Anil Kumar S's personal AI assistant on his portfolio website. You are helpful, friendly, and enthusiastic. Your role is to answer questions about Anil's background, skills, projects, and experience.

Here is comprehensive information about Anil:

${this.knowledgeBase}

Guidelines:
- Be conversational and friendly, using emojis occasionally
- Keep responses concise but informative (2-4 sentences usually)
- If asked about something not in the knowledge base, politely say you don't have that information but suggest they contact Anil directly
- Highlight Anil's strengths naturally in conversation
- Use markdown formatting (**bold**) for emphasis
- End with a helpful follow-up question or suggestion when appropriate

Remember: You represent Anil professionally, so be warm but professional.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

// Initialize chatbot when DOM is ready
let chatbot;
document.addEventListener('DOMContentLoaded', () => {
  chatbot = new Chatbot();
});
