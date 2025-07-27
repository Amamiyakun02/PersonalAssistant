import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  role: "user" | "assistant";
  content: string;
};

export default function Message({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div className={`p-3 rounded-xl shadow ${isUser ? "bg-blue-100 text-right" : "bg-gray-100 text-left"}`}>
      <div className={`font-bold mb-1 ${isUser ? "text-blue-600" : "text-purple-600"}`}>
        {isUser ? "You" : "Cristina"}
      </div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="whitespace-pre-wrap">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
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
    </div>
  );
}
