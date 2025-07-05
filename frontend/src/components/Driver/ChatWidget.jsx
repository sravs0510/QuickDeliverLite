import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { MessageSquare, Send, X } from 'lucide-react';

const socket = io('http://localhost:5000'); // Adjust if needed

const ChatWidget = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userName) return;

    socket.emit("registerUser", { userEmail: userName, role: "driver" });

    const handleReceive = (msg) => {
      setMessages(prev => [...prev, msg]);

      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleHistory = (history) => {
      setMessages(history);
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("messageHistory", handleHistory);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("messageHistory", handleHistory);
    };
  }, [userName, isOpen]);

  useEffect(() => {
    if (isOpen && userName) {
      socket.emit("getMessageHistory", { user1: userName, user2: "admin@quick.com" });
      setUnreadCount(0);
    }
  }, [isOpen, userName]);

  const handleSend = () => {
    if (message.trim()) {
      const msgObj = {
        from: userName,
        to: "admin@quick.com",
        text: message,
        timestamp: new Date(),
      };
      socket.emit('sendMessage', msgObj);
      setMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Floating Chat Button with Notification */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-blue-600 p-4 text-white rounded-full shadow-lg hover:bg-blue-700"
          >
            <MessageSquare className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white border shadow-xl rounded-xl flex flex-col z-50">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-t-xl">
          <p className="font-semibold">Driver Support Chat</p>
          <X onClick={() => setIsOpen(false)} className="cursor-pointer" />
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-3 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[75%] shadow ${
                  msg.from === userName
                    ? 'bg-blue-100 self-end ml-auto text-right'
                    : 'bg-gray-200 self-start text-left'
                }`}
              >
                <div className="font-semibold text-gray-700">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2 flex gap-2 border-t bg-white">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border rounded px-3 py-1 text-sm focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
