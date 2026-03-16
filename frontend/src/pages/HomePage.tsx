import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useHomepage } from '@/hooks/useHomepage';
import { useCVpage } from '@/hooks/useCVpage';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';

/*
 * VIDÉO DE FOND — libre de droit
 * Source : https://www.pexels.com/video/programming-code-3129671/
 * → Télécharge et renomme en "hero.mp4"
 * → Place dans : frontend/public/videos/hero.mp4
 */
const VIDEO_SRC = '/videos/hero.mp4';

const HomePage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data, loading, error } = useHomepage();
  const { data: cvData } = useCVpage();

  const cvUrl = cvData?.cv_file?.url
    ? cvData.cv_file.url.startsWith('http')
      ? cvData.cv_file.url
      : `${API_URL}${cvData.cv_file.url}`
    : null;

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Vidéo de fond ─────────────────────────────────────── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* ── Overlays ──────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/25 via-transparent to-blue-900/35" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* ── Contenu ───────────────────────────────────────────── */}
      <div className="relative z-10 container mx-auto px-6 text-center">

        {/* État de chargement */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-foreground/50 text-sm">Chargement…</p>
          </motion.div>
        )}

        {/* Erreur */}
        {error && !loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-destructive text-sm"
          >
            Impossible de charger le contenu ({error})
          </motion.p>
        )}

        {/* Contenu Strapi */}
        {data && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Premier titre */}
            <motion.p
              className="text-xl md:text-2xl font-light tracking-[0.3em] text-white uppercase mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {data.first_title}
            </motion.p>

            {/* Deuxième titre — nom principal */}
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <span className="gradient-text">{data.second_title}</span>
            </motion.h1>

            {/* work_title — accentué, style différent */}
            <motion.div
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-purple-400/50" />
              <p className="text-lg md:text-2xl font-semibold tracking-wide text-purple-400">
                {data.work_title}
              </p>
              <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-purple-400/50" />
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-foreground/65 max-w-2xl mx-auto leading-relaxed mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              {data.description}
            </motion.p>

            {/* Bouton téléchargement CV */}
            {cvUrl && (
              <motion.a
                href={cvUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
              >
                <Download className="w-4 h-4" />
                {cvData?.cv_button_label ?? 'Télécharger mon CV'}
              </motion.a>
            )}
          </motion.div>
        )}
      </div>

    </section>
  );
};

export default HomePage;
