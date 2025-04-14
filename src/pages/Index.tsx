
import Navigation from '../components/Navigation';
import ProjectCard from '../components/ProjectCard';
import { Github, Linkedin, Mail } from 'lucide-react';

const Index = () => {
  const skills = [
    { name: 'Frontend Development', level: 90 },
    { name: 'UI/UX Design', level: 85 },
    { name: 'Backend Development', level: 80 },
    { name: 'Mobile Development', level: 75 },
  ];

  const projects = [
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
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-purple-50 px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Hello, I'm <span className="text-purple-600">Your Name</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Full Stack Developer & UI/UX Designer
          </p>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            Get in Touch
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">About Me</h2>
          <p className="text-lg text-gray-600 mb-6">
            I'm a passionate developer with over 5 years of experience in creating beautiful and functional web applications. 
            I specialize in modern web technologies and love bringing ideas to life through code.
          </p>
          <p className="text-lg text-gray-600">
            When I'm not coding, you can find me exploring new technologies, contributing to open source projects, 
            or sharing my knowledge through technical writing.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">My Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Skills</h2>
          <div className="space-y-6">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">{skill.name}</span>
                  <span className="text-gray-600">{skill.level}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">Get in Touch</h2>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Github size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="mailto:your.email@example.com" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white">
        <div className="text-center text-gray-600">
          <p>© {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
