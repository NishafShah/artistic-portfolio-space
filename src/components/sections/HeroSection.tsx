
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614851099175-e5b30eb6f696')] bg-cover bg-center opacity-5"></div>
      <div className="text-center relative z-10 max-w-3xl mx-auto">
        <p className="text-purple-600 font-medium mb-4 tracking-wider uppercase animate-fade-in">Welcome to my portfolio</p>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight animate-fade-in delay-150">
          Hello, I'm <span className="text-purple-600 relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-1 after:-bottom-1 after:left-0 after:bg-purple-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Syed Nishaf Hussian Shah</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed animate-fade-in delay-300">
          Full Stack Developer & UI/UX Designer, crafting beautiful and functional digital experiences.
        </p>
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in delay-500">
          <Button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6 h-auto"
            size="lg"
          >
            Get in Touch
          </Button>
          <Button 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50 text-lg px-8 py-6 h-auto"
            size="lg"
          >
            View My Work
          </Button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} className="text-purple-600" />
      </div>
    </section>
  );
};

export default HeroSection;
