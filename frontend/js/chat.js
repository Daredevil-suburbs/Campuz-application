document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chatForm');
  const messageInput = document.getElementById('messageInput');

  // Dummy responses simulating AI
  const dummyResponses = [
    "That's a great question! Let me check the academic calendar for you.",
    "Your current attendance for Computer Science is 85%. You're doing great!",
    "The upcoming mid-term exams will begin on the 15th of next month.",
    "I've checked the faculty directory. Dr. Smith is available on Tuesdays and Thursdays.",
    "To pay your fees, navigate to your Dashboard and click on 'Fees Status'.",
    "I'm an AI assistant still in training. Could you specify your query?",
    "Your latest assignment for Data Structures is due next Friday at 11:59 PM."
  ];

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  function appendMessage(text, isUser) {
    const wrapper = document.createElement('div');
    wrapper.className = isUser ? 'flex justify-end' : 'flex justify-start fade-in';
    
    const bubble = document.createElement('div');
    bubble.className = `max-w-lg rounded-2xl px-5 py-3 shadow-lg ${isUser ? 'user-msg' : 'bot-msg glass-effect'}`;
    
    const messageP = document.createElement('p');
    messageP.textContent = text;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = `text-xs mt-1 block ${isUser ? 'text-pink-200' : 'text-gray-400'}`;
    timeSpan.textContent = formatTime(new Date());

    bubble.appendChild(messageP);
    bubble.appendChild(timeSpan);
    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex justify-start typing-wrapper';
    wrapper.id = 'typingIndicator';
    
    const bubble = document.createElement('div');
    bubble.className = 'bot-msg max-w-lg rounded-2xl px-5 py-3 shadow-lg glass-effect typing-indicator flex items-center space-x-1';
    
    bubble.innerHTML = '<span></span><span></span><span></span>';
    
    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.remove();
    }
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    // Append User Message
    appendMessage(text, true);
    messageInput.value = '';

    // Show typing indicator
    setTimeout(() => {
      showTypingIndicator();
      
      // Send dummy response after 1 to 2 seconds
      const delay = Math.floor(Math.random() * 1000) + 1000;
      setTimeout(() => {
        removeTypingIndicator();
        const randIndex = Math.floor(Math.random() * dummyResponses.length);
        const reply = text.toLowerCase().includes('attendance') 
          ? "Your current attendance is 85%." 
          : dummyResponses[randIndex];
        
        appendMessage(reply, false);
      }, delay);
      
    }, 400); // short delay before showing typing
  });
});
