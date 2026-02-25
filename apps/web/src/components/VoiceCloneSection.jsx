import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import apiServerClient from '@/lib/apiServerClient';

const VoiceCloneSection = ({ projectId }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [isCloning, setIsCloning] = useState(false);
  const [isCloned, setIsCloned] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an audio file',
          variant: 'destructive'
        });
      }
    }
  };

  const handleCloneVoice = async () => {
    if (!audioFile) {
      toast({
        title: 'No audio file',
        description: 'Please upload a 20-second audio sample first',
        variant: 'destructive'
      });
      return;
    }

    setIsCloning(true);

    try {
      // Convert file to base64 for API
      const reader = new FileReader();
      reader.readAsDataURL(audioFile);
      reader.onload = async () => {
        const base64Audio = reader.result.split(',')[1];

        const response = await apiServerClient.fetch('/voice-clone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioFile: base64Audio })
        });

        if (!response.ok) throw new Error('Voice cloning failed');

        const data = await response.json();
        setIsCloned(true);
        toast({
          title: 'Voice cloned successfully!',
          description: data.message || 'Your voice has been cloned and applied to all audio assets'
        });
      };
    } catch (error) {
      console.error('Voice clone error:', error);
      toast({
        title: 'Voice cloning failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Mic className="mr-2 h-5 w-5 text-blue-500" />
          Voice Cloning
        </h3>
        {isCloned && (
          <div className="flex items-center text-green-500 text-sm">
            <Check className="mr-1 h-4 w-4" />
            Voice Cloned
          </div>
        )}
      </div>

      <p className="text-sm text-gray-400 mb-4">
        Upload a 20-second audio sample to clone your voice for all TTS assets
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="voice-sample" className="text-gray-300">
            Audio Sample (20 seconds)
          </Label>
          <Input
            id="voice-sample"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="mt-2 bg-gray-900 border-gray-700 text-white"
          />
        </div>

        <Button
          onClick={handleCloneVoice}
          disabled={!audioFile || isCloning || isCloned}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isCloning ? 'Cloning Voice...' : isCloned ? 'Voice Cloned' : 'Clone Voice'}
        </Button>

        <p className="text-xs text-gray-500">
          Powered by ElevenLabs (Integration placeholder)
        </p>
      </div>
    </div>
  );
};

export default VoiceCloneSection;