
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download } from 'lucide-react';

const ResumeManager = () => {
  const [uploadingResume, setUploadingResume] = useState(false);
  const { toast } = useToast();

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
    
    // This is just a mock implementation since we can't actually upload files in this demo
    // In a real app, this would upload the file to a server
    setTimeout(() => {
      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully",
      });
      setUploadingResume(false);
    }, 2000);
  };

  return (
    <div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Resume Management</CardTitle>
          <CardDescription>
            Upload your latest resume to make it available for download on your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="resumeUpload"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="hidden"
            />
            <label
              htmlFor="resumeUpload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-lg font-medium text-gray-700 mb-1">Click to upload your resume</p>
              <p className="text-sm text-gray-500">PDF (max 5MB)</p>
            </label>
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">Current Resume</h3>
              <p className="text-sm text-gray-500">resume.pdf</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-1">
                <Download size={16} /> Download
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              disabled={uploadingResume}
              className="bg-purple-600 hover:bg-purple-700 w-full"
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
