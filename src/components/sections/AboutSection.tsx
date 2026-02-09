import { useState, useEffect, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AboutSection = memo(() => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [resumeName, setResumeName] = useState('Resume.pdf');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      const { data, error } = await supabase
        .from('about_me')
        .select('name, title, bio')
        .limit(1)
        .single();

      if (!error && data) {
        setName(data.name || '');
        setTitle(data.title || '');
        setBio(data.bio || '');
      }
    };

    const fetchResume = async () => {
      const { data, error } = await supabase.storage
        .from('project-images')
        .list('resumes', {
          limit: 1,
          sortBy: { column: 'name', order: 'desc' },
        });

      if (!error && data && data.length > 0) {
        const latest = data[0];
        setResumeName(latest.name);

        const { data: publicData } = supabase.storage
          .from('project-images')
          .getPublicUrl(`resumes/${latest.name}`);

        setResumeUrl(`${publicData.publicUrl}?t=${Date.now()}`);
      }
    };

    Promise.all([fetchAbout(), fetchResume()]).finally(() => setLoading(false));
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

  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white reveal">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase text-sm">About Me</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">My Journey</h2>
        </div>

        {loading ? (
          <div className="bg-gradient-to-tr from-gray-50 to-white shadow-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-tr from-gray-50 to-white shadow-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-4">{name}</h3>
            <h4 className="text-lg sm:text-xl text-purple-700 mb-4 sm:mb-6 font-medium">{title}</h4>
            <div className="space-y-4">
              {bio.split('\n').map((para, idx) => (
                <p key={idx} className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="text-purple-600 hover:text-purple-700 flex items-center gap-2 font-medium text-sm sm:text-base"
            onClick={handleDownloadResume}
            disabled={!resumeUrl}
          >
            Download Resume <ExternalLink size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;
