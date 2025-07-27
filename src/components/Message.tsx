// Message.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "plaintext";

              return !inline ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={language}
                  PreTag="div"
                  customStyle={{
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    fontSize: "0.875rem",
                    backgroundColor: "#1e1e1e",
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-200 p-1 rounded text-sm">{children}</code>
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
