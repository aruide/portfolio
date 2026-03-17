import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as DiIcons from 'react-icons/di';
import * as BsIcons from 'react-icons/bs';

type IconComponent = React.ComponentType<{ className?: string; size?: number }>;

const ALL_ICONS: Record<string, unknown> = {
  ...LucideIcons,
  ...FaIcons,
  ...SiIcons,
  ...DiIcons,
  ...BsIcons,
};

export function resolveIcon(library: string | null, name: string | null): IconComponent | null {
  const candidates = [name, library].filter(Boolean) as string[];
  for (const candidate of candidates) {
    const Icon = ALL_ICONS[candidate] as IconComponent | undefined;
    if (Icon) return Icon;
    const formatted = candidate.charAt(0).toUpperCase() + candidate.slice(1);
    const Icon2 = ALL_ICONS[formatted] as IconComponent | undefined;
    if (Icon2) return Icon2;
  }
  return null;
}
