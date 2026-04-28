"use client";

import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! I am your friendly AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      // NOTE: Replace this URL with your actual separate service endpoint
      const API_URL = "https://agent-proxy-27679876328.us-central1.run.app/chat";

      const response = await fetch(API_URL, {
        method: "POST",
        // mode: 'no-cors',
        headers: {
          "Content-Type": "application/json",
          // 'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ query: userMessage }),
      });


      // Simple mock fallback if the endpoint doesn't exist yet for demonstration
      if (!response.ok) {
        throw new Error("Failed to connect to service. Using mock fallback.");
      }
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.reply.output || "No reply provided." }]);
    } catch (error) {
      console.warn(error);
      // Fallback response for UI demonstration if service is offline/unconfigured
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "I'm having trouble connecting to my backend right now, but this is what a response looks like!" }
        ]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Chatbot Assistant</h1>
        <p className="text-gray-600 mt-2">Powered by an external queried service.</p>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 text-gray-800 px-5 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center space-x-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full px-5 py-3.5 outline-none transition-colors"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 outline-none transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed shadow-md"
            >
              <PaperAirplaneIcon className="w-5 h-5 -rotate-45 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
