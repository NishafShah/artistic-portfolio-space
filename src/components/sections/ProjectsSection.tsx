import { Button } from '@/components/ui/button';
import ProjectCard from '../ProjectCard';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Supabase fetch error:', error.message);
          return;
        }

        console.log('✅ Raw Projects from Supabase:', data);

        if (data && data.length > 0) {
          const formattedProjects: Project[] = data.map((project: any, index: number) => {
            const techList = typeof project.technologies === 'string'
              ? project.technologies.split(',').map((t: string) => t.trim())
              : project.technologies;

            const formatted: Project = {
              id: project.id,
              title: project.title,
              description: project.description,
              technologies: techList || [],
              imageUrl: project.image_url || '',
              liveUrl: project.live_url || '',
              githubUrl: project.github_url || '',
            };

            console.log(`🔍 Project ${index + 1}:`, formatted);
            return formatted;
          });

          setProjects(formattedProjects);
        } else {
          console.warn('⚠️ No projects found, loading defaults');
          setProjects([
            {
              title: 'E-commerce Platform',
              description: 'A full-featured e-commerce platform with a modern UI and seamless checkout experience.',
              technologies: ['React', 'Node.js', 'MongoDB'],
              imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
              liveUrl: 'https://example.com/ecommerce',
              githubUrl: 'https://github.com/example/ecommerce',
            },
            {
              title: 'Task Management App',
              description: 'A productivity app that helps teams organize and track their projects effectively.',
              technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
              imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
              liveUrl: 'https://example.com/taskapp',
              githubUrl: 'https://github.com/example/taskapp',
            },
          ]);
        }
      } catch (err) {
        console.error('❌ Unexpected error fetching projects from Supabase:', err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-purple-50 reveal">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase">Portfolio</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">My Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and expertise in web development.
          </p>
          {isAuthenticated && (
            <div className="mt-6">
              <Link to="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Settings className="w-5 h-5 mr-2" />
                  Manage Projects
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
