import React, { useState, useEffect, useRef } from "react";
import './App.css'
export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080");
    socketRef.current.onmessage = e => setMessages(m => [...m, e.data]);
    return () => socketRef.current.close();
  }, []);
  const send = () => {
    if (input && socketRef.current.readyState === 1) {
      socketRef.current.send(input);
      setMessages(m => [...m, "You: " + input]);
      setInput("");
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 min-h-screen transition-all duration-500">
      <div className="w-80 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-white/20">
        <div className="text-center text-indigo-700 font-bold text-xl tracking-wide">
          Chat
        </div>
        <div className="h-48 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50/80 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
          {messages.map((msg, i) => {
            const isUser = msg.startsWith("You: ");
            return (
              <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-xs px-3 py-2 rounded-2xl shadow-sm text-sm ${isUser
                    ? 'bg-indigo-500 text-white self-end'
                    : 'bg-white text-gray-800 border border-gray-200 self-start'
                  }`}>
                  {msg}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a message..." />
          <button onClick={send} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">Send</button>
        </div>
      </div>
    </div>
  );
}