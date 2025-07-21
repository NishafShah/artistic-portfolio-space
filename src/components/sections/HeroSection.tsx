import {
  ChevronDown,
  Download,
  MessageCircle,
  Eye,
  Edit,
  Check,
  X,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EditableHeroStats from '@/components/EditableHeroStats';
import { supabase } from '@/integrations/supabase/client';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
  );
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');

  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string>('Resume.pdf');

  // 🔄 Fetch resume from Supabase on mount
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

      if (error || !data || data.length === 0) {
        console.warn('No resume found in Supabase:', error);
        return;
      }

      const latest = data[0];
      setResumeName(latest.name);

      const { data: publicData } = supabase.storage
        .from('project-images')
        .getPublicUrl(`resumes/${latest.name}`);

      setResumeUrl(`${publicData.publicUrl}?t=${Date.now()}`);
    };

    fetchResumeFromSupabase();
  }, []);

  const handleHireMe = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadResume = () => {
    if (!resumeUrl) return;
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = resumeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: '4s' }}
        ></div>
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
            <Button onClick={handleHireMe} className="btn-primary group" size="lg">
              <MessageCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Hire Me
            </Button>
            <Button
              onClick={handleDownloadResume}
              className="btn-secondary group"
              size="lg"
              disabled={!resumeUrl}
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
                src={heroImage}
                alt="Developer workspace"
                className="w-full max-w-lg mx-auto rounded-2xl shadow-xl"
              />
              <div className="absolute inset-2 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {isAuthenticated && (
                <div className="absolute top-4 right-4">
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
