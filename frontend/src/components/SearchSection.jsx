import { motion } from 'framer-motion';
import { ArrowUpRight, Loader2, Search } from 'lucide-react';
import { examplePrompts } from '../data/mockData';

export function SearchSection({ query, setQuery, onStart, disabled }) {
  const submit = (value = query) => {
    const nextQuery = value.trim();
    if (!nextQuery || disabled) return;
    onStart(nextQuery);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 }}
      className="mx-auto mt-12 w-full"
    >
      <div className="rounded-[1.6rem] bg-card p-2 shadow-soft">
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <label className="flex min-h-16 flex-1 items-center gap-3 rounded-[1.25rem] bg-background px-5">
            <Search className="h-5 w-5 shrink-0 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What would you like to research today?"
              className="min-w-0 flex-1 bg-transparent text-base text-text outline-none placeholder:text-muted"
            />
          </label>
          <button
            type="submit"
            disabled={!query.trim() || disabled}
            className="inline-flex min-h-16 items-center justify-center gap-2 rounded-[1.25rem] bg-primary px-7 text-sm font-semibold text-white shadow-button transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Search
            {disabled ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpRight className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {examplePrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => {
              setQuery(prompt);
              submit(prompt);
            }}
            disabled={disabled}
            className="rounded-full bg-card px-4 py-2 text-sm text-muted shadow-subtle transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {prompt}
          </button>
        ))}
      </div>
    </motion.section>
  );
}
