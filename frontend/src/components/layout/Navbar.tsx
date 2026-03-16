import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import type { NavLink } from '@/types';

const navLinks: NavLink[] = [
  { name: 'Accueil', path: '/' },
  { name: 'À Propos', path: '/a-propos' },
  { name: 'Projets', path: '/projets' },
  { name: 'Compétences', path: '/competences' },
  { name: 'Expérience', path: '/experience' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 glass-effect"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold gradient-text"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/">Portfolio Aurélien Ruide</Link>
          </motion.div>
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.path}
                  className={`text-foreground/80 hover:text-primary transition-colors ${
                    location.pathname === link.path ? 'text-primary font-semibold' : ''
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
