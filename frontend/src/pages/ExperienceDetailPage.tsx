import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Building2, GraduationCap } from 'lucide-react';
import type { ExperienceEntry, StrapiCollectionResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';
const API_TOKEN = import.meta.env.VITE_API_TOKEN as string | undefined;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const ExperienceDetailPage = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ExperienceEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) return;
    const controller = new AbortController();

    fetch(
      `${API_URL}/api/experiences?filters[documentId][$eq]=${documentId}&populate=*&pagination[limit]=1`,
      {
        signal: controller.signal,
        headers: API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {},
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json() as Promise<StrapiCollectionResponse<ExperienceEntry>>;
      })
      .then((json) => {
        if (json.data.length === 0) throw new Error('Expérience introuvable');
        setItem(json.data[0]);
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [documentId]);

  const imageUrl = item?.image?.url
    ? item.image.url.startsWith('http')
      ? item.image.url
      : `${API_URL}${item.image.url}`
    : null;

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6 max-w-3xl">

        {/* Bouton retour */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour aux expériences
        </motion.button>

        {/* Loading */}
        {loading && (
          <div className="glass-effect rounded-2xl p-8 animate-pulse space-y-4">
            <div className="h-8 bg-foreground/10 rounded w-2/3" />
            <div className="h-4 bg-foreground/10 rounded w-1/3" />
            <div className="h-48 bg-foreground/10 rounded" />
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-3 bg-foreground/10 rounded" />
              ))}
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="glass-effect rounded-2xl p-8 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button onClick={() => navigate('/experience')} className="text-primary hover:underline">
              Retour à la liste
            </button>
          </div>
        )}

        {/* Contenu */}
        {!loading && !error && item && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl overflow-hidden"
          >
            {/* Image en bannière */}
            {imageUrl && (
              <div className="w-full h-48 overflow-hidden bg-primary/5">
                <img
                  src={imageUrl}
                  alt={item.nom_etablissement}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            )}

            <div className="p-8">
              {/* Badge type */}
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-4 ${
                  item.type === 'entreprise'
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-violet-500/10 text-violet-400'
                }`}
              >
                {item.type === 'entreprise' ? (
                  <Building2 className="w-3.5 h-3.5" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5" />
                )}
                {item.type === 'entreprise' ? 'Entreprise' : 'Formation'}
              </span>

              {/* Titre */}
              <h1 className="text-3xl font-bold text-foreground mb-2">{item.intitule}</h1>
              <p className="text-primary text-lg font-medium mb-4">{item.nom_etablissement}</p>

              {/* Dates */}
              <div className="flex items-center gap-2 text-foreground/50 text-sm mb-8 pb-8 border-b border-primary/10">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(item.date_debut)} —{' '}
                  {item.date_fin ? (
                    formatDate(item.date_fin)
                  ) : (
                    <span className="text-green-400 font-medium">En cours</span>
                  )}
                </span>
              </div>

              {/* Description */}
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExperienceDetailPage;
