import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link as LinkIcon, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient';

const UploadPage = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const maxSize = 500 * 1024 * 1024; // 500MB
    const allowedTypes = ['video/mp4', 'audio/mp3', 'audio/mpeg', 'application/pdf'];

    if (selectedFile.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 500MB',
        variant: 'destructive'
      });
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Supported formats: MP4, MP3, PDF',
        variant: 'destructive'
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      toast({
        title: 'Title required',
        description: 'Please enter a project title',
        variant: 'destructive'
      });
      return;
    }

    if (!url && !file && !transcript) {
      toast({
        title: 'Content required',
        description: 'Please provide a URL, file, or transcript',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Create project in PocketBase
      const projectData = {
        user_id: currentUser.id,
        title,
        source_url: url || '',
        transcript: transcript || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (file) {
        projectData.source_file = file;
      }

      const project = await pb.collection('projects').create(projectData, { $autoCancel: false });

      toast({
        title: 'Project created!',
        description: 'Processing your content...'
      });

      navigate(`/processing/${project.id}`);
    } catch (error) {
      console.error('Create project error:', error);
      toast({
        title: 'Failed to create project',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Upload Content - RepurposeForge.ai`}</title>
        <meta name="description" content="Upload your content to start repurposing" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">New Repurpose Project</h1>
          <p className="text-gray-400 mb-8">Upload your content to generate unlimited assets</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-gray-300">Project Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-2 bg-gray-800 border-gray-700 text-white"
                placeholder="My Awesome Content"
              />
            </div>

            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="url">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="file">
                  <Upload className="mr-2 h-4 w-4" />
                  File Upload
                </TabsTrigger>
                <TabsTrigger value="transcript">
                  <FileText className="mr-2 h-4 w-4" />
                  Transcript
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="mt-6">
                <Label htmlFor="url" className="text-gray-300">Content URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-2 bg-gray-800 border-gray-700 text-white"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Paste a YouTube, podcast, or article URL
                </p>
              </TabsContent>

              <TabsContent value="file" className="mt-6">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-800'
                  }`}
                >
                  <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-lg mb-2">
                    {file ? file.name : 'Drag and drop your file here'}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    or click to browse (MP4, MP3, PDF - Max 500MB)
                  </p>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    accept="video/mp4,audio/mp3,audio/mpeg,application/pdf"
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload">
                    <Button type="button" variant="outline" className="border-gray-700" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </Label>
                </div>
              </TabsContent>

              <TabsContent value="transcript" className="mt-6">
                <Label htmlFor="transcript" className="text-gray-300">Paste Transcript</Label>
                <Textarea
                  id="transcript"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="mt-2 bg-gray-800 border-gray-700 text-white min-h-[200px]"
                  placeholder="Paste your content transcript here..."
                />
              </TabsContent>
            </Tabs>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="border-gray-700 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
              >
                {loading ? 'Creating Project...' : 'Start Repurposing'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadPage;