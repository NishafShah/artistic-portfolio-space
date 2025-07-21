
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash, Edit, Check, X, Code, Zap, Upload, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Skill {
  id?: string;
  name: string;
  level: number;
  category: 'Language' | 'Framework';
  icon?: string;
  imageUrl?: string;
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
  'Tailwind CSS': '🎨',
  'Bootstrap': '🅱️',
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSkills = async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) {
        console.error('Error loading skills:', error);
        // Load default skills if none exist
        if (error.code === 'PGRST116') {
          const defaultSkills: Skill[] = [
            { name: 'JavaScript', level: 95, category: 'Language' as const, icon: '🟨' },
            { name: 'React', level: 90, category: 'Framework' as const, icon: '⚛️' },
            { name: 'TypeScript', level: 85, category: 'Language' as const, icon: '🔷' },
            { name: 'Node.js', level: 80, category: 'Framework' as const, icon: '💚' },
            { name: 'Python', level: 88, category: 'Language' as const, icon: '🐍' },
            { name: 'HTML', level: 95, category: 'Language' as const, icon: '🌐' },
            { name: 'CSS', level: 90, category: 'Language' as const, icon: '🎨' },
            { name: 'Next.js', level: 85, category: 'Framework' as const, icon: '▲' },
          ];
          setSkills(defaultSkills);
        }
      } else {
        const formattedSkills = data.map(skill => ({
          id: skill.id,
          name: skill.name,
          level: skill.level,
          category: skill.category as 'Language' | 'Framework',
          icon: skill.icon,
          imageUrl: skill.image_url,
        }));
        setSkills(formattedSkills);
      }
    };
    
    loadSkills();
  }, []);

  const saveSkills = async (updatedSkills: Skill[]) => {
    setSkills(updatedSkills);
    // Dispatch custom event to notify SkillsSection
    window.dispatchEvent(new CustomEvent('skillsUpdated'));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false, skillId?: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      if (isEdit) {
        setEditData({ ...editData, imageUrl, icon: undefined });
      } else {
        setNewSkill({ ...newSkill, imageUrl, icon: undefined });
      }
      
      setUploadingImage(false);
      toast({
        title: "Success!",
        description: "Image uploaded successfully",
      });
      
      // Clear the input
      event.target.value = '';
    };
    
    reader.onerror = () => {
      setUploadingImage(false);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(file);
  };

  const handleAddSkill = async () => {
    if (!newSkill.name) {
      toast({
        title: "Error",
        description: "Please enter a skill name",
        variant: "destructive",
      });
      return;
    }

    try {
      const skillData = {
        name: newSkill.name,
        level: newSkill.level,
        category: newSkill.category,
        icon: newSkill.imageUrl ? undefined : (defaultSkillIcons[newSkill.name as keyof typeof defaultSkillIcons] || (newSkill.category === 'Language' ? '💻' : '🔧')),
        image_url: newSkill.imageUrl,
        order_index: skills.length,
      };

      const { data, error } = await supabase
        .from('skills')
        .insert([skillData])
        .select()
        .single();

      if (error) throw error;

      const newSkillWithId = {
        id: data.id,
        name: data.name,
        level: data.level,
        category: data.category as 'Language' | 'Framework',
        icon: data.icon,
        imageUrl: data.image_url,
      };

      const updatedSkills = [...skills, newSkillWithId];
      await saveSkills(updatedSkills);
      setNewSkill({ name: '', level: 50, category: 'Language' });
      setShowAddForm(false);
      
      toast({
        title: "Success!",
        description: "New skill has been added successfully",
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      const updatedSkills = skills.filter(skill => skill.id !== skillId);
      await saveSkills(updatedSkills);
      
      toast({
        title: "Deleted",
        description: "Skill has been removed successfully",
      });
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  const startEdit = (skill: Skill) => {
    setEditingSkill(skill.id!);
    setEditData(skill);
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    setEditData({ name: '', level: 50, category: 'Language' });
  };

  const saveEdit = async () => {
    try {
      const { error } = await supabase
        .from('skills')
        .update({
          name: editData.name,
          level: editData.level,
          category: editData.category,
          icon: editData.imageUrl ? undefined : (defaultSkillIcons[editData.name as keyof typeof defaultSkillIcons] || (editData.category === 'Language' ? '💻' : '🔧')),
          image_url: editData.imageUrl,
        })
        .eq('id', editingSkill);

      if (error) throw error;

      const updatedSkills = skills.map(skill => 
        skill.id === editingSkill ? {
          ...editData,
          id: skill.id,
          icon: editData.imageUrl ? undefined : (defaultSkillIcons[editData.name as keyof typeof defaultSkillIcons] || (editData.category === 'Language' ? '💻' : '🔧'))
        } : skill
      );
      await saveSkills(updatedSkills);
      setEditingSkill(null);
      setEditData({ name: '', level: 50, category: 'Language' });
      
      toast({
        title: "Updated!",
        description: "Skill has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating skill:', error);
      toast({
        title: "Error",
        description: "Failed to update skill",
        variant: "destructive",
      });
    }
  };

  const languageSkills = skills.filter(skill => skill.category === 'Language');
  const frameworkSkills = skills.filter(skill => skill.category === 'Framework');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Skills Management</h2>
          <p className="text-gray-600">Add and manage your technical skills</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle size={20} className="mr-2" />
          Add Skill
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-700">Add New Skill</CardTitle>
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
                    <SelectItem value="Language">Programming Language</SelectItem>
                    <SelectItem value="Framework">Framework/Tool</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Proficiency Level: {newSkill.level}%</Label>
              <input
                type="range"
                min="0"
                max="100"
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              />
            </div>

            <div>
              <Label>Icon/Image</Label>
              <div className="flex items-center gap-4 mt-2">
                {newSkill.imageUrl ? (
                  <img src={newSkill.imageUrl} alt="Skill icon" className="w-12 h-12 rounded-lg object-cover" />
                ) : newSkill.icon ? (
                  <span className="text-3xl">{newSkill.icon}</span>
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image size={24} className="text-gray-400" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="hidden"
                    id="new-skill-image-upload"
                    key={`new-skill-upload-${Date.now()}`}
                  />
                  <Label htmlFor="new-skill-image-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" disabled={uploadingImage} asChild>
                      <span>
                        <Upload size={16} className="mr-2" />
                        {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Upload an image or use default icon</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddSkill} className="bg-green-600 hover:bg-green-700">
                <Check size={16} className="mr-2" />
                Add Skill
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Languages Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code size={24} />
              Programming Languages ({languageSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {languageSkills.map((skill) => (
              <div key={skill.id} className="space-y-2 p-4 border rounded-lg">
                {editingSkill === skill.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editData.level}
                      onChange={(e) => setEditData({ ...editData, level: Number(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex items-center gap-2">
                      {editData.imageUrl ? (
                        <img src={editData.imageUrl} alt="Skill icon" className="w-8 h-8 rounded object-cover" />
                      ) : editData.icon ? (
                        <span className="text-2xl">{editData.icon}</span>
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true, skill.id)}
                          className="hidden"
                          id={`edit-image-lang-${skill.id}`}
                          key={`edit-lang-${skill.id}-${Date.now()}`}
                        />
                        <Label htmlFor={`edit-image-lang-${skill.id}`} className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm" asChild>
                            <span>
                              <Upload size={14} />
                            </span>
                          </Button>
                        </Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Check size={14} />
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" size="sm">
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {skill.imageUrl ? (
                          <img src={skill.imageUrl} alt={skill.name} className="w-8 h-8 rounded object-cover" />
                        ) : skill.icon ? (
                          <span className="text-2xl">{skill.icon}</span>
                        ) : (
                          <div className="w-8 h-8 bg-blue-500 rounded text-white flex items-center justify-center text-sm font-bold">
                            {skill.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-semibold">{skill.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(skill)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSkill(skill.id!)}>
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm font-semibold">{skill.level}%</div>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Frameworks Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap size={24} />
              Frameworks & Tools ({frameworkSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {frameworkSkills.map((skill) => (
              <div key={skill.id} className="space-y-2 p-4 border rounded-lg">
                {editingSkill === skill.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editData.level}
                      onChange={(e) => setEditData({ ...editData, level: Number(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex items-center gap-2">
                      {editData.imageUrl ? (
                        <img src={editData.imageUrl} alt="Skill icon" className="w-8 h-8 rounded object-cover" />
                      ) : editData.icon ? (
                        <span className="text-2xl">{editData.icon}</span>
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true, skill.id)}
                          className="hidden"
                          id={`edit-image-frame-${skill.id}`}
                          key={`edit-frame-${skill.id}-${Date.now()}`}
                        />
                        <Label htmlFor={`edit-image-frame-${skill.id}`} className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm" asChild>
                            <span>
                              <Upload size={14} />
                            </span>
                          </Button>
                        </Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Check size={14} />
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" size="sm">
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {skill.imageUrl ? (
                          <img src={skill.imageUrl} alt={skill.name} className="w-8 h-8 rounded object-cover" />
                        ) : skill.icon ? (
                          <span className="text-2xl">{skill.icon}</span>
                        ) : (
                          <div className="w-8 h-8 bg-emerald-500 rounded text-white flex items-center justify-center text-sm font-bold">
                            {skill.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-semibold">{skill.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(skill)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSkill(skill.id!)}>
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm font-semibold">{skill.level}%</div>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillsManager;
