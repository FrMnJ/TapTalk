"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, Send, X, RefreshCw, Home } from "lucide-react"
import { Link } from "react-router-dom"
import ChatMessage from "../components/ChatMessage"
import { useMobile } from "../hooks/useMobile"

export default function ChatPage() {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef(null)
  const isMobile = useMobile()

  // Simular conexión con un extraño
  useEffect(() => {
    if (connecting) {
      const timer = setTimeout(() => {
        setConnected(true)
        setConnecting(false)
        setMessages([
          {
            id: "system-1",
            text: "Te has conectado con un extraño. ¡Di hola!",
            isUser: false,
            timestamp: new Date(),
          },
        ])
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [connecting])

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const connectToStranger = () => {
    setConnected(false)
    setConnecting(true)
    setMessages([])
  }

  const disconnectChat = () => {
    setConnected(false)
    setMessages([
      {
        id: "system-disconnect",
        text: "Te has desconectado. Haz clic en 'Nuevo Chat' para hablar con otro extraño.",
        isUser: false,
        timestamp: new Date(),
      },
    ])
  }

  const sendMessage = () => {
    if (inputValue.trim() === "" || !connected) return

    // Agregar mensaje del usuario
    const newMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    // Simular respuesta del extraño después de un tiempo aleatorio
    setTimeout(
      () => {
        const responses = [
          "Hola, ¿cómo estás?",
          "Interesante, cuéntame más.",
          "¿De dónde eres?",
          "¿Qué te gusta hacer en tu tiempo libre?",
          "Jaja, eso es divertido.",
          "No estoy seguro de entender.",
          "¿Cuál es tu película favorita?",
          "Estoy de acuerdo contigo.",
          "¿Qué opinas sobre este sitio?",
          "Tengo que irme pronto, pero ha sido agradable hablar contigo.",
        ]

        const strangerMessage = {
          id: `stranger-${Date.now()}`,
          text: responses[Math.floor(Math.random() * responses.length)],
          isUser: false,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, strangerMessage])
      },
      1000 + Math.random() * 2000,
    )
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

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
          {messages.length === 0 && !connecting && (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <MessageSquare className="h-12 w-12 mb-4 text-zinc-400" />
              <h2 className="text-xl font-semibold mb-2">Bienvenido a TapTalk</h2>
              <p className="text-zinc-500 max-w-md mb-6">
                Haz clic en "Nuevo Chat" para conectarte con un extraño y comenzar a chatear.
              </p>
            </div>
          )}

          {connecting && (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <RefreshCw className="h-12 w-12 mb-4 text-zinc-400 animate-spin" />
              <h2 className="text-xl font-semibold mb-2">Conectando...</h2>
              <p className="text-zinc-500">Buscando a alguien con quien chatear...</p>
            </div>
          )}

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
                onClick={connectToStranger}
                disabled={connecting}
              >
                {connecting ? "Conectando..." : "Nuevo Chat"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
