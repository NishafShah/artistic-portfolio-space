
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Check, X } from 'lucide-react';

interface HeroStats {
  projects: string;
  experience: string;
  satisfaction: string;
}

const EditableHeroStats = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<HeroStats>({
    projects: '50+',
    experience: '3+',
    satisfaction: '100%'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempStats, setTempStats] = useState<HeroStats>(stats);

  useEffect(() => {
    const storedStats = localStorage.getItem('portfolio_hero_stats');
    if (storedStats) {
      const parsed = JSON.parse(storedStats);
      setStats(parsed);
      setTempStats(parsed);
    }
  }, []);

  const handleSave = () => {
    setStats(tempStats);
    localStorage.setItem('portfolio_hero_stats', JSON.stringify(tempStats));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempStats(stats);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-wrap gap-8 justify-center lg:justify-start text-center relative">
      {isAuthenticated && !isEditing && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="absolute -top-10 right-0 opacity-70 hover:opacity-100"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit Stats
        </Button>
      )}

      {isEditing && (
        <div className="absolute -top-12 right-0 flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Check className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="group">
        {isEditing ? (
          <Input
            value={tempStats.projects}
            onChange={(e) => setTempStats({ ...tempStats, projects: e.target.value })}
            className="w-20 text-center font-black text-xl mb-1"
          />
        ) : (
          <div className="text-3xl font-black text-gradient">{stats.projects}</div>
        )}
        <div className="text-sm text-gray-600 font-medium">Projects Done</div>
      </div>

      <div className="group">
        {isEditing ? (
          <Input
            value={tempStats.experience}
            onChange={(e) => setTempStats({ ...tempStats, experience: e.target.value })}
            className="w-20 text-center font-black text-xl mb-1"
          />
        ) : (
          <div className="text-3xl font-black text-gradient-secondary">{stats.experience}</div>
        )}
        <div className="text-sm text-gray-600 font-medium">Years Experience</div>
      </div>

      <div className="group">
        {isEditing ? (
          <Input
            value={tempStats.satisfaction}
            onChange={(e) => setTempStats({ ...tempStats, satisfaction: e.target.value })}
            className="w-20 text-center font-black text-xl mb-1"
          />
        ) : (
          <div className="text-3xl font-black text-gradient">{stats.satisfaction}</div>
        )}
        <div className="text-sm text-gray-600 font-medium">Client Satisfaction</div>
      </div>
    </div>
  );
};

export default EditableHeroStats;
