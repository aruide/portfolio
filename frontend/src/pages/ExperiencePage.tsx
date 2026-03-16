import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, GraduationCap, Calendar, ArrowRight } from 'lucide-react';

import { useExperiences } from '@/hooks/useExperiences';
import type { ExperienceEntry } from '@/types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

function getImageUrl(item: ExperienceEntry): string | null {
  if (!item.image?.url) return null;
  return item.image.url.startsWith('http') ? item.image.url : `${API_URL}${item.image.url}`;
}

// ─── Carte ────────────────────────────────────────────────────────────────────

function ExperienceCard({
  item,
  index,
  onClick,
}: {
  item: ExperienceEntry;
  index: number;
  onClick: () => void;
}) {
  const imageUrl = getImageUrl(item);
  const isEven = index % 2 === 0;

  const card = (
    <div
      onClick={onClick}
      className="glass-effect rounded-xl overflow-hidden cursor-pointer group hover:glow-effect transition-all duration-300 border border-transparent hover:border-primary/30"
    >
      {/* Image bannière */}
      <div className="w-full h-32 bg-primary/5 overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.nom_etablissement}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {item.type === 'entreprise'
              ? <Building2 className="w-10 h-10 text-primary/20" />
              : <GraduationCap className="w-10 h-10 text-primary/20" />
            }
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
      </div>

      {/* Contenu */}
      <div className="p-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${
          item.type === 'entreprise'
            ? 'bg-blue-500/10 text-blue-400'
            : 'bg-violet-500/10 text-violet-400'
        }`}>
          {item.type === 'entreprise'
            ? <><Building2 className="w-3 h-3" /> Entreprise</>
            : <><GraduationCap className="w-3 h-3" /> Diplôme</>
          }
        </span>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground mb-1">{item.intitule}</h3>
            <p className="text-primary text-sm font-medium">{item.nom_etablissement}</p>
            <div className="flex items-center gap-1.5 text-xs text-foreground/50 mt-1.5">
              <Calendar className="w-3 h-3 shrink-0" />
              {formatDate(item.date_debut)} —{' '}
              {item.date_fin
                ? formatDate(item.date_fin)
                : <span className="text-green-400 font-medium">En cours</span>
              }
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="flex items-center mb-12 last:mb-0"
    >
      {/* Gauche */}
      <div className="flex-1 pr-8">{isEven ? card : null}</div>

      {/* Point central — toujours au centre */}
      <div className="w-4 h-4 bg-primary rounded-full relative z-10 shrink-0">
        <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-40" />
      </div>

      {/* Droite */}
      <div className="flex-1 pl-8">{!isEven ? card : null}</div>
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

const ExperiencePage = () => {
  const { data, loading, error } = useExperiences();
  const navigate = useNavigate();

  return (
    <section id="expérience" className="py-20">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Expériences</span> & Formations
          </h1>
          <p className="text-foreground/60 text-sm">Cliquez sur une carte pour voir les détails</p>
        </motion.div>

        {loading && (
          <div className="max-w-4xl mx-auto space-y-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center mb-12">
                <div className="flex-1 glass-effect rounded-xl h-44 animate-pulse pr-8" />
                <div className="w-4 h-4 bg-primary/20 rounded-full mx-4 shrink-0" />
                <div className="flex-1" />
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-center text-destructive">{error}</p>}

        {!loading && !error && (
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 -translate-x-1/2" />
            {data.map((item, index) => (
              <ExperienceCard
                key={item.documentId}
                item={item}
                index={index}
                onClick={() => navigate(`/experience/${item.documentId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperiencePage;
