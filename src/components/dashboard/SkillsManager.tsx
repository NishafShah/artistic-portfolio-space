import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash, Edit, Check, X, Code, Zap, Rocket } from 'lucide-react';

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
  'C#': '🔵',
  'Ruby': '💎',
  'C': '🔧',
  'Dart': '🎯',
  'Scala': '🔺',
  'R': '📊',
  'MATLAB': '📈',
  'Perl': '🐪',
  
  // Frameworks & Tools
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
  'Docker': '🐳',
  'Kubernetes': '☸️',
  'AWS': '☁️',
  'Firebase': '🔥',
  'MongoDB': '🍃',
  'PostgreSQL': '🐘',
  'MySQL': '🐬',
  'Redis': '🔴',
  'Git': '📝',
  'Linux': '🐧',
  'Webpack': '📦',
  'Vite': '⚡',
  'Tailwind CSS': '🎨',
  'Bootstrap': '🅱️',
  'Sass': '💄',
  'GraphQL': '💜',
  'REST API': '🔌',
  'Jest': '🃏',
  'Cypress': '🌲',
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
        { id: '1', name: 'JavaScript', level: 95, category: 'Language' as const, icon: '🟨' },
        { id: '2', name: 'React', level: 90, category: 'Framework' as const, icon: '⚛️' },
        { id: '3', name: 'TypeScript', level: 85, category: 'Language' as const, icon: '🔷' },
        { id: '4', name: 'Node.js', level: 80, category: 'Framework' as const, icon: '💚' },
        { id: '5', name: 'Python', level: 88, category: 'Language' as const, icon: '🐍' },
        { id: '6', name: 'HTML', level: 95, category: 'Language' as const, icon: '🌐' },
        { id: '7', name: 'CSS', level: 90, category: 'Language' as const, icon: '🎨' },
        { id: '8', name: 'Next.js', level: 85, category: 'Framework' as const, icon: '▲' },
        { id: '9', name: 'Tailwind CSS', level: 92, category: 'Framework' as const, icon: '🎨' },
        { id: '10', name: 'MongoDB', level: 78, category: 'Framework' as const, icon: '🍃' },
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
    <div className="animate-fade-in space-y-10 font-primary relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full animate-float opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-200 rounded-full animate-float opacity-20" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-200 rounded-full animate-bounce opacity-30"></div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-200 text-purple-700 font-bold animate-bounce">
              <Rocket className="w-5 h-5 mr-3 animate-pulse" />
              Skills Portfolio
            </div>
            <h2 className="text-5xl font-heading font-black text-gradient mb-4">Skills Management</h2>
            <p className="text-xl text-gray-600 font-medium">Showcase your technical expertise with stunning visual effects</p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="btn-magical group relative overflow-hidden"
          >
            <PlusCircle size={20} className="mr-3 group-hover:scale-125 transition-transform duration-500" />
            Add Magical Skill
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </Button>
        </div>

        {showAddForm && (
          <Card className="glass-effect-strong border-3 border-purple-300 animate-zoom-in mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 animate-gradient"></div>
            <CardHeader className="bg-gradient-to-r from-purple-50/90 to-blue-50/90 backdrop-blur-lg relative z-10">
              <CardTitle className="text-3xl text-gradient font-black flex items-center">
                <Zap className="w-8 h-8 mr-4 animate-pulse text-yellow-500" />
                Add New Skill
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label htmlFor="skillName" className="text-lg font-bold text-gray-700 mb-3 block">Skill Name</Label>
                  <Input
                    id="skillName"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="Enter skill name"
                    className="border-3 border-gray-200 focus:border-purple-500 rounded-xl text-lg p-4 transition-all duration-300 hover:shadow-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="skillCategory" className="text-lg font-bold text-gray-700 mb-3 block">Category</Label>
                  <Select
                    value={newSkill.category}
                    onValueChange={(value) => setNewSkill({ ...newSkill, category: value as 'Language' | 'Framework' })}
                  >
                    <SelectTrigger className="border-3 border-gray-200 focus:border-purple-500 rounded-xl text-lg p-4 transition-all duration-300 hover:shadow-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Language">
                        <div className="flex items-center text-lg">
                          <Code size={20} className="mr-3" />
                          Programming Language
                        </div>
                      </SelectItem>
                      <SelectItem value="Framework">
                        <div className="flex items-center text-lg">
                          <Zap size={20} className="mr-3" />
                          Framework/Tool
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="skillLevel" className="text-lg font-bold text-gray-700 mb-4 block">
                  Proficiency Level: <span className="text-3xl text-gradient font-black">{newSkill.level}%</span>
                </Label>
                <input
                  type="range"
                  id="skillLevel"
                  min="0"
                  max="100"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
                  className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer slider transition-all duration-300"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${newSkill.level}%, #e5e7eb ${newSkill.level}%, #e5e7eb 100%)`
                  }}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button onClick={handleAddSkill} className="btn-primary group flex-1 text-lg py-4">
                  <Check size={20} className="mr-3 group-hover:scale-125 transition-transform duration-300" />
                  Add Skill
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="px-8 py-4 border-3 border-gray-300 hover:border-red-500 hover:text-red-600 rounded-xl transition-all duration-300 text-lg"
                >
                  <X size={20} className="mr-3" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-12">
          {/* Languages Section */}
          <Card className="glass-effect-strong border-3 border-purple-300 card-hover-strong relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-indigo-500/10 animate-gradient"></div>
            <CardHeader className="bg-gradient-to-r from-purple-50/90 to-blue-50/90 backdrop-blur-lg relative z-10">
              <CardTitle className="flex items-center gap-4 text-3xl text-gradient font-black">
                <Code size={32} className="animate-wiggle" />
                Programming Languages ({languageSkills.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8 relative z-10">
              {languageSkills.map((skill, index) => (
                <div key={skill.id} className="space-y-4 p-6 border-3 border-gray-100 rounded-2xl hover:border-purple-300 transition-all duration-500 hover:shadow-xl bg-white/90 backdrop-blur-sm animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
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
                        <div className="flex items-center gap-4">
                          <span className="text-5xl skill-icon">{skill.icon}</span>
                          <div>
                            <span className="text-xl font-black text-gray-800">{skill.name}</span>
                            <div className="text-sm text-purple-600 font-bold">Programming Language</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(skill)}
                            className="hover:bg-blue-50 hover:text-blue-600 rounded-xl p-3 transition-all duration-300 hover:scale-110"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSkill(skill.id!)}
                            className="hover:bg-red-50 hover:text-red-600 rounded-xl p-3 transition-all duration-300 hover:scale-110"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                        <div
                          className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out relative animate-gradient"
                          style={{ width: `${skill.level}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-gradient">{skill.level}%</span>
                        <span className="text-sm text-gray-500 ml-2">Proficiency</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {languageSkills.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Code size={64} className="mx-auto mb-6 text-gray-300 animate-bounce" />
                  <p className="text-xl font-bold">No programming languages added yet</p>
                  <p className="text-lg">Start building your skill portfolio!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Frameworks Section */}
          <Card className="glass-effect-strong border-3 border-emerald-300 card-hover-strong relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 animate-gradient"></div>
            <CardHeader className="bg-gradient-to-r from-emerald-50/90 to-teal-50/90 backdrop-blur-lg relative z-10">
              <CardTitle className="flex items-center gap-4 text-3xl text-gradient-secondary font-black">
                <Zap size={32} className="animate-heartbeat" />
                Frameworks & Tools ({frameworkSkills.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8 relative z-10">
              {frameworkSkills.map((skill, index) => (
                <div key={skill.id} className="space-y-4 p-6 border-3 border-gray-100 rounded-2xl hover:border-emerald-300 transition-all duration-500 hover:shadow-xl bg-white/90 backdrop-blur-sm animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
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
                        <div className="flex items-center gap-4">
                          <span className="text-5xl skill-icon">{skill.icon}</span>
                          <div>
                            <span className="text-xl font-black text-gray-800">{skill.name}</span>
                            <div className="text-sm text-emerald-600 font-bold">Framework/Tool</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(skill)}
                            className="hover:bg-blue-50 hover:text-blue-600 rounded-xl p-3 transition-all duration-300 hover:scale-110"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSkill(skill.id!)}
                            className="hover:bg-red-50 hover:text-red-600 rounded-xl p-3 transition-all duration-300 hover:scale-110"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                        <div
                          className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 h-4 rounded-full transition-all duration-1000 ease-out relative animate-gradient"
                          style={{ width: `${skill.level}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-gradient-secondary">{skill.level}%</span>
                        <span className="text-sm text-gray-500 ml-2">Proficiency</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {frameworkSkills.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Zap size={64} className="mx-auto mb-6 text-gray-300 animate-bounce" />
                  <p className="text-xl font-bold">No frameworks or tools added yet</p>
                  <p className="text-lg">Expand your technology stack!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SkillsManager;
