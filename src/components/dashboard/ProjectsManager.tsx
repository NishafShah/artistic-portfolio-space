
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash, Edit, Check, X, Upload, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load existing projects
    const storedProjects = JSON.parse(localStorage.getItem('portfolio_projects') || '[]');
    setProjects(storedProjects);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
        setImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get existing projects
      const storedProjects = JSON.parse(localStorage.getItem('portfolio_projects') || '[]');
      
      // Add new project
      const newProject = {
        id: `project_${Date.now()}`,
        title,
        description,
        technologies: technologies.split(',').map((tech) => tech.trim()),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        liveUrl,
        githubUrl,
      };
      
      storedProjects.push(newProject);
      
      // Save back to localStorage
      localStorage.setItem('portfolio_projects', JSON.stringify(storedProjects));
      
      setProjects(storedProjects);
      
      toast({
        title: "Project added",
        description: "Your project has been added successfully",
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setTechnologies('');
      setImageUrl('');
      setImagePreview(null);
      setLiveUrl('');
      setGithubUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    try {
      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
      
      toast({
        title: "Project deleted",
        description: "The project has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const startEdit = (project: Project) => {
    setEditingProject(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setTechnologies(project.technologies.join(', '));
    setImageUrl(project.imageUrl);
    setImagePreview(project.imageUrl);
    setLiveUrl(project.liveUrl || '');
    setGithubUrl(project.githubUrl || '');
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setTechnologies('');
    setImageUrl('');
    setImagePreview(null);
    setLiveUrl('');
    setGithubUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveEdit = () => {
    try {
      const updatedProjects = projects.map(project => {
        if (project.id === editingProject) {
          return {
            ...project,
            title,
            description,
            technologies: technologies.split(',').map(tech => tech.trim()),
            imageUrl: imageUrl || project.imageUrl,
            liveUrl,
            githubUrl,
          };
        }
        return project;
      });
      
      setProjects(updatedProjects);
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
      
      toast({
        title: "Project updated",
        description: "The project has been updated successfully",
      });
      
      cancelEdit();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <Card className="shadow-lg mb-8 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingProject ? (e) => { e.preventDefault(); saveEdit(); } : handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies (comma separated)</Label>
                <Input
                  id="technologies"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="React, Node.js, MongoDB..."
                  required
                />
              </div>
              
              <div className="space-y-3 md:col-span-2">
                <Label>Project Image</Label>
                <div className="flex flex-col items-center justify-center gap-4">
                  {imagePreview && (
                    <div className="relative w-full h-48 overflow-hidden rounded-md border border-gray-200 group">
                      <img 
                        src={imagePreview} 
                        alt="Project preview" 
                        className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-70"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085';
                        }}
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageUrl('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                  
                  <div className="w-full">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={triggerFileInput}
                      className="w-full py-8 border-dashed flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <Upload size={24} className="text-gray-500 animate-bounce" />
                      <span className="text-sm">{imagePreview ? 'Change Image' : 'Upload Project Image'}</span>
                      <span className="text-xs text-gray-500">Max size: 5MB</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input
                  id="liveUrl"
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://yourproject.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/yourusername/project"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              {editingProject ? (
                <>
                  <Button 
                    type="button"
                    onClick={saveEdit}
                    className="bg-green-600 hover:bg-green-700 flex gap-1 items-center"
                  >
                    <Check size={18} /> Save Changes
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={cancelEdit}
                    className="flex gap-1 items-center"
                  >
                    <X size={18} /> Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700 flex gap-1 items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Project'} <PlusCircle size={18} />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Existing Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No projects yet. Add your first project above.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="h-48 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085';
                }}
              />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => startEdit(project)}
                      className="h-8 w-8 text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDelete(project.id)}
                      className="h-8 w-8 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-2 mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded animate-pulse"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
