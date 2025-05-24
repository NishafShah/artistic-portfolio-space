
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash, Edit, Check, X } from 'lucide-react';

interface Skill {
  id?: string;
  name: string;
  level: number;
  category: 'Language' | 'Framework';
  icon?: string;
}

const defaultSkillIcons = {
  // Languages
  'JavaScript': '🟨',
  'TypeScript': '🔷',
  'Python': '🐍',
  'Java': '☕',
  'C++': '⚡',
  'PHP': '🐘',
  'HTML': '🌐',
  'CSS': '🎨',
  
  // Frameworks
  'React': '⚛️',
  'Next.js': '▲',
  'Vue.js': '💚',
  'Angular': '🅰️',
  'Node.js': '💚',
  'Express': '🚀',
  'Laravel': '🎯',
  'Spring': '🍃',
};

const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState<Skill>({
    name: '',
    level: 50,
    category: 'Language',
  });
  const { toast } = useToast();

  useEffect(() => {
    const storedSkills = JSON.parse(localStorage.getItem('portfolio_skills') || '[]');
    
    if (storedSkills.length === 0) {
      const defaultSkills = [
        { id: '1', name: 'JavaScript', level: 90, category: 'Language', icon: '🟨' },
        { id: '2', name: 'React', level: 85, category: 'Framework', icon: '⚛️' },
        { id: '3', name: 'TypeScript', level: 80, category: 'Language', icon: '🔷' },
        { id: '4', name: 'Node.js', level: 75, category: 'Framework', icon: '💚' },
      ];
      setSkills(defaultSkills);
      localStorage.setItem('portfolio_skills', JSON.stringify(defaultSkills));
    } else {
      setSkills(storedSkills);
    }
  }, []);

  const saveSkills = (updatedSkills: Skill[]) => {
    localStorage.setItem('portfolio_skills', JSON.stringify(updatedSkills));
    setSkills(updatedSkills);
  };

  const handleAddSkill = () => {
    if (!newSkill.name) {
      toast({
        title: "Error",
        description: "Please enter a skill name",
        variant: "destructive",
      });
      return;
    }

    const skillWithIcon = {
      ...newSkill,
      id: `skill_${Date.now()}`,
      icon: defaultSkillIcons[newSkill.name as keyof typeof defaultSkillIcons] || '🔧',
    };

    const updatedSkills = [...skills, skillWithIcon];
    saveSkills(updatedSkills);
    setNewSkill({ name: '', level: 50, category: 'Language' });
    setShowAddForm(false);
    
    toast({
      title: "Skill added",
      description: "New skill has been added successfully",
    });
  };

  const handleDeleteSkill = (skillId: string) => {
    const updatedSkills = skills.filter(skill => skill.id !== skillId);
    saveSkills(updatedSkills);
    
    toast({
      title: "Skill deleted",
      description: "Skill has been removed successfully",
    });
  };

  const handleUpdateSkill = (skillId: string, updates: Partial<Skill>) => {
    const updatedSkills = skills.map(skill => 
      skill.id === skillId ? { ...skill, ...updates } : skill
    );
    saveSkills(updatedSkills);
    setEditingSkill(null);
    
    toast({
      title: "Skill updated",
      description: "Skill has been updated successfully",
    });
  };

  const languageSkills = skills.filter(skill => skill.category === 'Language');
  const frameworkSkills = skills.filter(skill => skill.category === 'Framework');

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Skills Management</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Add Skill
        </Button>
      </div>

      {showAddForm && (
        <Card className="shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>Add New Skill</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="Enter skill name"
                />
              </div>
              <div>
                <Label htmlFor="skillCategory">Category</Label>
                <Select
                  value={newSkill.category}
                  onValueChange={(value) => setNewSkill({ ...newSkill, category: value as 'Language' | 'Framework' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Language">Language</SelectItem>
                    <SelectItem value="Framework">Framework</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="skillLevel">Proficiency Level: {newSkill.level}%</Label>
              <input
                type="range"
                id="skillLevel"
                min="0"
                max="100"
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddSkill} className="bg-green-600 hover:bg-green-700">
                <Check size={16} className="mr-1" />
                Add Skill
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                <X size={16} className="mr-1" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💻 Languages ({languageSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {languageSkills.map((skill) => (
              <div key={skill.id} className="space-y-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{skill.icon}</span>
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSkill(skill.id!)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSkill(skill.id!)}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <div className="text-right text-sm text-gray-600">{skill.level}%</div>
              </div>
            ))}
            {languageSkills.length === 0 && (
              <p className="text-gray-500 text-center py-4">No languages added yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 Frameworks ({frameworkSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {frameworkSkills.map((skill) => (
              <div key={skill.id} className="space-y-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{skill.icon}</span>
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSkill(skill.id!)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSkill(skill.id!)}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <div className="text-right text-sm text-gray-600">{skill.level}%</div>
              </div>
            ))}
            {frameworkSkills.length === 0 && (
              <p className="text-gray-500 text-center py-4">No frameworks added yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillsManager;
