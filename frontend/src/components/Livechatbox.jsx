import React, { useState, useRef, useEffect } from 'react';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { serverUrl } from '../App';

const Livechatbox = ({ isStudent, courseId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
  function handleClickOutside(event) {
    // if chat is open and click is outside the chat window → close it
    if (isOpen && chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isOpen]);


  if (!isStudent) return null;

  const toggleChat = () => setIsOpen(prev => !prev);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Check for missing courseId
    if (!courseId) {
      setError('Course ID not found.');
      return;
    }

    // Unique cooldown key per course
    const storageKey = `chatbot_last_sent_${courseId}`;
    const lastSent = localStorage.getItem(storageKey);
    const now = Date.now();

    // 24-hour check (86,400,000 ms)
    if (lastSent && now - parseInt(lastSent, 10) < 24 * 60 * 60 * 1000) {
    //   toast.info('You can only send one message every 24 hours for this course.');
      return;
    }

    // Save new timestamp for this course
    localStorage.setItem(storageKey, now.toString());

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    // Add a placeholder for the bot’s response
    const botMessagePlaceholder = { sender: 'bot', text: '' };
    setMessages(prev => [...prev, botMessagePlaceholder]);

    try {
      const response = await fetch(`${serverUrl}/api/ai/techchat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: !done });

        const eventLines = chunk.split('\n\n').filter(line => line.trim());
        for (const line of eventLines) {
          if (line.startsWith('data:')) {
            const jsonData = line.substring(5);
            try {
              const parsedData = JSON.parse(jsonData);
              if (parsedData.error) {
                setError(parsedData.error);
                setMessages(prev => prev.slice(0, -1));
                setMessages(prev => [...prev, { sender: 'bot', text: parsedData.error }]);
                return;
              }
              if (parsedData.reply) {
                setMessages(prev =>
                  prev.map((msg, idx) =>
                    idx === prev.length - 1
                      ? { ...msg, text: msg.text + parsedData.reply }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error('Failed to parse stream data:', jsonData, e);
              setError('Failed to parse stream data.');
            }
          }
        }
      }
    } catch (err) {
      setError('Error: ' + err.message);
      setMessages(prev =>
        prev
          .slice(0, -1)
          .concat({ sender: 'bot', text: 'Sorry, there was an error processing your request.' })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => toast.success('Copied to clipboard!'))
        .catch(() => toast.error('Failed to copy!'));
    } else {
      toast.warn('Clipboard access is not available.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
  <>
    {/* Floating Chat Button */}
    {!isOpen && (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white text-2xl flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors duration-200 z-[9999]"
        aria-label="Open ChatBot"
      >
        💬
      </button>
    )}

    {/* Chat Window */}
    {isOpen && (
      <div
      ref={chatWindowRef}
      className="fixed bottom-6 right-6 w-96 h-[450px] bg-white shadow-2xl flex flex-col border border-gray-300 z-[9999] transition-all duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-green-600 text-white px-4 py-3 text-lg font-semibold">
          Live Chat
          <button
            onClick={toggleChat}
            className="text-2xl font-bold hover:text-gray-200 transition"
          >
            ×
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[85%]">
                <div
                  className={`px-3 py-2 text-sm break-words ${
                    msg.sender === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'bot' && msg.text && (
                  <button
                    onClick={() => handleCopy(msg.text)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaCopy />
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-500 text-sm">Loading...</div>}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-300 p-3 flex flex-col bg-white">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full resize-none p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm mb-2"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={`w-full py-2 font-semibold text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    )}
  </>
);
}

export default Livechatbox;
