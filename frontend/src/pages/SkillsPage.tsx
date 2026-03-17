import { motion } from 'framer-motion';
import { Star, Info, Code } from 'lucide-react';
import { resolveIcon } from '@/lib/icon-resolver';
import { useCompetences } from '@/hooks/useCompetences';
import type { CompetenceEntry } from '@/types';

type IconComponent = React.ComponentType<{ className?: string; size?: number }>;
const FallbackIcon: IconComponent = Code;

// ─── Étoiles de niveau ────────────────────────────────────────────────────────

function StarRating({ note }: { note: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= note ? 'text-primary fill-primary' : 'text-foreground/20 fill-transparent'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Carte compétence ─────────────────────────────────────────────────────────

function CompetenceCard({ item, index }: { item: CompetenceEntry; index: number }) {
  const Icon = resolveIcon(item.library_icon, item.icon) ?? FallbackIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="glass-effect rounded-xl p-4 flex items-center gap-4 hover:glow-effect transition-all duration-300"
    >
      <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate">{item.title}</p>
        <StarRating note={item.note} />
      </div>
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

const SkillsPage = () => {
  const { data, loading, error } = useCompetences();

  // Grouper par type_competence
  const grouped = data.reduce<Record<string, CompetenceEntry[]>>((acc, item) => {
    const key = item.type_competence ?? 'Autre';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <section id="compétences" className="py-20 bg-card/50">
      <div className="container mx-auto px-6">

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-6">
            <span className="gradient-text">Compétences</span> Techniques
          </h1>
        </motion.div>

        {/* Avertissement étoiles */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-start gap-3 max-w-xl mx-auto mb-14 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 text-sm text-foreground/70"
        >
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>
            Les étoiles (<Star className="inline w-3 h-3 text-primary fill-primary" />{' '}
            <Star className="inline w-3 h-3 text-primary fill-primary" />{' '}
            <Star className="inline w-3 h-3 text-foreground/20" />) indiquent mon niveau d'aisance
            avec la compétence, de débutant (1) à très à l'aise (3).
          </span>
        </motion.div>

        {/* États loading / error */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="glass-effect rounded-xl p-4 h-16 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-destructive">{error}</p>
        )}

        {/* Groupes de compétences */}
        {!loading && !error && (
          <div className="space-y-12">
            {Object.entries(grouped).map(([type, items], groupIndex) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                <h2 className="text-xl font-bold text-foreground/60 uppercase tracking-widest mb-4 border-b border-primary/10 pb-2">
                  {type}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {items.map((item, i) => (
                    <CompetenceCard key={item.documentId} item={item} index={i} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsPage;
