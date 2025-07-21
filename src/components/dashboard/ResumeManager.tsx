import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Upload, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ResumeManager = () => {
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeName, setResumeName] = useState('resume.pdf');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Load the most recently uploaded resume using localStorage fallback
  const loadResume = async () => {
    const latestFileName = localStorage.getItem('latestResumeName');

    if (latestFileName) {
      const { data } = supabase
        .storage
        .from('project-images')
        .getPublicUrl(`resumes/${latestFileName}`);

      setResumeName(latestFileName);
      setResumeUrl(`${data.publicUrl}?t=${Date.now()}`);
    } else {
      // Fallback to latest from list if no localStorage
      const { data: files, error } = await supabase.storage
        .from('project-images')
        .list('resumes', {
          limit: 1,
          sortBy: { column: 'name', order: 'desc' },
        });

      if (!error && files && files.length > 0) {
        const file = files[0];
        setResumeName(file.name);

        const { data } = supabase.storage
          .from('project-images')
          .getPublicUrl(`resumes/${file.name}`);

        setResumeUrl(`${data.publicUrl}?t=${Date.now()}`);
      }
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingResume(true);

    try {
      const fileName = `resume_${Date.now()}.pdf`;

      const { error } = await supabase.storage
        .from('project-images')
        .upload(`resumes/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      localStorage.setItem('latestResumeName', fileName);
      await loadResume(); // refresh display
      setResumeFile(file);

      toast({
        title: 'Resume uploaded',
        description: 'Your resume has been uploaded successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDownload = () => {
    if (resumeUrl) {
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = resumeName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Resume download started',
        description: 'Your resume is being downloaded',
      });
    } else {
      toast({
        title: 'No resume available',
        description: 'Please upload a resume first',
        variant: 'destructive',
      });
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: 'Changes saved',
      description: 'Your resume has been updated successfully',
    });
  };

  return (
    <div className="animate-fade-in">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Resume Management</CardTitle>
          <CardDescription>
            Upload your latest resume to make it available for download on your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-300 hover:border-purple-400">
            <input
              type="file"
              id="resumeUpload"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="hidden"
              ref={fileInputRef}
            />
            <label
              htmlFor="resumeUpload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="h-12 w-12 text-gray-400 mb-2 animate-bounce" />
              <p className="text-lg font-medium text-gray-700 mb-1">
                Click to upload your resume
              </p>
              <p className="text-sm text-gray-500">PDF (max 5MB)</p>
            </label>
          </div>

          {/* Download Section */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100">
            <div>
              <h3 className="font-medium">Current Resume</h3>
              <p className="text-sm text-gray-500">{resumeName}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-1 transition-transform hover:scale-105"
                onClick={handleDownload}
                disabled={!resumeUrl}
              >
                <Download size={16} className="animate-bounce" /> Download
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button
              disabled={uploadingResume}
              className="bg-purple-600 hover:bg-purple-700 w-full transition-all duration-300 hover:scale-[1.02]"
              onClick={handleSaveChanges}
            >
              {uploadingResume ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeManager;
