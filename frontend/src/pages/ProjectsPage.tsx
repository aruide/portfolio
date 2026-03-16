import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Calendar, Tag } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

const ProjectsPage = () => {
  const { data: projects, loading, error } = useProjects();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTopics = Array.from(
    new Set(projects.flatMap((p) => p.topics ?? []).filter((t) => t !== 'portfolio'))
  ).sort();

  const filtered = activeTag
    ? projects.filter((p) => p.topics?.includes(activeTag))
    : projects;

  if (loading) {
    return (
      <section className="py-20 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-foreground/50 text-sm">Chargement des projets…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive text-sm">Impossible de charger les projets ({error}).</p>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            Mes <span className="gradient-text">Projets</span>
          </h1>
          <p className="text-foreground/60 text-lg">
            Synchronisés automatiquement depuis GitHub
          </p>
        </motion.div>

        {allTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            <button
              onClick={() => setActiveTag(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTag === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-primary/10 text-foreground/70 hover:bg-primary/20'
              }`}
            >
              Tous ({projects.length})
            </button>
            {allTopics.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTag === tag
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/10 text-foreground/70 hover:bg-primary/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        )}

        {filtered.length === 0 ? (
          <p className="text-center text-foreground/50 py-20">
            {projects.length === 0
              ? 'Aucun projet synchronisé. Ajoute le topic "portfolio" sur tes repos GitHub.'
              : 'Aucun projet pour ce filtre.'}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="glass-effect rounded-xl overflow-hidden flex flex-col hover:glow-effect transition-all duration-300"
              >
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      e.currentTarget.nextElementSibling?.removeAttribute('style');
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-40 bg-gradient-to-br from-primary/20 via-purple-500/10 to-blue-500/10 flex items-center justify-center"
                  style={project.image_url ? { display: 'none' } : undefined}
                >
                  <Github className="w-10 h-10 text-primary/40" />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-bold text-lg text-foreground mb-2">{project.name}</h2>

                  {project.description && (
                    <p className="text-foreground/65 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {(project.topics ?? []).filter((t) => t !== 'portfolio').length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(project.topics ?? [])
                        .filter((t) => t !== 'portfolio')
                        .slice(0, 5)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-primary/10">
                    <span className="flex items-center gap-1.5 text-foreground/40 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(project.creation_date)}
                    </span>
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-medium transition-all duration-200"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Voir sur GitHub
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default ProjectsPage;
