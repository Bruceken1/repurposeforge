export const generateMockTranscript = () => {
  return `This is a mock transcript of the uploaded content. In a real scenario, this would be generated from speech-to-text processing. The transcript contains the full text of the audio or video content, which can be used for analysis and asset generation.`;
};

export const generateMockAssets = (projectId) => {
  return {
    shorts: [
      {
        id: `short_${Date.now()}_1`,
        type: 'short',
        title: 'Engaging Short Clip',
        duration: 15,
        thumbnail: 'mock-thumbnail-url',
        content: 'Mock short video content',
      },
    ],
    captions: [
      {
        id: `caption_${Date.now()}_1`,
        type: 'caption',
        text: 'This is a mock caption for the video content',
        style: 'modern',
      },
    ],
    hashtags: [
      { id: `hashtag_${Date.now()}_1`, tag: '#ContentCreation' },
      { id: `hashtag_${Date.now()}_2`, tag: '#SocialMedia' },
      { id: `hashtag_${Date.now()}_3`, tag: '#Viral' },
    ],
    titles: [
      { id: `title_${Date.now()}_1`, text: 'The Ultimate Guide to Content Creation' },
      { id: `title_${Date.now()}_2`, text: 'How to Go Viral: Expert Tips' },
    ],
    carousels: [
      {
        id: `carousel_${Date.now()}_1`,
        type: 'carousel',
        slides: [
          { text: 'Slide 1: Introduction', image: 'mock-image-1' },
          { text: 'Slide 2: Key Points', image: 'mock-image-2' },
          { text: 'Slide 3: Conclusion', image: 'mock-image-3' },
        ],
      },
    ],
    threads: [
      {
        id: `thread_${Date.now()}_1`,
        type: 'thread',
        tweets: [
          'Tweet 1: Opening statement',
          'Tweet 2: Key insight',
          'Tweet 3: Call to action',
        ],
      },
    ],
    newsletters: [
      {
        id: `newsletter_${Date.now()}_1`,
        type: 'newsletter',
        subject: 'Weekly Content Digest',
        content: 'Mock newsletter content with key insights and updates',
      },
    ],
    pins: [
      {
        id: `pin_${Date.now()}_1`,
        type: 'pin',
        title: 'Engaging Pinterest Pin',
        description: 'Mock pin description for Pinterest',
        image: 'mock-pin-image',
      },
    ],
    quotes: [
      {
        id: `quote_${Date.now()}_1`,
        text: 'The best time to create content is now.',
        author: 'Content Creator',
      },
    ],
    audioTeasers: [
      {
        id: `audio_${Date.now()}_1`,
        type: 'audio_teaser',
        duration: 30,
        format: 'mp3',
        content: 'Mock audio teaser content',
      },
    ],
  };
};

export const generateMockAnalytics = () => {
  return {
    assetViews: {
      shorts: 1200,
      threads: 450,
      carousels: 320,
      newsletters: 180,
      pins: 890,
      quotes: 560,
      audioTeasers: 240,
    },
    engagement: {
      shorts: 8.5,
      threads: 6.2,
      carousels: 5.8,
      newsletters: 4.3,
      pins: 7.1,
      quotes: 9.2,
      audioTeasers: 5.5,
    },
    topAssets: [
      {
        id: 'asset_1',
        type: 'short',
        title: 'Viral Short #1',
        views: 5400,
        engagement: 12.3,
      },
      {
        id: 'asset_2',
        type: 'quote',
        title: 'Inspirational Quote',
        views: 3200,
        engagement: 15.8,
      },
      {
        id: 'asset_3',
        type: 'thread',
        title: 'Trending Thread',
        views: 2100,
        engagement: 8.9,
      },
    ],
  };
};