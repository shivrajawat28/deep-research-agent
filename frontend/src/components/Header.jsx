import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="text-center"
    >
      <h1 className="text-4xl font-semibold tracking-normal text-text sm:text-5xl">
        Deep Research AI
      </h1>
      <p className="mt-3 text-base text-muted sm:text-lg">
        AI-powered autonomous research assistant
      </p>
    </motion.header>
  );
}
