import { NextResponse } from 'next/server';

type LatestVideo = {
  title: string;
  thumbnail: string;
  url: string;
};

type YouTubeResponse = {
  subscriberCount: string;
  latestVideo: LatestVideo;
};

const CHANNEL_HANDLE = 'ramzizrt';
const FALLBACK: YouTubeResponse = {
  subscriberCount: '--',
  latestVideo: {
    title: 'Latest upload from Ramzi ZRT',
    thumbnail: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg',
    url: 'https://youtube.com/watch?v=DWcJFNfaw9c'
  }
};

function formatSubscriberCount(rawCount: string | undefined): string {
  const count = Number(rawCount);

  if (!Number.isFinite(count) || count < 0) {
    return FALLBACK.subscriberCount;
  }

  if (count < 1_000) {
    return `${count}`;
  }

  if (count < 1_000_000) {
    const value = count / 1_000;
    return `${parseFloat(value.toFixed(1))}K`;
  }

  if (count < 1_000_000_000) {
    const value = count / 1_000_000;
    return `${parseFloat(value.toFixed(1))}M`;
  }

  const value = count / 1_000_000_000;
  return `${parseFloat(value.toFixed(1))}B`;
}

async function fetchChannelId(apiKey: string): Promise<string | null> {
  const channelParams = new URLSearchParams({
    part: 'id',
    forHandle: CHANNEL_HANDLE,
    key: apiKey
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?${channelParams.toString()}`, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    items?: Array<{ id?: string }>;
  };

  return data.items?.[0]?.id || null;
}

async function fetchLatestVideo(apiKey: string): Promise<LatestVideo> {
  const channelId = await fetchChannelId(apiKey);

  if (!channelId) {
    return FALLBACK.latestVideo;
  }

  const searchParams = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    order: 'date',
    maxResults: '1',
    channelId,
    key: apiKey
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams.toString()}`, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    return FALLBACK.latestVideo;
  }

  const data = (await response.json()) as {
    items?: Array<{
      id?: { videoId?: string };
      snippet?: {
        title?: string;
        thumbnails?: { high?: { url?: string } };
      };
    }>;
  };

  const item = data.items?.[0];
  const videoId = item?.id?.videoId;

  if (!videoId) {
    return FALLBACK.latestVideo;
  }

  return {
    title: item?.snippet?.title || FALLBACK.latestVideo.title,
    thumbnail: item?.snippet?.thumbnails?.high?.url || FALLBACK.latestVideo.thumbnail,
    url: `https://youtube.com/watch?v=${videoId}`
  };
}

async function fetchSubscriberCount(apiKey: string): Promise<string> {
  const channelParams = new URLSearchParams({
    part: 'statistics',
    forHandle: CHANNEL_HANDLE,
    key: apiKey
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?${channelParams.toString()}`, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    return FALLBACK.subscriberCount;
  }

  const data = (await response.json()) as {
    items?: Array<{ statistics?: { subscriberCount?: string } }>;
  };

  return formatSubscriberCount(data.items?.[0]?.statistics?.subscriberCount);
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(FALLBACK);
  }

  try {
    const [subscriberCount, latestVideo] = await Promise.all([
      fetchSubscriberCount(apiKey),
      fetchLatestVideo(apiKey)
    ]);

    return NextResponse.json({
      subscriberCount,
      latestVideo
    });
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
