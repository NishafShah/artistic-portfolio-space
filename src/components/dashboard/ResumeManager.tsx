
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download } from 'lucide-react';

const ResumeManager = () => {
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeName, setResumeName] = useState('resume.pdf');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if there's a stored resume name
    const storedResumeName = localStorage.getItem('portfolio_resume_name');
    if (storedResumeName) {
      setResumeName(storedResumeName);
    }

    // Check if there's a stored resume URL
    const storedResumeUrl = localStorage.getItem('portfolio_resume_url');
    if (storedResumeUrl) {
      setResumeUrl(storedResumeUrl);
    }
  }, []);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }
    
    setUploadingResume(true);
    setResumeName(file.name);
    setResumeFile(file);
    
    // Create a URL for the file
    const fileUrl = URL.createObjectURL(file);
    setResumeUrl(fileUrl);
    
    // Store in localStorage
    localStorage.setItem('portfolio_resume_name', file.name);
    localStorage.setItem('portfolio_resume_url', fileUrl);
    
    setTimeout(() => {
      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully",
      });
      setUploadingResume(false);
    }, 1500);
  };

  const handleDownload = () => {
    if (resumeUrl) {
      // Create a link to the resume PDF and trigger download
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = resumeName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Resume download started",
        description: "Your resume is being downloaded",
      });
    } else {
      toast({
        title: "No resume available",
        description: "Please upload a resume first",
        variant: "destructive",
      });
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "Your resume has been updated successfully",
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
              <p className="text-lg font-medium text-gray-700 mb-1">Click to upload your resume</p>
              <p className="text-sm text-gray-500">PDF (max 5MB)</p>
            </label>
          </div>

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
