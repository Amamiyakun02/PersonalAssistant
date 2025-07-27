import { useState } from "react";

type Props = {
  onSend: (message: string) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      onSend(trimmed);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Tulis sesuatu..."
        className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Kirim
      </button>
    </form>
  );
}
