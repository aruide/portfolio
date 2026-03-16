import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

/**
 * Résout dynamiquement une icône depuis son nom de bibliothèque et son nom d'icône.
 * Bibliothèques supportées : "lucide"
 *
 * @example resolveIcon("lucide", "Lightbulb") → LightbulbIcon
 */
export function resolveIcon(library: string | null, name: string | null): LucideIcon | null {
  if (!library || !name) return null;

  if (library.toLowerCase() === 'lucide') {
    const icon = (LucideIcons as Record<string, unknown>)[name];
    if (typeof icon === 'function') return icon as LucideIcon;
  }

  return null;
}
