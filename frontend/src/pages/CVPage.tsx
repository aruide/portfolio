import { motion } from 'framer-motion';
import { Download, Mail, MapPin, Phone, Car, Link as LinkIcon, GraduationCap, Briefcase, Award } from 'lucide-react';
import { useCompetences } from '@/hooks/useCompetences';
import { useExperiences } from '@/hooks/useExperiences';
import { useCVpage } from '@/hooks/useCVpage';
import { useAboutpage } from '@/hooks/useAboutpage';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';

function strapiUrl(url: string): string {
  return url.startsWith('http') ? url : `${API_URL}${url}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr)
    .toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    .toUpperCase();
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

// ── Infos de contact (à migrer dans Strapi CVpage si besoin) ─────────
const CONTACT = {
  email: 'ruide.aurelien@gmail.com',
  location: '59233, Maing',
  driving: 'Permis B + voiture',
  phone: '07.80.34.28.98',
  linktree: 'https://linktr.ee/aruide',
};

const SOFT_SKILLS = [
  'Autonome', 'À l\'écoute', 'Curieux', 'Rigoureux et précis', 'Esprit collaboratif',
];

// ── Composants internes ───────────────────────────────────────────────

const SidebarSection = ({ title }: { title: string }) => (
  <div className="rounded px-3 py-1.5 mb-3 text-center" style={{ backgroundColor: '#152d5e' }}>
    <h2 className="font-bold text-white text-xs tracking-widest uppercase">{title}</h2>
  </div>
);

const RightSection = ({ icon: Icon, title, first = false }: {
  icon: React.ElementType; title: string; first?: boolean;
}) => (
  <div className={`flex items-center gap-2 text-white rounded-lg px-4 py-2 mb-5 ${first ? '' : 'mt-7'}`}
    style={{ backgroundColor: '#1B3A6E' }}>
    <Icon className="w-4 h-4 flex-shrink-0" />
    <h2 className="font-semibold text-sm">{title}</h2>
  </div>
);

// ── Page principale ───────────────────────────────────────────────────

const CVPage = () => {
  const { data: cvpage } = useCVpage();
  const { data: aboutData } = useAboutpage();
  const { data: competences, loading: loadingSkills } = useCompetences();
  const { data: experiences, loading: loadingExp } = useExperiences();

  const loading = loadingSkills || loadingExp;

  // Sépare certifications du reste
  const certifications = competences.filter(c =>
    c.type_competence?.toLowerCase().includes('certif')
  );
  const hardSkills = competences.filter(c =>
    !c.type_competence?.toLowerCase().includes('certif')
  );

  // Regroupe par catégorie
  const grouped = hardSkills.reduce<Record<string, typeof competences>>((acc, skill) => {
    const key = skill.type_competence ?? 'Autre';
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  const diplomes = experiences
    .filter(e => e.type === 'diplome')
    .sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());

  const entreprises = experiences
    .filter(e => e.type === 'entreprise')
    .sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());

  const profileSrc = aboutData?.image ? strapiUrl(aboutData.image.url) : null;
  const bio = aboutData?.first_description ?? '';

  return (
    <div className="py-10 px-4 bg-gray-300 min-h-screen print:bg-white print:p-0">

      {/* Bouton téléchargement (hors document, masqué à l'impression) */}
      <div className="print:hidden flex justify-center mb-6">
        {cvpage?.cv_file ? (
          <motion.a
            href={strapiUrl(cvpage.cv_file.url)}
            download
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold shadow-lg"
            style={{ backgroundColor: '#1B3A6E' }}
          >
            <Download className="w-5 h-5" />
            {cvpage.cv_button_label ?? 'Télécharger mon CV'}
          </motion.a>
        ) : (
          <div className="flex items-center gap-2 px-6 py-3 text-white/50 rounded-xl font-semibold border border-white/20 text-sm">
            <Download className="w-4 h-4" />
            Fichier CV non configuré dans Strapi
          </div>
        )}
      </div>

      {/* ── Document A4 ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[900px] mx-auto shadow-2xl flex min-h-[1100px] print:shadow-none print:max-w-full"
      >

        {/* ══ COLONNE GAUCHE (sidebar bleue) ══════════════════════════ */}
        <div className="w-[300px] flex-shrink-0 flex flex-col text-white" style={{ backgroundColor: '#1B3A6E' }}>

          {/* En-tête : photo + nom + titre */}
          <div className="relative px-6 pt-8 pb-6 overflow-hidden" style={{ backgroundColor: '#152d5e' }}>
            {/* Grille binaire décorative */}
            <div className="absolute inset-0 opacity-[0.07]" style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,transparent,transparent 22px,#fff 22px,#fff 23px),' +
                'repeating-linear-gradient(90deg,transparent,transparent 22px,#fff 22px,#fff 23px)',
            }} />
            <div className="relative">
              {profileSrc ? (
                <img
                  src={profileSrc}
                  alt="Portrait Aurélien Ruide"
                  className="w-24 h-24 rounded-full object-cover border-4 mb-4"
                  style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full mb-4" style={{ backgroundColor: '#1B3A6E' }} />
              )}
              <h1 className="text-3xl font-black uppercase leading-tight tracking-wider">
                AURÉLIEN<br />RUIDE
              </h1>
              <p className="font-semibold mt-1 text-xs tracking-wide" style={{ color: '#93c5fd' }}>
                Ingénieur Data / IA Junior
              </p>
            </div>
          </div>

          {/* Corps de la sidebar */}
          <div className="flex-1 px-5 py-6 space-y-5 text-xs">

            {/* Contact */}
            <div className="space-y-2">
              <a href={`mailto:${CONTACT.email}`}
                className="flex items-start gap-2 hover:opacity-80 transition-opacity">
                <Mail className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#93c5fd' }} />
                <span className="break-all">{CONTACT.email}</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#93c5fd' }} />
                <span>{CONTACT.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#93c5fd' }} />
                <span>{CONTACT.driving}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#93c5fd' }} />
                <span>{CONTACT.phone}</span>
              </div>
              <a href={CONTACT.linktree} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#93c5fd' }} />
                <span>linktr.ee/aruide</span>
              </a>
            </div>

            <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />

            {/* À propos */}
            {bio && (
              <div>
                <SidebarSection title="À propos de moi" />
                <p className="leading-relaxed" style={{ color: '#bfdbfe' }}>{bio}</p>
              </div>
            )}

            {/* Hard Skills */}
            {!loading && Object.keys(grouped).length > 0 && (
              <div>
                <SidebarSection title="Hard Skills" />
                <div className="space-y-3">
                  {Object.entries(grouped).map(([cat, skills]) => (
                    <div key={cat}>
                      <p className="font-bold text-white mb-1">{capitalize(cat)} :</p>
                      <ul className="space-y-0.5">
                        {skills.map(skill => (
                          <li key={skill.id} className="flex items-center gap-1.5" style={{ color: '#bfdbfe' }}>
                            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#93c5fd' }} />
                            {skill.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            <div>
              <SidebarSection title="Soft Skills" />
              <p className="font-semibold leading-relaxed" style={{ color: '#bfdbfe' }}>
                {SOFT_SKILLS.join(' / ')}
              </p>
            </div>

          </div>
        </div>

        {/* ══ COLONNE DROITE (contenu blanc) ══════════════════════════ */}
        <div className="flex-1 bg-white px-8 py-8 text-gray-800 text-xs">

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: '#1B3A6E', borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <>
              {/* Formations */}
              {diplomes.length > 0 && (
                <section>
                  <RightSection icon={GraduationCap} title="Formations / Diplômes" first />
                  <div className="space-y-5">
                    {diplomes.map((d, i) => (
                      <motion.div
                        key={d.id}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.07 }}
                      >
                        <h3 className="font-bold leading-snug" style={{ color: '#1B3A6E' }}>
                          {d.intitule}
                        </h3>
                        <p className="font-bold text-gray-600 mt-0.5 uppercase tracking-wide">
                          {formatDate(d.date_debut)} — {d.date_fin ? formatDate(d.date_fin) : 'En cours'}
                        </p>
                        <ul className="mt-1 space-y-0.5 text-gray-600">
                          {d.description.split('\n').filter(Boolean).map((line, j) => (
                            <li key={j}>{line.startsWith('-') ? line : `- ${line}`}</li>
                          ))}
                          <li>- {d.nom_etablissement}</li>
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Expériences professionnelles */}
              {entreprises.length > 0 && (
                <section>
                  <RightSection icon={Briefcase} title="Expériences professionnelles" />
                  <div className="space-y-5">
                    {entreprises.map((e, i) => (
                      <motion.div
                        key={e.id}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.07 }}
                      >
                        <h3 className="font-bold leading-snug" style={{ color: '#1B3A6E' }}>
                          {e.intitule} / {e.nom_etablissement}
                        </h3>
                        <p className="font-bold text-gray-600 mt-0.5 uppercase tracking-wide">
                          {formatDate(e.date_debut)} — {e.date_fin ? formatDate(e.date_fin) : 'Présent'}
                        </p>
                        <ul className="mt-1 space-y-0.5 text-gray-600">
                          {e.description.split('\n').filter(Boolean).map((line, j) => (
                            <li key={j}>{line.startsWith('-') ? line : `- ${line}`}</li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <section>
                  <RightSection icon={Award} title="Certifications" />
                  <ul className="space-y-1 text-gray-700">
                    {certifications.map(c => (
                      <li key={c.id}>
                        <span className="font-bold">{c.title}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}

        </div>
      </motion.div>
    </div>
  );
};

export default CVPage;
