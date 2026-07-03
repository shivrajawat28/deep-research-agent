import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { LoadingState } from './components/LoadingState';
import { ProgressTimeline } from './components/ProgressTimeline';
import { ReportSection } from './components/ReportSection';
import { SearchSection } from './components/SearchSection';
import { SourcesGrid } from './components/SourcesGrid';
import { TypingIndicator } from './components/TypingIndicator';
import { pipelineStages } from './data/mockData';
import { fetchResearch } from './services/researchApi';

const stageDuration = 1400;

function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 flex w-full items-start gap-3 rounded-[1.25rem] bg-card p-5 text-left shadow-subtle"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
      <div>
        <p className="font-medium text-text">Research failed</p>
        <p className="mt-1 text-sm leading-6 text-muted">{message}</p>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [researching, setResearching] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [report, setReport] = useState('');
  const [sourceLinks, setSourceLinks] = useState([]);
  const [error, setError] = useState('');
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (!researching) return undefined;

    const interval = window.setInterval(() => {
      setActiveStage((stage) =>
        Math.min(stage + 1, pipelineStages.length - 1),
      );
    }, stageDuration);

    return () => window.clearInterval(interval);
  }, [researching, runId]);

  const hasReport = Boolean(report);

  const progress = useMemo(() => {
    if (hasReport) return 100;
    return Math.min(
      92,
      Math.round(((activeStage + 1) / pipelineStages.length) * 100),
    );
  }, [activeStage, hasReport]);

  const startResearch = async (nextQuery) => {
    const topic = nextQuery.trim();
    if (!topic || researching) return;

    setQuery(topic);
    setActiveStage(0);
    setReport('');
    setSourceLinks([]);
    setError('');
    setResearching(true);
    setRunId((id) => id + 1);

    try {
      const result = await fetchResearch(topic);
      setActiveStage(pipelineStages.length - 1);
      setReport(result.report || 'No report was returned by the research agent.');
      setSourceLinks(Array.isArray(result.sources) ? result.sources : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setActiveStage(0);
    } finally {
      setResearching(false);
    }
  };

  const showProgress = researching || hasReport;
  const writingReport =
    researching && pipelineStages[activeStage]?.title === 'Writing Report';

  return (
    <main className="min-h-screen bg-background px-4 py-12 font-sans text-text sm:px-6 sm:py-16">
      <div className="mx-auto flex w-full max-w-[900px] flex-col items-center">
        <Header />
        <SearchSection
          query={query}
          setQuery={setQuery}
          onStart={startResearch}
          disabled={researching}
        />

        <ErrorMessage message={error} />

        <AnimatePresence mode="wait">
          {showProgress && (
            <motion.div
              key={runId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-16 flex w-full flex-col gap-12"
            >
              {researching && (
                <LoadingState activeStage={activeStage} progress={progress} />
              )}
              <ProgressTimeline activeStage={activeStage} complete={hasReport} />
              {writingReport && <TypingIndicator />}
              {hasReport && (
                <>
                  <ReportSection markdown={report} />
                  <SourcesGrid items={sourceLinks} />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
