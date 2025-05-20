"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";
import ChatMessage from "../components/ChatMessage";
import { useMobile } from "../hooks/useMobile";
import { v4 as uuidv4 } from "uuid";

export default function ChatPage() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const isMobile = useMobile();
  const [websocket, setWebsocket] = useState(null);
  const userId = useRef(uuidv4());

  useEffect(() => {
    if (websocket) {
      websocket.onopen = () => {
        setConnected(true);
        setConnecting(false);
        setMessages((prev) => [
          ...prev,
          {
            id: "system-connected",
            text: "Conectado al servidor.",
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      };

      websocket.onmessage = (event) => {
        setMessages((prev) => [
          ...prev,
          {
            id: `server-${Date.now()}`,
            text: event.data,
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      };

      websocket.onclose = () => {
        setConnected(false);
        setMessages((prev) => [
          ...prev,
          {
            id: "system-disconnected",
            text: "Desconectado del servidor.",
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  }, [websocket]);

  const connectToServer = () => {
    setConnecting(true);
    setMessages([]);
    const ws = new WebSocket(`ws://taptalk.tech/ws/${userId.current}`);
    setWebsocket(ws);
  };

  const disconnectChat = () => {
    if (websocket) {
      websocket.close();
    }
  };

  const sendMessage = () => {
    if (inputValue.trim() === "" || !connected) return;

    const newMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(inputValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const findNewChat = () => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send("next");
      setMessages((prev) => [
        ...prev,
        {
          id: "system-next",
          text: "Buscando un nuevo compañero de chat...",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <MessageSquare className="h-6 w-6" />
            <span>TapTalk</span>
          </Link>
          <Link to="/">
            <button className="p-2 rounded-full hover:bg-zinc-100">
              <Home className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t pt-4">
          <div className="flex gap-2">
            {connected ? (
              <>
                <button
                  className="px-4 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                  onClick={disconnectChat}
                >
                  {isMobile ? <X className="h-4 w-4" /> : "Desconectar"}
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                  onClick={findNewChat}
                >
                  {isMobile ? <RefreshCw className="h-4 w-4" /> : "Nuevo Chat"}
                </button>
                <div className="flex-1 flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="Escribe un mensaje..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!connected}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!connected || inputValue.trim() === ""}
                    className="p-2 rounded-md bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                className="w-full px-4 py-2 rounded-md bg-black text-white font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={connectToServer}
                disabled={connecting}
              >
                {connecting ? "Conectando..." : "Nuevo Chat"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
