import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  const isSummaryContent = className.includes("summary-content");
  const isRiskContent = className.includes("risk-content");
  const shouldDisableLists = isSummaryContent || isRiskContent;

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={{
          // Customize paragraph styling
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
          ),
          // Style strong/bold text
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          // Style emphasis/italic text
          em: ({ children }) => (
            <em className="italic text-foreground">{children}</em>
          ),
          // Style unordered lists - disable for summary/risk content
          ul: ({ children }) =>
            shouldDisableLists ? (
              <div className="space-y-1">{children}</div>
            ) : (
              <ul className="list-disc list-inside space-y-1 ml-2">
                {children}
              </ul>
            ),
          // Style ordered lists - disable for summary/risk content
          ol: ({ children }) =>
            shouldDisableLists ? (
              <div className="space-y-1">{children}</div>
            ) : (
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {children}
              </ol>
            ),
          // Style list items - remove bullets for summary/risk content
          li: ({ children }) =>
            shouldDisableLists ? (
              <div className="text-foreground">{children}</div>
            ) : (
              <li className="text-foreground">{children}</li>
            ),
          // Style inline code
          code: ({ children }) => (
            <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-foreground">
              {children}
            </code>
          ),
          // Style code blocks
          pre: ({ children }) => (
            <pre className="bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto text-foreground">
              {children}
            </pre>
          ),
          // Style headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-2 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-2 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium mb-1 text-foreground">
              {children}
            </h3>
          ),
          // Style blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          // Style horizontal rules
          hr: () => <hr className="border-border my-4" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
