
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const AboutSection = () => {
  const [name, setName] = useState('Nishaf Shah');
  const [title, setTitle] = useState('a passionate developer with over 5 years of experience');
  const [bio, setBio] = useState(
    "I'm Nishaf Shah, a passionate developer with over 5 years of experience in creating beautiful and functional web applications. I specialize in modern web technologies and love bringing ideas to life through clean, elegant code.\n\nWhen I'm not coding, you can find me exploring new technologies, contributing to open source projects, or sharing my knowledge through technical writing. I believe in continuous learning and staying at the cutting edge of web development."
  );
  const [resumeName, setResumeName] = useState('Nishaf_Shah_Resume.pdf');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  // Load about data and resume from localStorage on component mount
  useEffect(() => {
    const savedAbout = localStorage.getItem('portfolio_about');
    if (savedAbout) {
      const parsedAbout = JSON.parse(savedAbout);
      setName(parsedAbout.name || name);
      setTitle(parsedAbout.title || title);
      setBio(parsedAbout.bio || bio);
    }

    // Load resume name and URL
    const storedResumeName = localStorage.getItem('portfolio_resume_name');
    if (storedResumeName) {
      setResumeName(storedResumeName);
    }

    const storedResumeUrl = localStorage.getItem('portfolio_resume_url');
    if (storedResumeUrl) {
      setResumeUrl(storedResumeUrl);
    }
  }, []);

  const formatBio = () => {
    return bio.split('\n').map((paragraph, index) => (
      <p key={index} className="text-lg text-gray-600 mb-4 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  const handleDownloadResume = () => {
    if (resumeUrl) {
      // Create a link to the resume PDF and trigger download
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = resumeName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback to the default resume
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = resumeName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section id="about" className="py-24 px-4 bg-white reveal">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase">About Me</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">My Journey</h2>
        </div>
        <div className="bg-gradient-to-tr from-gray-50 to-white shadow-xl rounded-2xl p-8 mb-12 transform transition-all duration-500 hover:shadow-2xl animate-fade-in">
          {formatBio()}
        </div>
        
        <div className="flex justify-center animate-fade-in">
          <Button 
            variant="ghost" 
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 flex items-center gap-2 font-medium transition-all duration-300 hover:scale-110"
            onClick={handleDownloadResume}
          >
            Download Resume <ExternalLink size={18} className="animate-bounce" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
