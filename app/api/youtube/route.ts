import { NextResponse } from 'next/server';

type YouTubeRssResponse = {
  subscribers: string;
  latestVideoId: string;
  latestVideoThumbnail: string;
  latestVideoUrl: string;
  latestVideoTitle: string;
};

const CHANNEL_HANDLE_URL = 'https://www.youtube.com/@Redblick';
const FALLBACK_VIDEO_ID = 'DWcJFNfaw9c';
const FALLBACK_SUBSCRIBERS = '10.3K';
const FALLBACK: YouTubeRssResponse = {
  subscribers: FALLBACK_SUBSCRIBERS,
  latestVideoId: FALLBACK_VIDEO_ID,
  latestVideoThumbnail: `https://i.ytimg.com/vi/${FALLBACK_VIDEO_ID}/hqdefault.jpg`,
  latestVideoUrl: `https://youtube.com/watch?v=${FALLBACK_VIDEO_ID}`,
  latestVideoTitle: 'Latest upload from Youcef RDBK'
};

async function fetchText(url: string): Promise<string | null> {
  const response = await fetch(url, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    return null;
  }

  return response.text();
}

function extractLatestVideoFromFeed(feedXml: string): { videoId: string; title: string } | null {
  const entryMatch = feedXml.match(/<entry>[\s\S]*?<\/entry>/i);
  if (!entryMatch) {
    return null;
  }

  const videoIdMatch = entryMatch[0].match(/<yt:videoId>([^<]+)<\/yt:videoId>/i);
  if (!videoIdMatch?.[1]) {
    return null;
  }

  const titleMatch = entryMatch[0].match(/<title>([^<]+)<\/title>/i);

  return {
    videoId: videoIdMatch[1].trim(),
    title: titleMatch?.[1]?.trim() || FALLBACK.latestVideoTitle
  };
}

function extractChannelId(channelHtml: string): string | null {
  const canonicalMatch = channelHtml.match(
    /<link\s+rel=["']canonical["']\s+href=["']https:\/\/www\.youtube\.com\/channel\/([^"']+)["']/i
  );

  return canonicalMatch?.[1] ?? null;
}

function normalizeSubscribers(rawValue: string): string | null {
  const compactValue = rawValue
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const numberMatch = compactValue.match(/([\d.,]+\s*[KMB]?)/i);
  if (!numberMatch) {
    return null;
  }

  return numberMatch[1].replace(/\s+/g, '').toUpperCase();
}

function extractSubscribers(channelHtml: string): string {
  const subscriberCountTextMatch = channelHtml.match(
    /"subscriberCountText"\s*:\s*\{\s*"simpleText"\s*:\s*"([^\"]+)"/i
  );

  if (subscriberCountTextMatch?.[1]) {
    const normalized = normalizeSubscribers(subscriberCountTextMatch[1]);
    if (normalized) {
      return normalized;
    }
  }

  const genericSubscribersMatch = channelHtml.match(/([\d.,]+\s*[KMB]?)\s+subscribers?/i);
  if (genericSubscribersMatch?.[1]) {
    const normalized = normalizeSubscribers(genericSubscribersMatch[1]);
    if (normalized) {
      return normalized;
    }
  }

  return FALLBACK_SUBSCRIBERS;
}

function buildPayload(videoId: string, subscribers: string, title: string): YouTubeRssResponse {
  return {
    subscribers,
    latestVideoId: videoId,
    latestVideoThumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    latestVideoUrl: `https://youtube.com/watch?v=${videoId}`,
    latestVideoTitle: title
  };
}

export async function GET() {
  try {
    const channelHtml = await fetchText(CHANNEL_HANDLE_URL);
    if (!channelHtml) {
      return NextResponse.json(FALLBACK);
    }

    const subscribers = extractSubscribers(channelHtml);

    const channelId = extractChannelId(channelHtml);
    if (!channelId) {
      return NextResponse.json({
        ...FALLBACK,
        subscribers
      });
    }

    const feedXml = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    if (!feedXml) {
      return NextResponse.json({
        ...FALLBACK,
        subscribers
      });
    }

    const latestVideo = extractLatestVideoFromFeed(feedXml);
    if (!latestVideo) {
      return NextResponse.json({
        ...FALLBACK,
        subscribers
      });
    }

    return NextResponse.json(buildPayload(latestVideo.videoId, subscribers, latestVideo.title));
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
