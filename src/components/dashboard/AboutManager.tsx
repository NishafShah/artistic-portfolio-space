
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AboutManager = () => {
  const [name, setName] = useState('Nishaf Shah');
  const [title, setTitle] = useState('a passionate developer with over 5 years of experience');
  const [bio, setBio] = useState(
    "I'm Nishaf Shah, a passionate developer with over 5 years of experience in creating beautiful and functional web applications. I specialize in modern web technologies and love bringing ideas to life through clean, elegant code.\n\nWhen I'm not coding, you can find me exploring new technologies, contributing to open source projects, or sharing my knowledge through technical writing. I believe in continuous learning and staying at the cutting edge of web development."
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load about data from Supabase on component mount
  useEffect(() => {
    const loadAboutData = async () => {
      const { data, error } = await supabase
        .from('about_me')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error loading about data:', error);
      } else if (data) {
        setName(data.name || name);
        setTitle(data.title || title);
        setBio(data.bio || bio);
      }
    };
    
    loadAboutData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Check if record exists
      const { data: existingData } = await supabase
        .from('about_me')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('about_me')
          .update({ name, title, bio })
          .eq('id', existingData.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('about_me')
          .insert([{ name, title, bio }]);
        
        if (error) throw error;
      }
      
      setTimeout(() => {
        toast({
          title: "Changes saved",
          description: "Your about section has been updated successfully",
        });
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving about data:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">About Section Management</CardTitle>
          <CardDescription>
            Update your about section information that appears on your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name">Your Name</Label>
            <div className="relative">
              <Input
                id="name"
                placeholder="Nishaf Shah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="transition-all duration-300 hover:border-purple-400 focus:border-purple-500"
              />
              <Edit className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="title">Professional Title</Label>
            <div className="relative">
              <Input
                id="title"
                placeholder="Web Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="transition-all duration-300 hover:border-purple-400 focus:border-purple-500"
              />
              <Edit className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="bio">Your Bio</Label>
            <div className="relative">
              <Textarea
                id="bio"
                placeholder="Write about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-[200px] resize-y transition-all duration-300 hover:border-purple-400 focus:border-purple-500"
              />
              <Edit className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-purple-600 hover:bg-purple-700 w-full transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {isSaving ? 'Saving...' : 'Save Changes'} 
              {!isSaving && <Check size={18} className="animate-bounce" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutManager;
