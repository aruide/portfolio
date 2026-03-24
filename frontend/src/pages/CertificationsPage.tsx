import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCertificats } from '@/hooks/useCertificats';

const CertificationsPage = () => {
  const { data, loading, error } = useCertificats();
  const [selected, setSelected] = useState<number | null>(null);

  const selectedCert = selected !== null ? data[selected] : null;

  const prev = () => setSelected((s) => (s !== null && s > 0 ? s - 1 : s));
  const next = () => setSelected((s) => (s !== null && s < data.length - 1 ? s + 1 : s));

  // Utilise le chemin relatif (/uploads/...) pour passer par le proxy Vite en dev
  // et par nginx en prod — évite les blocages cross-origin dans les iframes
  const resolveUrl = (url: string) => (url.startsWith('/') ? url : `/${url}`);

  return (
    <section id="certifications" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h1 className="text-5xl font-bold mb-4">
            Mes <span className="gradient-text">Certifications</span>
          </h1>
          <p className="text-lg text-foreground/60 max-w-xl mx-auto">
            Diplômes et certifications obtenus au fil de mon parcours.
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}

        {error && !loading && (
          <p className="text-center text-destructive">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {data.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelected(i)}
                className="cursor-pointer glass-effect rounded-2xl p-6 flex flex-col gap-3 hover:border-primary/50 transition-colors border border-transparent"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground leading-tight">{cert.name}</h3>
                    {cert.date && (
                      <p className="text-sm text-foreground/50 mt-1">
                        {new Date(cert.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    )}
                  </div>
                </div>
                {cert.media ? (
                  <p className="text-xs text-primary/70">Voir le certificat →</p>
                ) : (
                  <p className="text-xs text-foreground/30 italic">Aucun document joint</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal PDF viewer */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative bg-background rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
                selectedCert.media_position === 'horizontal'
                  ? 'w-full max-w-4xl'
                  : 'w-full max-w-2xl'
              }`}
              style={{ maxHeight: '90vh' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                <div>
                  <h2 className="font-semibold text-foreground">{selectedCert.name}</h2>
                  {selectedCert.date && (
                    <p className="text-sm text-foreground/50">
                      {new Date(selectedCert.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PDF or placeholder */}
              <div className="flex-1 overflow-auto min-h-0">
                {selectedCert.media ? (
                  <iframe
                    src={resolveUrl(selectedCert.media.url)}
                    className="w-full"
                    style={{
                      height: selectedCert.media_position === 'horizontal' ? '60vh' : '75vh',
                    }}
                    title={selectedCert.name}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 gap-4 text-foreground/40">
                    <Award className="w-16 h-16" />
                    <p className="text-sm">Aucun document disponible</p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              {data.length > 1 && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-border shrink-0">
                  <button
                    onClick={prev}
                    disabled={selected === 0}
                    className="flex items-center gap-1 text-sm text-foreground/60 hover:text-primary disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Précédent
                  </button>
                  <span className="text-xs text-foreground/40">
                    {selected! + 1} / {data.length}
                  </span>
                  <button
                    onClick={next}
                    disabled={selected === data.length - 1}
                    className="flex items-center gap-1 text-sm text-foreground/60 hover:text-primary disabled:opacity-30 transition-colors"
                  >
                    Suivant <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertificationsPage;
