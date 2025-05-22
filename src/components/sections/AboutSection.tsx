
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4 bg-white reveal">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase">About Me</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">My Journey</h2>
        </div>
        <div className="bg-gradient-to-tr from-gray-50 to-white shadow-xl rounded-2xl p-8 mb-12">
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            I'm Nishaf Shah, a passionate developer with over 5 years of experience in creating beautiful and functional web applications. 
            I specialize in modern web technologies and love bringing ideas to life through clean, elegant code.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            When I'm not coding, you can find me exploring new technologies, contributing to open source projects, 
            or sharing my knowledge through technical writing. I believe in continuous learning and staying at the cutting edge of web development.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 flex items-center gap-2 font-medium"
            asChild
          >
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" download="Nishaf_Shah_Resume.pdf">
              Download Resume <ExternalLink size={18} />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
