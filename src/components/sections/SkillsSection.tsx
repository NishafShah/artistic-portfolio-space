import { useEffect, useState, memo, useMemo } from 'react';
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

const SkillBar = memo(({ skill }: { skill: Skill }) => (
  <div className="space-y-2 group/skill">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 sm:space-x-3">
        {skill.image_url ? (
          <img
            src={skill.image_url}
            alt={skill.name}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
            loading="lazy"
          />
        ) : skill.icon ? (
          <span className="text-xl sm:text-2xl">{skill.icon}</span>
        ) : (
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
            {skill.name.charAt(0)}
          </div>
        )}
        <span className="font-semibold text-sm sm:text-base text-gray-700">{skill.name}</span>
      </div>
      <span className="text-xs sm:text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 sm:py-1 rounded-full">
        {skill.level}%
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${skill.level}%` }}
      />
    </div>
  </div>
));

SkillBar.displayName = 'SkillBar';

const CategoryCard = memo(({ 
  category, 
  skills, 
  icon 
}: { 
  category: string; 
  skills: Skill[]; 
  icon: React.ReactNode;
}) => (
  <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
    <CardContent className="p-0">
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl text-white">
          {icon}
        </div>
        <h3 className="text-base sm:text-xl font-bold ml-3 sm:ml-4 text-gray-800">
          {category === 'Language' ? 'Programming Languages' : 'Frameworks & Tools'} ({skills.length})
        </h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {skills.map((skill) => (
          <SkillBar key={skill.id} skill={skill} />
        ))}
      </div>
    </CardContent>
  </Card>
));

CategoryCard.displayName = 'CategoryCard';

const SkillsSection = memo(() => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const categories = ['Language', 'Framework'];
  const BUCKET_BASE = 'https://plzmnpbzqbmdbbxdpgwi.supabase.co/storage/v1/object/public/skill-icons';

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('category', { ascending: true });

        if (error) {
          console.error('Supabase fetch error:', error.message);
          return;
        }

        if (data) {
          const skillsWithImage = data.map((skill) => {
            if (!skill.image_url) {
              const safeName = skill.name.toLowerCase().replace(/[^a-z0-9]/g, '');
              return { ...skill, image_url: `${BUCKET_BASE}/${safeName}.png` };
            }
            return skill;
          });

          setSkills(skillsWithImage);
        }
      } catch (err) {
        console.error('Unexpected error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();

    const handleSkillsUpdate = () => loadSkills();
    window.addEventListener('skillsUpdated', handleSkillsUpdate);
    return () => window.removeEventListener('skillsUpdated', handleSkillsUpdate);
  }, []);

  const skillsByCategory = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat] = skills.filter((s) => s.category === cat);
      return acc;
    }, {} as Record<string, Skill[]>);
  }, [skills]);

  const getIcon = (category: string) => {
    const size = "w-5 h-5 sm:w-6 sm:h-6";
    switch (category) {
      case 'Language':
        return <Code className={size} />;
      case 'Framework':
        return <Database className={size} />;
      case 'Design':
        return <Palette className={size} />;
      default:
        return <Settings className={size} />;
    }
  };

  return (
    <section id="skills" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 reveal">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/90 backdrop-blur-lg border-2 border-blue-200 text-blue-700 font-bold mb-6 sm:mb-8 shadow-lg text-sm sm:text-base">
            <Code className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            Technical Skills
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-gradient mb-4 sm:mb-8">
            My Skills
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Here are the technologies and tools I work with to bring ideas to life.
          </p>
          {isAuthenticated && (
            <div className="mt-4 sm:mt-6">
              <Link to="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Manage Skills
                </Button>
              </Link>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {[1, 2].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 text-blue-400" />
            <p className="text-lg sm:text-2xl text-gray-600 font-semibold">No skills added yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {categories.map((category) => {
              const categorySkills = skillsByCategory[category];
              if (!categorySkills || categorySkills.length === 0) return null;

              return (
                <CategoryCard
                  key={category}
                  category={category}
                  skills={categorySkills}
                  icon={getIcon(category)}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
});

SkillsSection.displayName = 'SkillsSection';

export default SkillsSection;
