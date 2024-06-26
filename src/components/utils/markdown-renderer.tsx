import DOMPurify from "dompurify";
import Markdown, { ReactRenderer } from "marked-react";

type CustomReactRenderer = Partial<ReactRenderer>;

const renderer: CustomReactRenderer = {
  blockquote(text: string) {
    return (
      <blockquote className="mt-6 border-l-2 pl-6 italic">{text}</blockquote>
    );
  },
  heading(text: string, level: number) {
    switch (level) {
      case 1:
        return (
          <h1
            className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl`}
          >
            {text}
          </h1>
        );
      case 2:
        return (
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            {text}
          </h2>
        );
      default:
        return (
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            {text}
          </h3>
        );
    }
  },
  image(src: string, alt: string) {
    return <img src={src} alt={alt} />;
  },
  link(href: string, text: string) {
    return (
      <a
        href={href}
        className="font-medium text-primary underline underline-offset-4"
      >
        {text}
      </a>
    );
  },
  paragraph(text: string) {
    return <p className="leading-7">{text}</p>;
  },
  strong(text: string) {
    return <strong className="font-semibold">{text}</strong>;
  },
  table: (children) => {
    return <table className="w-full">{children}</table>;
  },
  tableHeader: (children) => {
    return <thead>{children}</thead>;
  },
  tableBody: (children) => {
    return <tbody>{children}</tbody>;
  },
  tableRow: (children) => {
    return <tr className="m-0 border-t p-0 even:bg-muted">{children}</tr>;
  },
  tableCell: (children) => {
    return (
      <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </th>
    );
  },
};

export interface MarkdownRendererProps {
  children: string;
}

export default function MarkdownRenderer({ children }: MarkdownRendererProps) {
  const sanitized = DOMPurify.sanitize(children);
  return <Markdown value={sanitized} renderer={renderer} />;
}
