import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import ProjectCard from '../components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, ChevronDown, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('portfolio_projects') || '[]');
    
    if (storedProjects.length === 0) {
      setProjects([
        {
          title: 'E-commerce Platform',
          description: 'A full-featured e-commerce platform with a modern UI and seamless checkout experience.',
          technologies: ['React', 'Node.js', 'MongoDB'],
          imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
          liveUrl: '#',
          githubUrl: '#',
        },
        {
          title: 'Task Management App',
          description: 'A productivity app that helps teams organize and track their projects effectively.',
          technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
          imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
          liveUrl: '#',
          githubUrl: '#',
        },
      ]);
    } else {
      setProjects(storedProjects);
    }
  }, []);

  const skills = [
    { name: 'Frontend Development', level: 90 },
    { name: 'UI/UX Design', level: 85 },
    { name: 'Backend Development', level: 80 },
    { name: 'Mobile Development', level: 75 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <section id="home" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614851099175-e5b30eb6f696')] bg-cover bg-center opacity-5"></div>
        <div className="text-center relative z-10 max-w-3xl mx-auto">
          <p className="text-purple-600 font-medium mb-4 tracking-wider uppercase animate-fade-in">Welcome to my portfolio</p>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight animate-fade-in delay-150">
            Hello, I'm <span className="text-purple-600 relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-1 after:-bottom-1 after:left-0 after:bg-purple-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Your Name</span>
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

      <section id="about" className="py-24 px-4 bg-white reveal">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase">About Me</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">My Journey</h2>
          </div>
          <div className="bg-gradient-to-tr from-gray-50 to-white shadow-xl rounded-2xl p-8 mb-12">
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              I'm a passionate developer with over 5 years of experience in creating beautiful and functional web applications. 
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
              <a href="#" target="_blank" rel="noopener noreferrer">
                Download Resume <ExternalLink size={18} />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section id="projects" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-purple-50 reveal">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase">Portfolio</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">My Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and expertise in web development.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
          
          {isAuthenticated ? (
            <div className="mt-12 text-center">
              <Link to="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Manage Projects
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Want to add your own projects?</p>
              <Link to="/login">
                <Button className="bg-purple-600 hover:bg-purple-700 mr-4">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section id="skills" className="py-24 px-4 bg-white reveal">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase">Expertise</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">My Skills</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              I specialize in a range of technologies and constantly expand my skillset.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-8 transform transition-all duration-300 hover:shadow-2xl">
            <div className="space-y-8">
              {skills.map((skill, index) => (
                <div key={skill.name} className="reveal" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-800 font-medium">{skill.name}</span>
                    <span className="text-purple-600 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-purple-50 reveal">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-center mb-12">
            <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase">Contact</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Get in Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Feel free to reach out for collaborations or just a friendly chat.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="mailto:your.email@example.com" 
                className="flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-800"
              >
                <Mail size={22} className="text-purple-600" />
                <span>your.email@example.com</span>
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-800"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Github size={22} className="text-purple-600" />
                <span>GitHub</span>
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-800"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Linkedin size={22} className="text-purple-600" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-gray-900 text-white reveal">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="mailto:your.email@example.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
