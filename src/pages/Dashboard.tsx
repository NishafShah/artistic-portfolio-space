
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, LogOut, Trash, Edit, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsManager from '@/components/dashboard/ProjectsManager';
import SkillsManager from '@/components/dashboard/SkillsManager';
import CoursesManager from '@/components/dashboard/CoursesManager';
import ResumeManager from '@/components/dashboard/ResumeManager';
import AboutManager from '@/components/dashboard/AboutManager';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Welcome, Nishaf Shah</p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            onClick={handleLogout}
          >
            <LogOut size={18} className="animate-bounce" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 animate-fade-in">
            <TabsTrigger value="projects" className="transition-all duration-300 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">Projects</TabsTrigger>
            <TabsTrigger value="skills" className="transition-all duration-300 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">Skills</TabsTrigger>
            <TabsTrigger value="courses" className="transition-all duration-300 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">Courses</TabsTrigger>
            <TabsTrigger value="resume" className="transition-all duration-300 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">Resume</TabsTrigger>
            <TabsTrigger value="about" className="transition-all duration-300 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>
          
          <TabsContent value="skills">
            <SkillsManager />
          </TabsContent>
          
          <TabsContent value="courses">
            <CoursesManager />
          </TabsContent>
          
          <TabsContent value="resume">
            <ResumeManager />
          </TabsContent>
          
          <TabsContent value="about">
            <AboutManager />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center animate-fade-in">
          <Button 
            variant="link" 
            onClick={() => navigate('/')} 
            className="text-purple-600 transition-all duration-300 hover:text-purple-800 hover:scale-105"
          >
            Return to Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
