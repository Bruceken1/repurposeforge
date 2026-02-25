import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';

const ForgeAllButton = ({ projectId, onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');

  const stages = [
    'Generating Shorts & Reels',
    'Creating Captions & Hashtags',
    'Building Carousels',
    'Writing Threads & Posts',
    'Crafting Newsletters',
    'Designing Pins & Quotes',
    'Generating Audio Teasers',
    'Finalizing Assets'
  ];

  const handleForgeAll = async () => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate progress through stages
    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(stages[i]);
      setProgress(((i + 1) / stages.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const response = await apiServerClient.fetch(`/projects/${projectId}/forge-all`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to generate assets');

      const data = await response.json();
      
      setIsProcessing(false);
      if (onComplete) onComplete(data);
    } catch (error) {
      console.error('Forge all error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleForgeAll}
        disabled={isProcessing}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Forge All Assets
      </Button>

      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Generating All Assets</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-400">{currentStage}</p>
            <p className="text-xs text-gray-500">
              {Math.round(progress)}% complete
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForgeAllButton;