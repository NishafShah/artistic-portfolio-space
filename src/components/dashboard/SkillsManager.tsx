
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { PlusCircle, Trash, Edit, Check, X } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: number;
}

const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState('');
  const [level, setLevel] = useState(75);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load existing skills
    const storedSkills = JSON.parse(localStorage.getItem('portfolio_skills') || '[]');
    
    if (storedSkills.length === 0) {
      // If no skills exist in localStorage, use the default skills from SkillsSection
      const defaultSkills = [
        { id: 'skill_1', name: 'Frontend Development', level: 90 },
        { id: 'skill_2', name: 'UI/UX Design', level: 85 },
        { id: 'skill_3', name: 'Backend Development', level: 80 },
        { id: 'skill_4', name: 'Mobile Development', level: 75 },
      ];
      setSkills(defaultSkills);
      localStorage.setItem('portfolio_skills', JSON.stringify(defaultSkills));
    } else {
      setSkills(storedSkills);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add new skill
      const newSkill = {
        id: `skill_${Date.now()}`,
        name,
        level,
      };
      
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      
      // Save to localStorage
      localStorage.setItem('portfolio_skills', JSON.stringify(updatedSkills));
      
      toast({
        title: "Skill added",
        description: "Your skill has been added successfully",
      });
      
      // Reset form
      setName('');
      setLevel(75);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    try {
      const updatedSkills = skills.filter(skill => skill.id !== id);
      setSkills(updatedSkills);
      localStorage.setItem('portfolio_skills', JSON.stringify(updatedSkills));
      
      toast({
        title: "Skill deleted",
        description: "The skill has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  const startEdit = (skill: Skill) => {
    setEditingSkill(skill.id);
    setName(skill.name);
    setLevel(skill.level);
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    setName('');
    setLevel(75);
  };

  const saveEdit = () => {
    try {
      const updatedSkills = skills.map(skill => {
        if (skill.id === editingSkill) {
          return {
            ...skill,
            name,
            level,
          };
        }
        return skill;
      });
      
      setSkills(updatedSkills);
      localStorage.setItem('portfolio_skills', JSON.stringify(updatedSkills));
      
      toast({
        title: "Skill updated",
        description: "The skill has been updated successfully",
      });
      
      cancelEdit();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update skill",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Card className="shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            {editingSkill ? 'Edit Skill' : 'Add New Skill'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingSkill ? (e) => { e.preventDefault(); saveEdit(); } : handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., React.js, UX Design, Node.js"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="skillLevel">Skill Level</Label>
                  <span className="text-sm font-medium">{level}%</span>
                </div>
                <Slider
                  id="skillLevel"
                  value={[level]}
                  min={10}
                  max={100}
                  step={5}
                  onValueChange={(value) => setLevel(value[0])}
                  className="py-4"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              {editingSkill ? (
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
                  {isSubmitting ? 'Adding...' : 'Add Skill'} <PlusCircle size={18} />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Your Skills</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skills.map((skill) => (
          <Card key={skill.id} className="p-4">
            <CardContent className="p-2">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-medium">{skill.name}</h3>
                  <p className="text-purple-600 font-semibold">{skill.level}%</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => startEdit(skill)}
                    className="h-8 w-8 text-blue-600"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDelete(skill.id)}
                    className="h-8 w-8 text-red-600"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SkillsManager;
