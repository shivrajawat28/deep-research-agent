import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export function SourcesGrid({ items }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="w-full"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-primary">
          <ExternalLink className="h-4 w-4" />
        </span>
        <h2 className="text-lg font-semibold text-text">Sources</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((source) => (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="group rounded-[1.25rem] bg-card p-5 text-left shadow-subtle transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-primary">
                  {source.site}
                </p>
                <h3 className="mt-2 text-sm font-medium leading-6 text-text">
                  {source.title}
                </h3>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted transition group-hover:text-text" />
            </div>
            <span className="mt-5 inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-button transition group-hover:bg-blue-500">
              Open
            </span>
          </a>
        ))}
      </div>
    </motion.section>
  );
}
