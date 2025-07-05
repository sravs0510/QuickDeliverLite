// 🚀 Upgraded Admin Chat Panel with Customer & Driver Support + Notification Counts + UI Enhancements
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Send, UserCheck, User2 } from "lucide-react";

const socket = io("http://localhost:5000");

const AdminChatPanel = ({ onUnreadCountChange }) => {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [unseenCounts, setUnseenCounts] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("registerUser", { userEmail: "admin@quick.com", role: "admin" });
    socket.emit("getMessageHistory", { user1: "admin@quick.com", user2: null });

    socket.on("messageHistory", (history) => {
      const users = new Map();
      history.forEach((msg) => {
        const peer = msg.from === "admin@quick.com" ? msg.to : msg.from;
        const role = peer.includes("driver") ? "driver" : "customer"; // Simple logic
        users.set(peer, role);
      });
      setUserList(Array.from(users.entries()));
    });

    return () => {
      socket.off("messageHistory");
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      socket.emit("getMessageHistory", {
        user1: "admin@quick.com",
        user2: selectedUser,
      });

      socket.on("messageHistory", (history) => {
        setMessages(history);
      });

      setUnseenCounts((prev) => {
        const updated = { ...prev, [selectedUser]: 0 };
        onUnreadCountChange &&
          onUnreadCountChange(Object.values(updated).reduce((a, b) => a + b, 0));
        return updated;
      });
    }

    return () => {
      socket.off("messageHistory");
    };
  }, [selectedUser]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      const sender = msg.from;

      if (sender !== "admin@quick.com") {
        const role = sender.includes("driver") ? "driver" : "customer";
        setUserList((prev) => {
          const updated = new Map(prev);
          if (!updated.has(sender)) updated.set(sender, role);
          return Array.from(updated.entries());
        });

        if (selectedUser === sender) {
          setMessages((prev) => [...prev, msg]);
        } else {
          setUnseenCounts((prev) => {
            const updated = { ...prev, [sender]: (prev[sender] || 0) + 1 };
            onUnreadCountChange &&
              onUnreadCountChange(Object.values(updated).reduce((a, b) => a + b, 0));
            return updated;
          });
        }
      } else {
        if (selectedUser && msg.to === selectedUser) {
          setMessages((prev) => [...prev, msg]);
        }
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedUser]);

  const handleSend = () => {
    if (msgInput.trim() && selectedUser) {
      const newMsg = {
        from: "admin@quick.com",
        to: selectedUser,
        text: msgInput,
      };
      socket.emit("sendMessage", newMsg);
      setMsgInput("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-[500px] border rounded-xl overflow-hidden shadow-xl bg-white">
      <div className="w-1/3 border-r bg-gray-50">
        <h2 className="p-3 font-semibold text-lg border-b">Users</h2>
        <ul>
          {
            userList.map(([user, role], idx) => (
              <li
                key={idx}
                onClick={() => {
                  setSelectedUser(user);
                  setMessages([]);
                }}
                className={`
                  flex items-center justify-between p-3 cursor-pointer hover:bg-indigo-100
                  ${selectedUser === user ? "bg-indigo-200" : ""}
                `}
              >
                <span className="flex items-center gap-2">
                  { role === "driver" ? <UserCheck className="w-4 h-4 text-green-600" /> : <User2 className="w-4 h-4 text-blue-600" /> }
                  {user}
                </span>
                {
                  unseenCounts[user] > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unseenCounts[user]}
                    </span>
                  )
                }
              </li>
            ))
          }
        </ul>
      </div>

      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="p-3 border-b font-semibold bg-white shadow">Chat with: {selectedUser || "Select a user"}</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`
                  p-2 rounded-lg max-w-xs shadow
                  ${msg.from === "admin@quick.com" ? "bg-blue-200 self-end ml-auto" : "bg-white"}
                `}
              >
                <div className="text-sm">{msg.text}</div>
              </div>
            ))
          }
          <div ref={messagesEndRef} />
        </div>
        <div className="p-2 border-t flex gap-2 bg-white">
          <input
            className="flex-1 border rounded px-3 py-1 text-sm"
            placeholder="Type a message..."
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChatPanel;