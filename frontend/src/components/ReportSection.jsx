import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function ReportSection({ markdown }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.5rem] bg-card p-6 text-left shadow-soft sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary">
          <FileText className="h-4 w-4" />
        </span>
        <h2 className="text-xl font-semibold text-text">Research Report</h2>
      </div>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mt-8 text-2xl font-semibold text-text first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-7 text-xl font-semibold text-text">{children}</h2>
          ),
          p: ({ children }) => (
            <p className="mt-3 text-base leading-8 text-slate-300">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mt-4 space-y-3 pl-5 text-slate-300">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="list-disc leading-7 marker:text-primary">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-text">{children}</strong>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </motion.section>
  );
}
