import { Brain, Code, Database, Cpu, Zap, Target } from 'lucide-react';
import type { Skill } from '@/types';

export const skillsData: Skill[] = [
  { name: 'Machine Learning', icon: Brain, level: 95 },
  { name: 'Deep Learning', icon: Cpu, level: 90 },
  { name: 'Python', icon: Code, level: 95 },
  { name: 'TensorFlow', icon: Database, level: 85 },
  { name: 'PyTorch', icon: Zap, level: 88 },
  { name: 'Computer Vision', icon: Target, level: 82 },
];
