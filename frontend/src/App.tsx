import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ProjectsPage from '@/pages/ProjectsPage';
import SkillsPage from '@/pages/SkillsPage';
import ExperiencePage from '@/pages/ExperiencePage';
import ContactPage from '@/pages/ContactPage';
import ExperienceDetailPage from '@/pages/ExperienceDetailPage';
import CertificationsPage from '@/pages/CertificationsPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background neural-network">
        <Toaster />
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/projets" element={<ProjectsPage />} />
            <Route path="/competences" element={<SkillsPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/experience/:documentId" element={<ExperienceDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/certifications" element={<CertificationsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
