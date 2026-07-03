import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { pipelineStages } from '../data/mockData';

export function LoadingState({ activeStage, progress }) {
  const activeTitle = pipelineStages[activeStage]?.title ?? 'Finishing report';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex w-full flex-col items-center text-center"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <h2 className="mt-4 text-xl font-semibold text-text">Researching...</h2>
      <p className="mt-2 text-sm text-muted">{activeTitle}</p>
      <div className="mt-5 h-2 w-full max-w-md overflow-hidden rounded-full bg-card">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35 }}
          className="h-full rounded-full bg-primary"
        />
      </div>
    </motion.div>
  );
}
