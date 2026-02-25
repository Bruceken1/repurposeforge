import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import { Button } from '@/components/ui/button';
import { Download, Copy, Share2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import apiServerClient from '@/lib/apiServerClient';

const ExportPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleZipDownload = async () => {
    setLoading(true);
    try {
      const response = await apiServerClient.fetch(`/projects/${projectId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exportType: 'zip' })
      });

      if (!response.ok) throw new Error('Export failed');

      const data = await response.json();
      toast({
        title: 'Export ready!',
        description: 'Your ZIP file is being prepared for download'
      });

      // Simulate download
      window.open(data.downloadUrl || '#', '_blank');
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = async () => {
    try {
      const response = await apiServerClient.fetch(`/projects/${projectId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exportType: 'clipboard' })
      });

      if (!response.ok) throw new Error('Copy failed');

      toast({
        title: 'Copied to clipboard!',
        description: 'All text assets have been copied'
      });
    } catch (error) {
      console.error('Copy error:', error);
      toast({
        title: 'Copy failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDirectExport = (platform) => {
    toast({
      title: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀',
      description: `${platform} integration coming soon`
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Export Assets - RepurposeForge.ai`}</title>
        <meta name="description" content="Export your generated assets" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">Export Assets</h1>
          <p className="text-gray-400 mb-8">Download or share your repurposed content</p>

          <div className="space-y-6">
            {/* ZIP Download */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <Download className="mr-2 h-5 w-5 text-blue-500" />
                    Download All Assets
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Download all assets in organized folders (shorts, threads, carousels, etc.)
                  </p>
                </div>
                <Button
                  onClick={handleZipDownload}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Preparing...' : 'Download ZIP'}
                </Button>
              </div>
            </div>

            {/* Copy All Text */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <Copy className="mr-2 h-5 w-5 text-green-500" />
                    Copy All Text Assets
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Copy all threads, captions, and text content to clipboard
                  </p>
                </div>
                <Button
                  onClick={handleCopyAll}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Copy All
                </Button>
              </div>
            </div>

            {/* Direct Exports */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Share2 className="mr-2 h-5 w-5 text-purple-500" />
                Direct Platform Exports
              </h3>
              <p className="text-gray-400 mb-6">
                Export directly to your favorite platforms
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="border-gray-700 hover:bg-gray-700"
                  onClick={() => handleDirectExport('WhatsApp Status')}
                >
                  WhatsApp Status
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-700 hover:bg-gray-700"
                  onClick={() => handleDirectExport('Buffer')}
                >
                  Buffer
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-700 hover:bg-gray-700"
                  onClick={() => handleDirectExport('Hootsuite')}
                >
                  Hootsuite
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-700 hover:bg-gray-700"
                  onClick={() => handleDirectExport('Later')}
                >
                  Later
                </Button>
              </div>
            </div>

            {/* Scheduling */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-orange-500" />
                    Schedule Posts
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Schedule your content across multiple platforms
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-gray-700 hover:bg-gray-700"
                  onClick={() => handleDirectExport('Scheduling')}
                >
                  Schedule
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/asset-preview/${projectId}`)}
                className="border-gray-700 hover:bg-gray-800"
              >
                Back to Assets
              </Button>
              <Button
                onClick={() => navigate('/export-history')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                View Export History
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExportPage;