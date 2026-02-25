import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';

const SidebarFilters = ({ onFilterApply }) => {
  const [selectedFilter, setSelectedFilter] = useState('full-blast');
  const [customAssets, setCustomAssets] = useState({
    shorts: true,
    captions: true,
    hashtags: true,
    carousels: true,
    threads: true,
    newsletters: true,
    pins: true,
    quotes: true,
    audioTeasers: true
  });

  const presets = [
    {
      id: 'tiktok-heavy',
      name: 'TikTok Heavy',
      description: 'Prioritize shorts, captions, and hashtags',
      assets: { shorts: true, captions: true, hashtags: true, carousels: false, threads: false, newsletters: false, pins: false, quotes: false, audioTeasers: true }
    },
    {
      id: 'linkedin-pro',
      name: 'LinkedIn Pro',
      description: 'Focus on carousels, threads, and newsletters',
      assets: { shorts: false, captions: false, hashtags: false, carousels: true, threads: true, newsletters: true, pins: false, quotes: true, audioTeasers: false }
    },
    {
      id: 'full-blast',
      name: 'Full Blast',
      description: 'Generate all asset types',
      assets: { shorts: true, captions: true, hashtags: true, carousels: true, threads: true, newsletters: true, pins: true, quotes: true, audioTeasers: true }
    }
  ];

  const handlePresetClick = (preset) => {
    setSelectedFilter(preset.id);
    if (onFilterApply) {
      onFilterApply(preset.assets);
    }
  };

  const handleCustomApply = () => {
    setSelectedFilter('custom');
    if (onFilterApply) {
      onFilterApply(customAssets);
    }
  };

  const toggleCustomAsset = (asset) => {
    setCustomAssets(prev => ({ ...prev, [asset]: !prev[asset] }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center">
        <Filter className="mr-2 h-5 w-5" />
        Asset Filters
      </h3>

      <div className="space-y-2">
        {presets.map(preset => (
          <Button
            key={preset.id}
            variant={selectedFilter === preset.id ? 'default' : 'outline'}
            className={`w-full justify-start ${
              selectedFilter === preset.id 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
            }`}
            onClick={() => handlePresetClick(preset)}
          >
            <div className="text-left">
              <div className="font-semibold">{preset.name}</div>
              <div className="text-xs text-gray-400">{preset.description}</div>
            </div>
          </Button>
        ))}

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={selectedFilter === 'custom' ? 'default' : 'outline'}
              className={`w-full justify-start ${
                selectedFilter === 'custom' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold">Custom</div>
                <div className="text-xs text-gray-400">Select specific assets</div>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Custom Asset Selection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {Object.keys(customAssets).map(asset => (
                <div key={asset} className="flex items-center space-x-2">
                  <Checkbox
                    id={asset}
                    checked={customAssets[asset]}
                    onCheckedChange={() => toggleCustomAsset(asset)}
                  />
                  <Label htmlFor={asset} className="text-sm capitalize cursor-pointer">
                    {asset.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                </div>
              ))}
              <Button onClick={handleCustomApply} className="w-full bg-blue-600 hover:bg-blue-700">
                Apply Custom Filter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SidebarFilters;