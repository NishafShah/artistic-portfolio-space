
import { useEffect } from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import SkillsSection from '../components/sections/SkillsSection';
import ContactSection from '../components/sections/ContactSection';
import FooterSection from '../components/sections/FooterSection';
import Animation from '../components/Animation';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <Animation>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
        <FooterSection />
      </Animation>
    </div>
  );
};

export default Index;
