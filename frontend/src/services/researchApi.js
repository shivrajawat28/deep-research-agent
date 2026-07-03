const API_URL = import.meta.env.VITE_RESEARCH_API_URL ?? '/api/research';

function normalizeReportMarkdown(report) {
  return report
    .replace(/^\*\*(Introduction)\*\*/gim, '# $1')
    .replace(/^\*\*(Key Findings)\*\*/gim, '# $1')
    .replace(/^\*\*(Detailed Analysis)\*\*/gim, '# $1')
    .replace(/^\*\*(Summary Bullet Points)\*\*/gim, '# $1')
    .replace(/^\*\*(Conclusion)\*\*/gim, '# $1')
    .replace(/^\*\*(Sources)\*\*/gim, '# $1')
    .replace(/^\*\*(One Line Verdict)\*\*/gim, '# $1')
    .replace(/^\*\*(Score:.*?)\*\*/gim, '## $1')
    .replace(/^\*\*(Strengths)\*\*/gim, '## $1')
    .replace(/^\*\*(Areas to Improve)\*\*/gim, '## $1')
    .replace(/^\*\*(One line verdict)\*\*/gim, '## $1');
}

function buildDisplayReport(data) {
  const report = typeof data.report === 'string' ? data.report.trim() : '';
  const feedback = typeof data.feedback === 'string' ? data.feedback.trim() : '';
  const parts = [report];

  if (feedback) {
    parts.push(`# Critic Review\n\n${feedback}`);
  }

  return normalizeReportMarkdown(parts.filter(Boolean).join('\n\n'));
}

export async function fetchResearch(topic) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || 'Research request failed');
  }

  return {
    ...data,
    report: buildDisplayReport(data),
  };
}
