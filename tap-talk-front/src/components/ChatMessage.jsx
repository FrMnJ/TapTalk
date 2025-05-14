export default function ChatMessage({ message }) {
  const isSystem = message.id.startsWith("system")

  if (isSystem) {
    return <div className="py-2 px-3 rounded bg-zinc-100 text-center text-sm text-zinc-600">{message.text}</div>
  }

  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-lg ${
          message.isUser ? "bg-black text-white rounded-br-none" : "bg-zinc-100 rounded-bl-none"
        }`}
      >
        <div className="text-sm">{message.text}</div>
        <div className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  )
}
