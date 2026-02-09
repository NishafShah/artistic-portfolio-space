import { ChevronDown, Download, MessageCircle, Eye, Edit, Check, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useCallback, memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EditableHeroStats from '@/components/EditableHeroStats';
import { supabase } from '@/integrations/supabase/client';

const HeroSection = memo(() => {
  const { isAuthenticated } = useAuth();
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'
  );
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string>('Resume.pdf');

  useEffect(() => {
    const storedImage = localStorage.getItem('portfolio_hero_image');
    if (storedImage) {
      setHeroImage(storedImage);
    }

    const fetchResumeFromSupabase = async () => {
      const { data, error } = await supabase.storage
        .from('project-images')
        .list('resumes', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error || !data || data.length === 0) return;

      const latest = data[0];
      setResumeName(latest.name);

      const { data: publicData } = supabase.storage
        .from('project-images')
        .getPublicUrl(`resumes/${latest.name}`);

      setResumeUrl(`${publicData.publicUrl}?t=${Date.now()}`);
    };

    fetchResumeFromSupabase();
  }, []);

  const handleHireMe = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleDownloadResume = useCallback(() => {
    if (!resumeUrl) return;
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = resumeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [resumeUrl, resumeName]);

  const handleViewWork = useCallback(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTempImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    if (tempImageUrl) {
      setHeroImage(tempImageUrl);
      localStorage.setItem('portfolio_hero_image', tempImageUrl);
    }
    setIsEditingImage(false);
    setTempImageUrl('');
  };

  const handleCancelImageEdit = () => {
    setIsEditingImage(false);
    setTempImageUrl('');
  };

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-16 sm:pt-20"
    >
      {/* Animated background elements - simplified for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-300/50 rounded-full mix-blend-multiply filter blur-xl animate-float" />
        <div 
          className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-300/50 rounded-full mix-blend-multiply filter blur-xl animate-float" 
          style={{ animationDelay: '2s' }} 
        />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto relative z-10 gap-8 lg:gap-12 py-8 sm:py-12">
        {/* Left side - Content */}
        <div className="text-center lg:text-left lg:flex-1 lg:pr-8 w-full">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-700 font-medium text-sm sm:text-base mb-4 sm:mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Welcome to my digital space
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-gray-800 mb-4 sm:mb-6 leading-tight">
            Hello, I'm{' '}
            <span className="text-gradient block sm:inline">Nishaf Shah</span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed font-primary max-w-2xl mx-auto lg:mx-0">
            Full Stack Developer & UI/UX Designer, crafting{' '}
            <span className="text-gradient-secondary font-semibold">beautiful</span> and{' '}
            <span className="text-gradient font-semibold">functional</span> digital experiences.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8">
            <Button 
              onClick={handleHireMe} 
              className="btn-primary w-full sm:w-auto text-sm sm:text-base px-6 py-3" 
              size="lg"
            >
              <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Hire Me
            </Button>
            <Button
              onClick={handleDownloadResume}
              className="btn-secondary w-full sm:w-auto text-sm sm:text-base px-6 py-3"
              size="lg"
              disabled={!resumeUrl}
            >
              <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Download CV
            </Button>
            <Button
              onClick={handleViewWork}
              variant="outline"
              className="w-full sm:w-auto px-6 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold rounded-xl transition-colors text-sm sm:text-base"
              size="lg"
            >
              <Eye className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              View My Work
            </Button>
          </div>

          <EditableHeroStats />
        </div>

        {/* Right side - Image */}
        <div className="lg:flex-1 flex justify-center lg:justify-end w-full max-w-md lg:max-w-none">
          <div className="relative group w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative bg-white p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl shadow-xl">
              <img
                src={heroImage}
                alt="Developer workspace"
                className="w-full rounded-xl sm:rounded-2xl"
                loading="eager"
                width={512}
                height={341}
              />

              {isAuthenticated && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  {!isEditingImage ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingImage(true)}
                      className="bg-white/90 backdrop-blur-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="hero-image-upload"
                      />
                      <label htmlFor="hero-image-upload">
                        <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                          <span>
                            <Upload className="w-4 h-4" />
                          </span>
                        </Button>
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveImage}
                        disabled={!tempImageUrl}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCancelImageEdit}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <div className="hidden sm:block absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-purple-600 rounded-full flex justify-center">
          <div className="w-1 h-2 sm:h-3 bg-purple-600 rounded-full mt-1.5 sm:mt-2 animate-pulse" />
        </div>
        <ChevronDown size={20} className="text-purple-600 mx-auto mt-1 sm:mt-2" />
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
