import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

// Les liens s'ouvrent dans un nouvel onglet, les tableaux défilent
// horizontalement au lieu de déborder de la bulle.
const components = {
    a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    ),
    table: ({ children }) => (
        <div className="md-table-wrap">
            <table>{children}</table>
        </div>
    ),
};

export default function MarkdownContent({ content, isStreaming = false }) {
    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={components}
            >
                {content}
            </ReactMarkdown>
            {isStreaming && (
                <span className="inline-block w-2 ml-0.5 animate-pulse">▊</span>
            )}
        </div>
    );
}
