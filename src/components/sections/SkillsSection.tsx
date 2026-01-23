import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Database, Palette, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon?: string;
  image_url?: string;
}

const SkillsSection = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('category', { ascending: true });

        if (error) {
          console.error('❌ Supabase fetch error:', error.message);
        }

        if (data) {
          const bucketBase = 'https://plzmnpbzqbmdbbxdpgwi.supabase.co/storage/v1/object/public/skill-icons';

          const skillsWithImage = data.map((skill) => {
            if (!skill.image_url) {
              const safeName = skill.name.toLowerCase().replace(/[^a-z0-9]/g, '');
              const url = `${bucketBase}/${safeName}.png`;
              return { ...skill, image_url: url };
            }
            return skill;
          });

          setSkills(skillsWithImage);
        }
      } catch (err) {
        console.error('❌ Unexpected error fetching skills from Supabase:', err);
      }
    };

    loadSkills();

    window.addEventListener('skillsUpdated', loadSkills);
    return () => {
      window.removeEventListener('skillsUpdated', loadSkills);
    };
  }, []);

  const getSkillsByCategory = (category: string) =>
    skills.filter((skill) => skill.category === category);

  const getIcon = (category: string) => {
    switch (category) {
      case 'Language':
        return <Code className="w-6 h-6" />;
      case 'Framework':
        return <Database className="w-6 h-6" />;
      case 'Design':
        return <Palette className="w-6 h-6" />;
      default:
        return <Settings className="w-6 h-6" />;
    }
  };

  const categories = ['Language', 'Framework'];

  return (
    <section id="skills" className="py-24 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 reveal">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/90 backdrop-blur-lg border-2 border-blue-200 text-blue-700 font-bold mb-8 animate-bounce shadow-xl">
            <Code className="w-5 h-5 mr-3 animate-pulse" />
            Technical Skills
          </div>
          <h2 className="text-5xl md:text-6xl font-heading font-black text-gradient mb-8">
            My Skills
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Here are the technologies and tools I work with to bring ideas to life.
          </p>
          {isAuthenticated && (
            <div className="mt-6">
              <Link to="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <User className="w-5 h-5 mr-2" />
                  Manage Skills
                </Button>
              </Link>
            </div>
          )}
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <Code className="w-24 h-24 mx-auto mb-6 text-blue-400 animate-pulse" />
            <p className="text-2xl text-gray-600 font-semibold">Loading skills...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category, categoryIndex) => {
              const categorySkills = getSkillsByCategory(category);
              if (categorySkills.length === 0) return null;

              return (
                <Card
                  key={category}
                  className="p-6 bg-white/80 backdrop-blur-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in group"
                  style={{ animationDelay: `${categoryIndex * 100}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                        {getIcon(category)}
                      </div>
                      <h3 className="text-xl font-bold ml-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                        {category === 'Language' ? 'Programming Languages' : 'Frameworks & Tools'} ({categorySkills.length})
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {categorySkills.map((skill, skillIndex) => (
                        <div
                          key={skill.id}
                          className="space-y-2 animate-fade-in group/skill"
                          style={{ animationDelay: `${(categoryIndex * 100) + (skillIndex * 50)}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {skill.image_url ? (
                                <img
                                  src={skill.image_url}
                                  alt={skill.name}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                  className="w-8 h-8 rounded-full object-cover group-hover/skill:scale-125 transition-transform duration-300"
                                />
                              ) : skill.icon ? (
                                <span className="text-2xl group-hover/skill:scale-125 transition-transform duration-300">
                                  {skill.icon}
                                </span>
                              ) : (
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  {skill.name.charAt(0)}
                                </div>
                              )}
                              <span className="font-semibold text-gray-700 group-hover/skill:text-blue-600 transition-colors duration-300">
                                {skill.name}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out transform origin-left group-hover/skill:scale-x-105"
                              style={{
                                width: `${skill.level}%`,
                                animationDelay: `${(categoryIndex * 100) + (skillIndex * 50) + 200}ms`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
