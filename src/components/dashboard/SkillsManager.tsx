
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash, Edit, Check, X, Code, Zap } from 'lucide-react';

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
  'Go': '🐹',
  'Rust': '🦀',
  'Swift': '🍎',
  'Kotlin': '🟢',
  
  // Frameworks
  'React': '⚛️',
  'Next.js': '▲',
  'Vue.js': '💚',
  'Angular': '🅰️',
  'Node.js': '💚',
  'Express': '🚀',
  'Laravel': '🎯',
  'Spring': '🍃',
  'Django': '🎸',
  'Flask': '🌶️',
  'Flutter': '💙',
  'React Native': '📱',
};

const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editData, setEditData] = useState<Skill>({ name: '', level: 50, category: 'Language' });
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
      const defaultSkills: Skill[] = [
        { id: '1', name: 'JavaScript', level: 90, category: 'Language' as const, icon: '🟨' },
        { id: '2', name: 'React', level: 85, category: 'Framework' as const, icon: '⚛️' },
        { id: '3', name: 'TypeScript', level: 80, category: 'Language' as const, icon: '🔷' },
        { id: '4', name: 'Node.js', level: 75, category: 'Framework' as const, icon: '💚' },
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
      icon: defaultSkillIcons[newSkill.name as keyof typeof defaultSkillIcons] || (newSkill.category === 'Language' ? '💻' : '🔧'),
    };

    const updatedSkills = [...skills, skillWithIcon];
    saveSkills(updatedSkills);
    setNewSkill({ name: '', level: 50, category: 'Language' });
    setShowAddForm(false);
    
    toast({
      title: "Success!",
      description: "New skill has been added successfully",
    });
  };

  const handleDeleteSkill = (skillId: string) => {
    const updatedSkills = skills.filter(skill => skill.id !== skillId);
    saveSkills(updatedSkills);
    
    toast({
      title: "Deleted",
      description: "Skill has been removed successfully",
    });
  };

  const startEdit = (skill: Skill) => {
    setEditingSkill(skill.id!);
    setEditData(skill);
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    setEditData({ name: '', level: 50, category: 'Language' });
  };

  const saveEdit = () => {
    const updatedSkills = skills.map(skill => 
      skill.id === editingSkill ? {
        ...editData,
        icon: defaultSkillIcons[editData.name as keyof typeof defaultSkillIcons] || (editData.category === 'Language' ? '💻' : '🔧')
      } : skill
    );
    saveSkills(updatedSkills);
    setEditingSkill(null);
    setEditData({ name: '', level: 50, category: 'Language' });
    
    toast({
      title: "Updated!",
      description: "Skill has been updated successfully",
    });
  };

  const languageSkills = skills.filter(skill => skill.category === 'Language');
  const frameworkSkills = skills.filter(skill => skill.category === 'Framework');

  return (
    <div className="animate-fade-in space-y-8 font-primary">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading font-bold text-gradient mb-2">Skills Management</h2>
          <p className="text-gray-600">Manage your technical skills and expertise levels</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="btn-primary group"
        >
          <PlusCircle size={18} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
          Add New Skill
        </Button>
      </div>

      {showAddForm && (
        <Card className="glass-effect border-2 border-purple-200 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="text-gradient">Add New Skill</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="skillName" className="text-sm font-semibold text-gray-700">Skill Name</Label>
                <Input
                  id="skillName"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="Enter skill name"
                  className="mt-1 border-2 border-gray-200 focus:border-purple-500 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="skillCategory" className="text-sm font-semibold text-gray-700">Category</Label>
                <Select
                  value={newSkill.category}
                  onValueChange={(value) => setNewSkill({ ...newSkill, category: value as 'Language' | 'Framework' })}
                >
                  <SelectTrigger className="mt-1 border-2 border-gray-200 focus:border-purple-500 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Language">
                      <div className="flex items-center">
                        <Code size={16} className="mr-2" />
                        Programming Language
                      </div>
                    </SelectItem>
                    <SelectItem value="Framework">
                      <div className="flex items-center">
                        <Zap size={16} className="mr-2" />
                        Framework/Tool
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="skillLevel" className="text-sm font-semibold text-gray-700">
                Proficiency Level: <span className="text-purple-600 font-bold">{newSkill.level}%</span>
              </Label>
              <input
                type="range"
                id="skillLevel"
                min="0"
                max="100"
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2 slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${newSkill.level}%, #e5e7eb ${newSkill.level}%, #e5e7eb 100%)`
                }}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddSkill} className="btn-primary group">
                <Check size={16} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                Add Skill
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 border-2 border-gray-300 hover:border-red-500 hover:text-red-600 rounded-lg transition-all duration-300"
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Languages Section */}
        <Card className="glass-effect border-2 border-purple-200 card-hover">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center gap-3 text-gradient">
              <Code size={24} />
              Programming Languages ({languageSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {languageSkills.map((skill) => (
              <div key={skill.id} className="space-y-3 p-4 border-2 border-gray-100 rounded-xl hover:border-purple-200 transition-all duration-300 hover:shadow-md">
                {editingSkill === skill.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="border-2 border-purple-200 focus:border-purple-500"
                      />
                      <Select
                        value={editData.category}
                        onValueChange={(value) => setEditData({ ...editData, category: value as 'Language' | 'Framework' })}
                      >
                        <SelectTrigger className="border-2 border-purple-200 focus:border-purple-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Language">Language</SelectItem>
                          <SelectItem value="Framework">Framework</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Level: {editData.level}%</Label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editData.level}
                        onChange={(e) => setEditData({ ...editData, level: Number(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Check size={14} className="mr-1" />
                        Save
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" size="sm">
                        <X size={14} className="mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{skill.icon}</span>
                        <span className="font-semibold text-gray-800">{skill.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(skill)}
                          className="hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSkill(skill.id!)}
                          className="hover:bg-red-50 hover:text-red-600 rounded-lg"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <div className="text-right text-sm font-semibold text-purple-600">{skill.level}%</div>
                  </>
                )}
              </div>
            ))}
            {languageSkills.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Code size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No programming languages added yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Frameworks Section */}
        <Card className="glass-effect border-2 border-emerald-200 card-hover">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center gap-3 text-gradient-secondary">
              <Zap size={24} />
              Frameworks & Tools ({frameworkSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {frameworkSkills.map((skill) => (
              <div key={skill.id} className="space-y-3 p-4 border-2 border-gray-100 rounded-xl hover:border-emerald-200 transition-all duration-300 hover:shadow-md">
                {editingSkill === skill.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="border-2 border-emerald-200 focus:border-emerald-500"
                      />
                      <Select
                        value={editData.category}
                        onValueChange={(value) => setEditData({ ...editData, category: value as 'Language' | 'Framework' })}
                      >
                        <SelectTrigger className="border-2 border-emerald-200 focus:border-emerald-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Language">Language</SelectItem>
                          <SelectItem value="Framework">Framework</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Level: {editData.level}%</Label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editData.level}
                        onChange={(e) => setEditData({ ...editData, level: Number(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Check size={14} className="mr-1" />
                        Save
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" size="sm">
                        <X size={14} className="mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{skill.icon}</span>
                        <span className="font-semibold text-gray-800">{skill.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(skill)}
                          className="hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSkill(skill.id!)}
                          className="hover:bg-red-50 hover:text-red-600 rounded-lg"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <div className="text-right text-sm font-semibold text-emerald-600">{skill.level}%</div>
                  </>
                )}
              </div>
            ))}
            {frameworkSkills.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Zap size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No frameworks or tools added yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillsManager;
