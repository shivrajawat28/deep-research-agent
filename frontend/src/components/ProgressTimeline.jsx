import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { pipelineStages } from '../data/mockData';

function StepIcon({ complete, active, Icon }) {
  if (complete) {
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="grid h-8 w-8 place-items-center rounded-full bg-success text-background"
      >
        <Check className="h-4 w-4" />
      </motion.span>
    );
  }

  if (active) {
    return (
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-primary">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    );
  }

  return (
    <span className="grid h-8 w-8 place-items-center rounded-full bg-card text-muted">
      <Icon className="h-4 w-4" />
    </span>
  );
}

export function ProgressTimeline({ activeStage, complete }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="space-y-5">
        {pipelineStages.map((stage, index) => {
          const isComplete = complete || index < activeStage;
          const isActive = !complete && index === activeStage;
          const isLast = index === pipelineStages.length - 1;
          const status = isComplete
            ? 'Completed'
            : isActive
              ? 'In Progress'
              : 'Waiting...';

          return (
            <div key={stage.title} className="relative flex gap-4">
              {!isLast && (
                <span className="absolute left-4 top-10 h-8 w-px bg-card" />
              )}
              <StepIcon
                complete={isComplete}
                active={isActive}
                Icon={stage.icon}
              />
              <div className="min-w-0 pt-0.5">
                <p className="text-base font-medium text-text">{stage.title}</p>
                <p
                  className={`mt-1 text-sm ${
                    isComplete
                      ? 'text-success'
                      : isActive
                        ? 'text-primary'
                        : 'text-muted'
                  }`}
                >
                  {status}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
