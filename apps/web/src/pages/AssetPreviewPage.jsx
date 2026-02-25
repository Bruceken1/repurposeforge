import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import ForgeAllButton from '@/components/ForgeAllButton.jsx';
import SidebarFilters from '@/components/SidebarFilters.jsx';
import VoiceCloneSection from '@/components/VoiceCloneSection.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Download, Copy, Play, Edit, TrendingUp, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import apiServerClient from '@/lib/apiServerClient';

const AssetPreviewPage = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assets, setAssets] = useState(location.state?.assets || null);
  const [loading, setLoading] = useState(!assets);

  useEffect(() => {
    if (!assets) {
      fetchAssets();
    }
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await apiServerClient.fetch(`/projects/${projectId}/assets`);
      if (!response.ok) throw new Error('Failed to fetch assets');
      const data = await response.json();
      
      // Transform array to grouped object if needed
      if (Array.isArray(data)) {
        const grouped = data.reduce((acc, asset) => {
          const type = asset.type || asset.asset_type;
          if (!acc[type]) acc[type] = [];
          acc[type].push(asset);
          return acc;
        }, {});
        setAssets(grouped);
      } else {
        setAssets(data);
      }
    } catch (error) {
      console.error('Fetch assets error:', error);
      // Set mock data if fetch fails
      setAssets(generateMockAssets());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAssets = () => ({
    shorts: Array(6).fill(null).map((_, i) => ({
      id: `short-${i}`,
      title: `Viral Short #${i + 1}`,
      videoUrl: '#',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
      duration: '0:45',
      captionUrl: '#',
      hashtags: ['#viral', '#trending', '#content']
    })),
    captions: Array(3).fill(null).map((_, i) => ({
      id: `caption-${i}`,
      text: 'Sample caption text for your video...',
      format: 'SRT',
      downloadUrl: '#'
    })),
    hashtags: Array(5).fill(null).map((_, i) => ({
      id: `hashtag-${i}`,
      tags: ['#contentcreator', '#viral', '#trending', '#socialmedia'],
      platform: 'TikTok'
    })),
    titles: Array(5).fill(null).map((_, i) => ({
      id: `title-${i}`,
      text: `Engaging Title Variation ${i + 1}`,
      platform: 'YouTube'
    })),
    carousels: Array(3).fill(null).map((_, i) => ({
      id: `carousel-${i}`,
      title: `LinkedIn Carousel ${i + 1}`,
      images: Array(5).fill('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400'),
      platform: 'LinkedIn',
      exportUrl: '#'
    })),
    threads: Array(2).fill(null).map((_, i) => ({
      id: `thread-${i}`,
      tweets: Array(8).fill(null).map((_, j) => `Tweet ${j + 1}: Engaging content about your topic...`),
      platform: 'X/Twitter'
    })),
    newsletters: Array(2).fill(null).map((_, i) => ({
      id: `newsletter-${i}`,
      subject: `Newsletter Subject ${i + 1}`,
      body: 'Newsletter body content goes here...',
      format: 'HTML'
    })),
    pins: Array(4).fill(null).map((_, i) => ({
      id: `pin-${i}`,
      title: `Pinterest Pin ${i + 1}`,
      description: 'Engaging pin description...',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400'
    })),
    quotes: Array(5).fill(null).map((_, i) => ({
      id: `quote-${i}`,
      text: 'Inspirational quote text goes here',
      author: 'Author Name',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400'
    })),
    audioTeasers: Array(3).fill(null).map((_, i) => ({
      id: `audio-${i}`,
      title: `Audio Teaser ${i + 1}`,
      audioUrl: '#',
      duration: '0:30',
      voiceCloned: false
    }))
  });

  const handleCopyAll = (items) => {
    const text = items.map(item => item.text || item.title).join('\n\n');
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };

  const handleDownload = (url) => {
    toast({ title: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀' });
  };

  const handleExport = () => {
    navigate(`/export/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
          <p className="text-gray-400 mt-4">Loading assets...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Asset Preview - RepurposeForge.ai`}</title>
        <meta name="description" content="Preview and manage your generated assets" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Generated Assets</h1>
              <p className="text-gray-400">Review and export your repurposed content</p>
            </div>
            <div className="flex gap-4">
              <ForgeAllButton projectId={projectId} onComplete={(data) => setAssets(data.assets)} />
              <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <SidebarFilters onFilterApply={(filter) => console.log('Filter applied:', filter)} />
              <div className="mt-6">
                <VoiceCloneSection projectId={projectId} />
              </div>
            </div>

            {/* Assets Grid */}
            <div className="lg:col-span-3 space-y-12">
              {/* Vertical Assets - Shorts */}
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Play className="mr-2 h-6 w-6 text-blue-500" />
                  Shorts & Reels ({assets?.shorts?.length || 0})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assets?.shorts?.map((short, index) => (
                    <motion.div
                      key={short.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all"
                    >
                      <img src={short.thumbnailUrl} alt={short.title} className="w-full aspect-[9/16] object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{short.title}</h3>
                        <p className="text-sm text-gray-400 mb-3">{short.duration}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 border-gray-700" onClick={() => handleDownload(short.captionUrl)}>
                            <Download className="mr-1 h-3 w-3" />
                            SRT
                          </Button>
                          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => toast({ title: '🚧 CapCut integration coming soon! 🚀' })}>
                            <ExternalLink className="mr-1 h-3 w-3" />
                            CapCut
                          </Button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {short.hashtags.map((tag, i) => (
                            <span key={i} className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Horizontal Assets - Carousels */}
              <section>
                <h2 className="text-2xl font-bold mb-4">LinkedIn & Instagram Carousels ({assets?.carousels?.length || 0})</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {assets?.carousels?.map((carousel, index) => (
                    <motion.div
                      key={carousel.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all"
                    >
                      <h3 className="font-semibold mb-3">{carousel.title}</h3>
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {carousel.images.slice(0, 5).map((img, i) => (
                          <img key={i} src={img} alt={`Slide ${i + 1}`} className="w-full aspect-square object-cover rounded" />
                        ))}
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleDownload(carousel.exportUrl)}>
                        <Download className="mr-2 h-4 w-4" />
                        Export as PDF
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Text Assets - Threads */}
              <section>
                <h2 className="text-2xl font-bold mb-4">X/Twitter Threads ({assets?.threads?.length || 0})</h2>
                <div className="space-y-6">
                  {assets?.threads?.map((thread, index) => (
                    <motion.div
                      key={thread.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Thread {index + 1}</h3>
                        <Button size="sm" onClick={() => handleCopyAll(thread.tweets.map(t => ({ text: t })))}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy All
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {thread.tweets.map((tweet, i) => (
                          <div key={i} className="bg-gray-900 rounded-lg p-3 text-sm">
                            <span className="text-blue-500 font-semibold">{i + 1}/</span> {tweet}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Newsletters */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Email Newsletters ({assets?.newsletters?.length || 0})</h2>
                <div className="space-y-6">
                  {assets?.newsletters?.map((newsletter, index) => (
                    <motion.div
                      key={newsletter.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                    >
                      <Input
                        value={newsletter.subject}
                        className="mb-4 bg-gray-900 border-gray-700 text-white font-semibold"
                        placeholder="Subject line"
                      />
                      <Textarea
                        value={newsletter.body}
                        className="bg-gray-900 border-gray-700 text-white min-h-[200px]"
                        placeholder="Newsletter body"
                      />
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                        <Edit className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Pinterest Pins */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Pinterest Pins ({assets?.pins?.length || 0})</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {assets?.pins?.map((pin, index) => (
                    <motion.div
                      key={pin.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all"
                    >
                      <img src={pin.imageUrl} alt={pin.title} className="w-full aspect-[2/3] object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{pin.title}</h3>
                        <p className="text-sm text-gray-400">{pin.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Quote Graphics */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Quote Graphics ({assets?.quotes?.length || 0})</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {assets?.quotes?.map((quote, index) => (
                    <motion.div
                      key={quote.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all"
                    >
                      <div className="relative">
                        <img src={quote.imageUrl} alt="Quote background" className="w-full aspect-square object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                          <div>
                            <p className="text-lg font-semibold mb-2">"{quote.text}"</p>
                            <p className="text-sm text-gray-300">— {quote.author}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Audio Teasers */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Audio Teasers ({assets?.audioTeasers?.length || 0})</h2>
                <div className="space-y-4">
                  {assets?.audioTeasers?.map((audio, index) => (
                    <motion.div
                      key={audio.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <Button size="icon" variant="outline" className="border-gray-700">
                          <Play className="h-5 w-5" />
                        </Button>
                        <div>
                          <h3 className="font-semibold">{audio.title}</h3>
                          <p className="text-sm text-gray-400">{audio.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {audio.voiceCloned && (
                          <span className="text-xs bg-green-600/20 text-green-400 px-3 py-1 rounded-full">
                            Voice Cloned
                          </span>
                        )}
                        <div className="flex items-center text-sm text-gray-400">
                          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                          Est. 15k-30k views
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetPreviewPage;