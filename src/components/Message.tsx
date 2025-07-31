import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard, ClipboardCheck } from "lucide-react";

type Props = {
  role: "user" | "assistant";
  content: string;
  isMarkdown?: boolean;
};

export default function Message({ role, content, isMarkdown = false }: Props) {
  const isUser = role === "user";

  return (
    <div
      className={`p-3 rounded-xl shadow ${
        isUser ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
      }`}
    >
      <div
        className={`font-bold mb-1 ${
          isUser ? "text-blue-600" : "text-purple-600"
        }`}
      >
        {isUser ? "You" : "Cristina"}
      </div>

      {isMarkdown ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p({ children }) {
              return <div className="whitespace-pre-wrap">{children}</div>;
            },
            strong({ children }) {
              return <strong className="font-semibold">{children}</strong>;
            },
            ol({ children }) {
              return <ol className="list-decimal list-inside pl-4 my-2">{children}</ol>;
            },
            ul({ children }) {
              return <ul className="list-disc list-inside pl-4 my-2">{children}</ul>;
            },
            li({ children }) {
              return <li className="mb-1">{children}</li>;
            },
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : null;

              if (!inline && language) {
                const codeText = String(children).replace(/\n$/, "");
                const [copied, setCopied] = useState(false);

                const handleCopy = () => {
                  navigator.clipboard.writeText(codeText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                };

                return (
                  <div className="relative my-2 group">
                    {/* Label bahasa */}
                    <div className="absolute top-1 left-2 text-xs text-gray-400 font-mono capitalize">
                      {language}
                    </div>

                    {/* Tombol copy */}
                    <button
                      onClick={handleCopy}
                      className="absolute top-1 right-2 text-gray-400 hover:text-white text-xs bg-transparent p-1"
                    >
                      {copied ? <ClipboardCheck size={14} /> : <Clipboard size={14} />}
                    </button>

                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={language}
                      PreTag="div"
                      customStyle={{
                        borderRadius: "0.5rem",
                        padding: "1.5rem 1rem 1rem 1rem",
                        fontSize: "0.875rem",
                        backgroundColor: "#1e1e1e",
                      }}
                      {...props}
                    >
                      {codeText}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              // Inline code
              return (
                <code className="bg-gray-200 px-1 py-0.5 rounded text-sm text-[#333] font-mono">
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      ) : (
        <p className="whitespace-pre-wrap">{content}</p>
      )}
    </div>
  );
}
