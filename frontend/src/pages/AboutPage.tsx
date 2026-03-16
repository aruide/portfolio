import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAboutpage } from '@/hooks/useAboutpage';
import { resolveIcon } from '@/lib/icon-resolver';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';

/** Résout l'URL d'une image Strapi (relative → absolue) */
function strapiImageUrl(url: string): string {
  return url.startsWith('http') ? url : `${API_URL}${url}`;
}

const AboutPage = () => {
  const { data, loading, error } = useAboutpage();
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reconstruit le tableau des 3 valeurs depuis les champs plats de Strapi
  const values = data
    ? [
        {
          title: data.first_title_values,
          description: data.first_description_values,
          icon: resolveIcon(data.first_library_logo_values, data.first_logo_values) ?? Sparkles,
        },
        {
          title: data.second_title_values,
          description: data.second_description_values,
          icon: resolveIcon(data.second_library_logo_values, data.second_logo_values) ?? Sparkles,
        },
        {
          title: data.third_title_values,
          description: data.third_description_values,
          icon: resolveIcon(data.third_library_logo_values, data.third_logo_values) ?? Sparkles,
        },
      ]
    : [];

  // Sépare second_description en paragraphes (séparés par \n\n dans Strapi)
  const bioParagraphs = data?.second_description.split('\n\n').filter(Boolean) ?? [];

  if (loading) {
    return (
      <section className="py-20 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-foreground/50 text-sm">Chargement…</p>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="py-20 flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive text-sm">
          Impossible de charger le contenu{error ? ` (${error})` : ''}.
        </p>
      </section>
    );
  }

  return (
    <section id="a-propos" className="py-20">
      <div className="container mx-auto px-6">

        {/* ── En-tête ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">
            <span className="gradient-text">À Propos</span> de Moi
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            {data.first_description}
          </p>
        </motion.div>

        {/* ── Bio ───────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-green-400 rounded-full blur-2xl opacity-50" />
              {!imgLoaded && (
                <div className="relative w-full h-full rounded-full bg-primary/10 animate-pulse border-4 border-primary/50" />
              )}
              <img
                className={`absolute inset-0 w-full h-full object-cover rounded-full shadow-2xl border-4 border-primary/50 transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                alt={data.image?.alternativeText ?? 'Portrait Développeur IA'}
                src={data.image ? strapiImageUrl(data.image.url) : 'https://images.unsplash.com/photo-1697800132445-857f02ff51df'}
                onLoad={() => setImgLoaded(true)}
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-foreground/90 space-y-6"
          >
            {bioParagraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </motion.div>
        </div>

        {/* ── Valeurs ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Mes <span className="gradient-text">Valeurs</span>
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            {data.values_description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
              className="glass-effect rounded-xl p-8 text-center hover:glow-effect transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="mb-4 inline-block p-3 bg-primary/20 rounded-full"
              >
                <value.icon className="w-10 h-10 text-primary" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">{value.title}</h3>
              <p className="text-foreground/80">{value.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutPage;
