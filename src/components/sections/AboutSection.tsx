import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AboutSection = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [resumeName, setResumeName] = useState('Resume.pdf');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Fetch about content from Supabase table
    const fetchAbout = async () => {
      const { data, error } = await supabase
        .from('about_me')
        .select('name, title, bio')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching about data:', error.message);
      } else if (data) {
        setName(data.name || '');
        setTitle(data.title || '');
        setBio(data.bio || '');
      }
    };

    // ✅ Fetch latest resume from Supabase storage
    const fetchResume = async () => {
      const { data, error } = await supabase.storage
        .from('project-images')
        .list('resumes', {
          limit: 1,
          sortBy: { column: 'name', order: 'desc' },
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

    fetchAbout();
    fetchResume();
  }, []);

  const handleDownloadResume = () => {
    if (!resumeUrl) return;
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = resumeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="about" className="py-24 px-4 bg-white reveal">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase">About Me</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">My Journey</h2>
        </div>

        <div className="bg-gradient-to-tr from-gray-50 to-white shadow-xl rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{name}</h3>
          <h4 className="text-xl text-purple-700 mb-6 font-medium">{title}</h4>
          {bio.split('\n').map((para, idx) => (
            <p key={idx} className="text-lg text-gray-600 mb-4 leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="text-purple-600 hover:text-purple-700 flex items-center gap-2 font-medium hover:scale-110"
            onClick={handleDownloadResume}
            disabled={!resumeUrl}
          >
            Download Resume <ExternalLink size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
