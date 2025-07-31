// ChatPage.tsx
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
  const handleSend = async (text: string) => {
    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    // Langsung tampilkan placeholder assistant kosong
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const response = await fetch("http://127.0.0.1:8000/streamtext", {
      method: "POST",
      body: JSON.stringify({
        messages: [userMessage], // ✅ Kirim hanya pesan terakhir
      }),
      headers: { "Content-Type": "application/json" },
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    let assistantMessage = "";

    while (reader) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const payload = JSON.parse(line.trim().replace(/^data:\s*/, ""));
          assistantMessage += payload.text;

          setMessages((prev) =>
            prev.map((msg, i) =>
              i === prev.length - 1
                ? { ...msg, content: assistantMessage }
                : msg
            )
          );
        } catch (err) {
          console.warn("Gagal parse streaming chunk:", line, err);
        }
      }
    }
    // Tandai akhir streaming agar blok markdown bisa diproses
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === prev.length - 1
          ? { ...msg, content: assistantMessage + "\n" }
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
