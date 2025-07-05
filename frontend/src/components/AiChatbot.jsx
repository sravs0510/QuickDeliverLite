import React, { useState } from 'react';

const AiChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Server error. Please try again.' }]);
    }

    setInput('');
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-xl shadow-lg w-[300px] z-50">
      <div className="bg-indigo-600 text-white p-3 rounded-t-xl">🤖 QuickDeliverLite Bot</div>
      <div className="p-3 h-64 overflow-y-auto text-sm space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`text-${msg.from === 'user' ? 'right' : 'left'}`}>
            <div className={`inline-block px-3 py-1 rounded-lg ${msg.from === 'user' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-left text-gray-400">Typing...</div>}
      </div>
      <div className="flex border-t p-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 text-sm px-2 outline-none"
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="text-indigo-600 font-bold px-2">Send</button>
      </div>
    </div>
  );
};

export default AiChatbot;
