/* ============================================================
   VIDYASETU — Shared Utilities
   ============================================================ */

// ── Toast Notifications ───────────────────────────────────────
function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast${type === 'error' ? ' error' : type === 'warning' ? ' warning' : ''}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
  toast.textContent = `${icon} ${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, duration);
}

// ── Auth Check & Redirect ──────────────────────────────────────
async function requireAuth(expectedRole = null) {
  try {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    if (!data.success) { window.location.href = '/index'; return null; }
    if (expectedRole && data.user.role !== expectedRole) {
      window.location.href = data.user.role === 'ngo' ? '/ngo-dashboard' : '/donor-dashboard';
      return null;
    }
    return data.user;
  } catch {
    window.location.href = '/index';
    return null;
  }
}

// ── Format Currency ────────────────────────────────────────────
function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// ── Format Date ────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Logout ─────────────────────────────────────────────────────
async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/index';
}

// ── Chatbot ────────────────────────────────────────────────────
function initChatbot() {
  const responses = {
    'how to donate': 'Go to the <b>Donate</b> page, enter your name, amount, and category, then choose a payment method. It\'s that simple! 🎓',
    'donate': 'Click the <b>Donate Now</b> button in the nav bar! You can contribute to Books, Scholarships, Meals, Uniforms, and more.',
    'where is money used': 'Every rupee goes toward student support — books 📚, meals 🍱, scholarships 🎓, uniforms 👕, and digital tools 💻. NGO tracks every expense!',
    'money used': 'Donations are used for Books, Meals, Scholarships, Uniforms, and Digital Access for underprivileged students.',
    'what is vidyasetu': 'VidyaSetu is a <b>Smart Education Donation Platform</b> connecting donors with NGOs to fund student education. 🌱',
    'trust index': 'The Trust Index shows how transparently the NGO uses funds. It\'s calculated as (Expenses / Donations) × 100. Higher = more active usage!',
    'receipt': 'After every donation, you get a digital receipt by email and it shows in your dashboard under Donation History.',
    'otp': 'OTP (One-Time Password) is sent to your registered email for secure login. Valid for 3 minutes.',
    'categories': 'You can donate to: 📚 Books, 🍱 Meals, 🎓 Scholarships, 👕 Uniforms, 💻 Digital Access, 🏫 Infrastructure.',
    'help': 'I can help with: Donations, Platform info, Trust Index, Receipts, Categories, OTP & Login. Just ask! 😊',
    'hello': 'Hello! 👋 Welcome to VidyaSetu. How can I assist you today?',
    'hi': 'Hi there! 😊 Ask me anything about VidyaSetu or donating to student education.',
    'impact': 'Your donations have real impact! Every ₹150 approx. helps one student. VidyaSetu tracks and shows your impact score.',
    'contact': 'For support, email us at support@vidyasetu.org 📧',
    'default': 'I\'m not sure about that. Try asking: "How to donate?", "Where is money used?", or "What is VidyaSetu?" 🤔'
  };

  function getBotResponse(input) {
    const lower = input.toLowerCase().trim();
    for (const key of Object.keys(responses)) {
      if (key !== 'default' && lower.includes(key)) return responses[key];
    }
    return responses['default'];
  }

  const quickReplies = ['How to donate?', 'Where is money used?', 'What is VidyaSetu?', 'Trust Index', 'Categories'];

  const chatHTML = `
    <div id="chatbot-bubble">
      <div class="chat-window" id="chatWindow">
        <div class="chat-head">
          <div class="chat-head-avatar">🤖</div>
          <div>
            <div class="chat-head-name">Setu Assistant</div>
            <div class="chat-head-status">● Online</div>
          </div>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="chat-msg bot">👋 Hi! I'm Setu, your VidyaSetu assistant. How can I help you today?</div>
        </div>
        <div class="chat-quick-replies" id="quickReplies">
          ${quickReplies.map(q => `<button class="quick-reply-btn" onclick="sendQuick('${q}')">${q}</button>`).join('')}
        </div>
        <div class="chat-input-row">
          <input type="text" class="chat-input" id="chatInput" placeholder="Ask something..." onkeydown="if(event.key==='Enter') sendChat()">
          <button class="chat-send-btn" onclick="sendChat()">➤</button>
        </div>
      </div>
      <button class="chat-toggle-btn" onclick="toggleChat()" title="Chat with Setu">🤖</button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', chatHTML);
}

function toggleChat() {
  const win = document.getElementById('chatWindow');
  win.classList.toggle('open');
}

function addChatMsg(text, type, id = null) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  if (id) div.id = id;
  div.innerHTML = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  addChatMsg(text, 'user');
  input.value = '';

  const typingId = 'typing_' + Date.now();
  addChatMsg('⏳ Thinking...', 'bot', typingId);

  try {
    const response = await getChatResponse(text);
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    addChatMsg(response, 'bot');
  } catch {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    addChatMsg('Sorry, something went wrong. Try again! 😊', 'bot');
  }
}

async function sendQuick(text) {
  addChatMsg(text, 'user');

  const typingId = 'typing_' + Date.now();
  addChatMsg('⏳ Thinking...', 'bot', typingId);

  try {
    const response = await getChatResponse(text);
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    addChatMsg(response, 'bot');
  } catch {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    addChatMsg('Sorry, something went wrong. Try again! 😊', 'bot');
  }
}

async function getChatResponse(input) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    return data.reply || 'Sorry, no response received!';
  } catch (err) {
    console.error('Chat error:', err);
    return 'Sorry, I am having trouble connecting. Please try again! 😊';
  }
}