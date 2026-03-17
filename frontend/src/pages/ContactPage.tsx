import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'lucide-react';
import { resolveIcon } from '@/lib/icon-resolver';
import { useContacts } from '@/hooks/useContacts';

type IconComponent = React.ComponentType<{ className?: string; size?: number }>;
const FallbackIcon: IconComponent = Link;

const ContactPage = () => {
  const { data, loading, error } = useContacts();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Collaborons</span> Ensemble
          </h1>
          <p className="text-lg text-foreground/60 max-w-xl mx-auto">
            Retrouvez-moi sur les plateformes ci-dessous ou contactez-moi directement.
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
          <div className="flex flex-wrap justify-center gap-6 max-w-2xl mx-auto">
            {data.map((contact, i) => {
              const Icon = resolveIcon(contact.library_icon, contact.icon) ?? FallbackIcon;
              return (
                <motion.a
                  key={contact.id}
                  href={contact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.08, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  onHoverStart={() => setHovered(contact.id)}
                  onHoverEnd={() => setHovered(null)}
                  className="relative flex flex-col items-center gap-3 px-8 py-6 transition-all duration-300 min-w-[140px]"
                >
                  <motion.div
                    animate={hovered === contact.id
                      ? { backgroundColor: 'hsl(var(--primary))', scale: 1.1 }
                      : { backgroundColor: 'hsl(var(--primary) / 0.1)', scale: 1 }
                    }
                    transition={{ duration: 0.25 }}
                    className="relative w-16 h-16 rounded-full flex items-center justify-center"
                  >
                    <motion.div
                      animate={hovered === contact.id ? { color: 'hsl(var(--primary-foreground))' } : { color: 'hsl(var(--primary))' }}
                      transition={{ duration: 0.25 }}
                    >
                      <Icon className="w-7 h-7" />
                    </motion.div>
                  </motion.div>

                  <motion.span
                    animate={hovered === contact.id ? { opacity: 1 } : { opacity: 0.7 }}
                    className="text-sm font-medium text-foreground"
                  >
                    {contact.title}
                  </motion.span>
                </motion.a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactPage;
