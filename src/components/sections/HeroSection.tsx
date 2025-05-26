
import { ChevronDown, Download, MessageCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditableHeroStats from '@/components/EditableHeroStats';

const HeroSection = () => {
  const handleHireMe = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadResume = () => {
    const resumeData = localStorage.getItem('portfolio_resume');
    if (resumeData) {
      const link = document.createElement('a');
      link.href = resumeData;
      link.download = 'Resume.pdf';
      link.click();
    } else {
      // Fallback to default resume
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'Resume.pdf';
      link.click();
    }
  };

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto relative z-10 gap-12">
        {/* Left side - Content */}
        <div className="text-center lg:text-left lg:flex-1 lg:pr-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-700 font-medium mb-6 animate-bounce-slow">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Welcome to my digital space
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-black text-gray-800 mb-6 leading-tight">
            Hello, I'm{' '}
            <span className="text-gradient animate-gradient relative">
              Nishaf Shah
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed font-primary">
            Full Stack Developer & UI/UX Designer, crafting{' '}
            <span className="text-gradient-secondary font-semibold">beautiful</span> and{' '}
            <span className="text-gradient font-semibold">functional</span> digital experiences.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
            <Button 
              onClick={handleHireMe}
              className="btn-primary group"
              size="lg"
            >
              <MessageCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Hire Me
            </Button>
            <Button 
              onClick={handleDownloadResume}
              className="btn-secondary group"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Download CV
            </Button>
            <Button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="px-8 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 group"
              size="lg"
            >
              <Eye className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              View My Work
            </Button>
          </div>

          {/* Stats */}
          <EditableHeroStats />
        </div>

        {/* Right side - Image */}
        <div className="lg:flex-1 flex justify-center lg:justify-end">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-500 transform group-hover:scale-110"></div>
            <div className="relative bg-white p-2 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-all duration-500">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                alt="Developer coding on laptop"
                className="w-full max-w-lg mx-auto rounded-2xl shadow-xl"
              />
              <div className="absolute inset-2 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center animate-bounce-slow">
              <span className="text-white text-xl">💻</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center animate-bounce-slow" style={{ animationDelay: '1s' }}>
              <span className="text-white text-xl">🚀</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-purple-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-purple-600 rounded-full mt-2 animate-pulse"></div>
        </div>
        <ChevronDown size={24} className="text-purple-600 mx-auto mt-2" />
      </div>
    </section>
  );
};

export default HeroSection;
