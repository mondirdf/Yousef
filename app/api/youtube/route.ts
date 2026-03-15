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

async function fetchJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}

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
  const handleCandidates = [CHANNEL_HANDLE, `@${CHANNEL_HANDLE}`];

  for (const handle of handleCandidates) {
    const channelParams = new URLSearchParams({
      part: 'id',
      forHandle: handle,
      key: apiKey
    });

    const data = await fetchJson<{
      items?: Array<{ id?: string }>;
    }>(`https://www.googleapis.com/youtube/v3/channels?${channelParams.toString()}`);

    const channelId = data?.items?.[0]?.id;
    if (channelId) {
      return channelId;
    }
  }

  return null;
}

async function fetchLatestVideo(apiKey: string): Promise<LatestVideo> {
  const channelId = await fetchChannelId(apiKey);

  if (!channelId) {
    return FALLBACK.latestVideo;
  }

  const channelParams = new URLSearchParams({
    part: 'contentDetails',
    id: channelId,
    key: apiKey
  });

  const channelData = await fetchJson<{
    items?: Array<{
      contentDetails?: {
        relatedPlaylists?: {
          uploads?: string;
        };
      };
    }>;
  }>(`https://www.googleapis.com/youtube/v3/channels?${channelParams.toString()}`);

  const uploadsPlaylistId = channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    return FALLBACK.latestVideo;
  }

  const playlistParams = new URLSearchParams({
    part: 'snippet',
    playlistId: uploadsPlaylistId,
    maxResults: '1',
    key: apiKey
  });

  const data = await fetchJson<{
    items?: Array<{
      snippet?: {
        title?: string;
        resourceId?: { videoId?: string };
        thumbnails?: { high?: { url?: string } };
      };
    }>;
  }>(`https://www.googleapis.com/youtube/v3/playlistItems?${playlistParams.toString()}`);

  if (!data?.items?.length) {
    return FALLBACK.latestVideo;
  }

  const item = data.items[0];
  const videoId = item?.snippet?.resourceId?.videoId;

  if (!videoId) {
    return FALLBACK.latestVideo;
  }

  return {
    title: item.snippet?.title || FALLBACK.latestVideo.title,
    thumbnail: item.snippet?.thumbnails?.high?.url || FALLBACK.latestVideo.thumbnail,
    url: `https://youtube.com/watch?v=${videoId}`
  };
}

async function fetchSubscriberCount(apiKey: string): Promise<string> {
  const channelId = await fetchChannelId(apiKey);

  if (!channelId) {
    return FALLBACK.subscriberCount;
  }

  const channelParams = new URLSearchParams({
    part: 'statistics',
    id: channelId,
    key: apiKey
  });

  const data = await fetchJson<{
    items?: Array<{ statistics?: { subscriberCount?: string } }>;
  }>(`https://www.googleapis.com/youtube/v3/channels?${channelParams.toString()}`);

  return formatSubscriberCount(data?.items?.[0]?.statistics?.subscriberCount);
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
