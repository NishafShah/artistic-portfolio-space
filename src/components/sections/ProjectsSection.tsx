import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, memo } from 'react';
import { Settings, ExternalLink, Github, Folder } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

const ProjectCard = memo(({ 
  title, 
  description, 
  technologies, 
  imageUrl, 
  liveUrl, 
  githubUrl 
}: Project) => (
  <article className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="aspect-video w-full overflow-hidden">
      <OptimizedImage
        src={imageUrl}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        containerClassName="h-full w-full"
      />
    </div>
    <div className="p-4 sm:p-6">
      <h3 className="mb-2 text-lg sm:text-xl font-semibold text-gray-800 line-clamp-1">{title}</h3>
      <p className="mb-4 text-sm sm:text-base text-gray-600 line-clamp-2">{description}</p>
      <div className="mb-4 flex flex-wrap gap-1.5 sm:gap-2">
        {technologies.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-gray-100 px-2.5 py-1 text-xs sm:text-sm text-gray-600"
          >
            {tech}
          </span>
        ))}
        {technologies.length > 4 && (
          <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs sm:text-sm text-purple-600">
            +{technologies.length - 4}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3 sm:gap-4">
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ExternalLink size={16} />
            <span>Live Demo</span>
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Github size={16} />
            <span>Source</span>
          </a>
        )}
      </div>
    </div>
  </article>
));

ProjectCard.displayName = 'ProjectCard';

const ProjectsSection = memo(() => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase fetch error:', error.message);
          return;
        }

        if (data && data.length > 0) {
          const formattedProjects: Project[] = data.map((project) => {
            let techList: string[] = [];
            const tech = project.technologies as string[] | string | null;
            if (typeof tech === 'string') {
              techList = tech.split(',').map((t) => t.trim());
            } else if (Array.isArray(tech)) {
              techList = tech;
            }

            return {
              id: project.id,
              title: project.title,
              description: project.description || '',
              technologies: techList,
              imageUrl: project.image_url || '',
              liveUrl: project.live_url || '',
              githubUrl: project.github_url || '',
            };
          });

          setProjects(formattedProjects);
        }
      } catch (err) {
        console.error('Unexpected error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50 reveal">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase text-sm">Portfolio</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">My Projects</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and expertise in web development.
          </p>
          {isAuthenticated && (
            <div className="mt-4 sm:mt-6">
              <Link to="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700 text-sm sm:text-base">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Manage Projects
                </Button>
              </Link>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-lg rounded-2xl border-2 border-purple-100">
            <Folder className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 text-purple-400" />
            <p className="text-lg sm:text-2xl text-gray-600 font-semibold">No projects yet</p>
            <p className="text-sm sm:text-base text-gray-500 mt-2">Check back soon for exciting projects!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id || index} {...project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;
