import {
  Brain,
  FileText,
  PenLine,
  ScanSearch,
  ShieldCheck,
} from 'lucide-react';

export const examplePrompts = [
  'Latest AI Trends',
  'Quantum Computing',
  'Indian Startup Ecosystem',
  'Climate Change',
];

export const pipelineStages = [
  { title: 'Searching Web', icon: ScanSearch },
  { title: 'Reading Articles', icon: FileText },
  { title: 'Analyzing Information', icon: Brain },
  { title: 'Writing Report', icon: PenLine },
  { title: 'Reviewing Report', icon: ShieldCheck },
];
