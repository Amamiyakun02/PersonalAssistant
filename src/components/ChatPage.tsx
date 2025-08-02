import { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import Message from "./Message";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = "Virtual Assistant CRISTINA";
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const user_id = "user123"; // Ganti dengan user ID dinamis jika ada
  const session_id = null; // Ganti dengan session ID aktif jika melanjutkan sesi

  const handleSend = async (text: string) => {
    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);

    const response = await fetch("https://amamiya-kun-ava.hf.space//chat_assistant", {
    // const response = await fetch("http://127.0.0.1:8000/chat_assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        session_id,
        messages: [userMessage],
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    const assistantMessageRef = useRef("");
    let buffer = "";

    // Interval untuk flush update ke UI
    const flushInterval = setInterval(() => {
      if (buffer.length === 0) return;

      assistantMessageRef.current += buffer;
      buffer = "";

      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? { ...msg, content: assistantMessageRef.current }
            : msg
        )
      );
    }, 50); // tiap 50ms

    while (reader) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const payload = JSON.parse(line.trim().replace(/^data:\s*/, ""));
          const newText = payload.text;
          buffer += newText;
        } catch (err) {
          console.warn("Gagal parse streaming chunk:", line, err);
        }
      }
    }

    // Akhiri streaming dan flush sisa buffer
    clearInterval(flushInterval);
    assistantMessageRef.current += buffer;

    setMessages((prev) =>
      prev.map((msg, i) =>
        i === prev.length - 1
          ? { ...msg, content: assistantMessageRef.current.trim() + "\n" }
          : msg
      )
    );
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <header className="p-4 border-b text-xl font-semibold text-center text-gray-700 bg-white shadow">
        CRISTINA ✨
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <Message
            key={idx}
            role={msg.role}
            content={msg.content}
            isMarkdown={true}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <footer className="p-4 border-t bg-white">
        <ChatInput onSend={handleSend} />
      </footer>
    </div>
  );
}
