import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface RichTextProps {
  /** Markdown + LaTeX string to render.
   *  Inline math: $x^2$   Block math: $$\int_a^b f(x)\,dx$$
   *  Inline images: ![alt](url)   Tables, bold, lists: standard markdown.
   */
  content: string;
  /** Additional class names on the wrapper div */
  className?: string;
  /** Use 'inline' for option text — suppresses block-level margins */
  variant?: "block" | "inline";
}

/**
 * Renders Markdown + LaTeX (KaTeX) content for questions, options, passages,
 * and explanations. Requires `katex/dist/katex.min.css` to be imported globally
 * (already done in globals.css).
 */
export function RichText({
  content,
  className,
  variant = "block",
}: RichTextProps) {
  return (
    <div
      className={cn(
        // Base prose-like styles without depending on @tailwindcss/typography
        "text-inherit leading-relaxed",
        variant === "block" && [
          "[&_p]:mb-3 [&_p:last-child]:mb-0",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3",
          "[&_li]:mb-1",
          "[&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_table]:mb-3",
          "[&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
          "[&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2",
          "[&_tr:nth-child(even)]:bg-gray-50",
          "[&_strong]:font-semibold",
          "[&_em]:italic",
          "[&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:pl-4 [&_blockquote]:text-gray-600 [&_blockquote]:italic [&_blockquote]:mb-3",
          "[&_img]:max-w-full [&_img]:max-h-72 [&_img]:object-contain [&_img]:rounded-lg [&_img]:my-3 [&_img]:block",
          // KaTeX block math — add spacing
          "[&_.katex-display]:my-4 [&_.katex-display]:overflow-x-auto",
        ],
        variant === "inline" && [
          // Inline variant — no extra margins, just render the content flat
          "[&_p]:inline [&_p]:m-0",
          "[&_.katex-display]:my-1 [&_.katex-display]:overflow-x-auto",
          "[&_img]:max-w-full [&_img]:max-h-40 [&_img]:object-contain [&_img]:rounded [&_img]:block",
        ],
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[
          [remarkMath, { singleDollarTextMath: true }],
          remarkGfm,
        ]}
        rehypePlugins={[[rehypeKatex, { strict: false }]]}
        components={{
          img: ({ src, alt }) =>
            src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt ?? ""} />
            ) : null,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
