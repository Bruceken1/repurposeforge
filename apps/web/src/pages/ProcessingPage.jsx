import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';

const ProcessingPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(5);

  const stages = [
    { name: 'Transcription', duration: 1000 },
    { name: 'Content Analysis', duration: 1000 },
    { name: 'Asset Generation', duration: 2000 },
    { name: 'Optimization', duration: 1000 }
  ];

  useEffect(() => {
    processProject();
  }, []);

  const processProject = async () => {
    let totalProgress = 0;
    const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);

    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(stages[i].name);
      
      const stageProgress = (stages[i].duration / totalDuration) * 100;
      const steps = 20;
      const increment = stageProgress / steps;

      for (let j = 0; j < steps; j++) {
        await new Promise(resolve => setTimeout(resolve, stages[i].duration / steps));
        totalProgress += increment;
        setProgress(Math.min(totalProgress, 100));
        setEstimatedTime(Math.max(0, Math.ceil((100 - totalProgress) / 20)));
      }
    }

    // Call backend to process project
    try {
      const response = await apiServerClient.fetch(`/projects/${projectId}/process`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Processing failed');

      const data = await response.json();
      navigate(`/asset-preview/${projectId}`, { state: { assets: data.assets } });
    } catch (error) {
      console.error('Processing error:', error);
      navigate(`/asset-preview/${projectId}`);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <Helmet>
        <title>{`Processing - RepurposeForge.ai`}</title>
        <meta name="description" content="Processing your content" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />

        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h1 className="text-3xl font-bold mb-2 text-center">Processing Your Content</h1>
            <p className="text-gray-400 text-center mb-8">
              Generating unlimited assets from your content...
            </p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">{currentStage}</span>
                  <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Progress</p>
                    <p className="text-2xl font-bold">{Math.round(progress)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Time Remaining</p>
                    <p className="text-2xl font-bold">{estimatedTime}s</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {stages.map((stage, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      currentStage === stage.name
                        ? 'bg-blue-600/20 border border-blue-500'
                        : progress > ((index + 1) / stages.length) * 100
                        ? 'bg-green-600/20 border border-green-500'
                        : 'bg-gray-900 border border-gray-700'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        currentStage === stage.name
                          ? 'bg-blue-500 animate-pulse'
                          : progress > ((index + 1) / stages.length) * 100
                          ? 'bg-green-500'
                          : 'bg-gray-600'
                      }`}
                    />
                    <span className="text-sm">{stage.name}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full border-gray-700 hover:bg-gray-700"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Processing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcessingPage;