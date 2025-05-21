
import { Github, Linkedin, Mail } from 'lucide-react';

const FooterSection = () => {
  return (
    <footer className="py-8 bg-gray-900 text-white reveal">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Syed Nishaf Hussian Shah. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="https://github.com/NishafShah" className="text-gray-400 hover:text-purple-400 transition-colors animate-icon" target="_blank" rel="noopener noreferrer">
              <Github size={20} className="transform transition-all duration-300 hover:scale-125" />
            </a>
            <a href="https://www.linkedin.com/in/syed-nishaf-hussain-shah-8b2409310/" className="text-gray-400 hover:text-purple-400 transition-colors animate-icon" target="_blank" rel="noopener noreferrer">
              <Linkedin size={20} className="transform transition-all duration-300 hover:scale-125" />
            </a>
            <a href="mailto:shahmurrawat@gmail.com" className="text-gray-400 hover:text-purple-400 transition-colors animate-icon">
              <Mail size={20} className="transform transition-all duration-300 hover:scale-125" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
