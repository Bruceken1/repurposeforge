import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useToast } from '@/hooks/use-toast';

const ExportHistoryPage = () => {
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchExports();
  }, []);

  const fetchExports = async () => {
    try {
      const records = await pb.collection('exports').getFullList({
        filter: `user_id = "${pb.authStore.model.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setExports(records);
    } catch (error) {
      console.error('Fetch exports error:', error);
      toast({
        title: 'Failed to load exports',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (exportRecord) => {
    if (exportRecord.file_url) {
      window.open(exportRecord.file_url, '_blank');
    } else {
      toast({
        title: 'Download not available',
        description: 'This export file is no longer available',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Export History - RepurposeForge.ai`}</title>
        <meta name="description" content="View your export history" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Export History</h1>
              <p className="text-gray-400">View and download your past exports</p>
            </div>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-gray-700 hover:bg-gray-800"
            >
              Back to Dashboard
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
              <p className="text-gray-400 mt-4">Loading exports...</p>
            </div>
          ) : exports.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
              <Download className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No exports yet</h3>
              <p className="text-gray-400 mb-6">Your export history will appear here</p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Project
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {exports.map((exportRecord) => (
                <div
                  key={exportRecord.id}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {exportRecord.export_type || 'Export'} - Project {exportRecord.project_id}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="mr-2 h-4 w-4" />
                        {new Date(exportRecord.created_at || exportRecord.created).toLocaleString()}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(exportRecord)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExportHistoryPage;